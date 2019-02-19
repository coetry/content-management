# Fullspeed Ahead with Atlas + Stitch + Gatsby + Now

Serverless apps free the developer from managing infrastructure
and dev-ops, which enables them to focus entirely on application logic and
user experience.

MongoDB Atlas and Stitch are two powerful solutions for data persistence,
user authentication, webhooks, event triggers, and communicating with external services.

This blog post gives a tour of Atlas and Stitch's mains features as well as a small tutorial to show you
how you to get up and running quickly.

## Atlas

MongoDB is a powerful open-source document datastore that provides:

- flexible JSON-like documents for changing data requirements
- a document model that maps naturally to objects in application code
- rich querying capabilities with built in [data processing facilities](https://docs.mongodb.com/manual/aggregation/)
- distributed architecture for high availablity, horizontal scaling, and geographic distribution

But what's the best way to host it? Enter Atlas: a fully managed database-as-a-service platorm provided by the makers of MongoDB that can be deployed to AWS, Azure, or GCP. Just like _Now_, Atlas scales as you grow and you can get started prototyping for free.d

Security, performance optimizations, and disaster recovery are all provdided out of the box. You can find more detailed information about Atlas on their [website](https://www.mongodb.com/cloud/atlas).

## Stitch

Every application needs some sort of user authentication and integration with external services to do anything meaningful. Stitch gets its name from enabling developers to stitch services and components together with ease.

### Authentication

Authentication providers for Email/Password, Facebook, and Google are built-in, but you're also able to [build your own](https://docs.mongodb.com/stitch/authentication/custom/). Upon successful authentication, your application has access to metadata about that user and you can define [Stitch functions](https://docs.mongodb.com/stitch/functions/) to take action whenever a user creates an account, logs in, or logs out.

### Roles and Permissions

Connecting to an Atlas cluster is supported as a first-class citizen by Sitch. Roles and Permissions allow you to protect read and write access to your data with minimal configuration. Take a look below how we created a role that is applied only when a user owns a document.

[screenshot]

You can use [filters](https://docs.mongodb.com/stitch/mongodb/filter-incoming-queries/) to restrict the number of documents that are processed per role as well as fields that are returned, which can improve performance and save bandwidth. Document schemas can also be enforced if more structure is required.

### External Services

Stitch comes with built-in service definitions for Twilio, AWS, and Github. This allows you to respond to incoming text messages, send outgoing text messages, call AWS services from Stitch functions, and react to pull requests, issues, or anything else that your application is concerned with. For any other RESTful HTTP Service, you can [define your own service configuration](https://docs.mongodb.com/stitch/services/http/) and create a custom webhook that reacts to events from that service accordingly.

### Triggers

As mentioned above, you can trigger functions to run on authentication events, but you can also trigger functions everytime a database operation is performed. Imagine a scenario where product inventory falls below a threshold and a function that communicates with Twilio is triggered to send a text message.

## Let's Build Something

To show you how simple it is to create an application with authentication and database services, we're going to build
a "thought log" where we can authenticate using a Google account and create or delete thoughts as they come to our mind.

Let's head over to the MongoDB [website](https://cloud.mongodb.com) to create a new account.

Upon account creation, we'll be prompted to select a cloud provider and a region. You can pick any free tier you wish. Click _Create Cluster_ when you've made your decision.

[screenshot]

Next, we need to add a whitelist of IP Addresses that can send requests to our clusters. To allow access from anywhere, we can use the wildcard range: `0.0.0.0/0`.

[webm video]

Now let's link a new Stitch App to our cluster so our client can leverage the Atlas database service. Give your application a name. It should link to Cluster0 by default, but if you had more than one cluster you could choose accordingly. You can also leave the default _Sitch Service Name_ as is, however any name could work.

[webm video]

After being redirected to our Stitch App, notice in the top left corner that an App ID, was generated for us. We will use that information to connect to Stitch from our client code. Let's proceed by enabling authentication with the built-in Google auth provider.

We'll need to create a new GCP project and generate OAuth credentials for our app. Follow Google's official [guide](https://cloud.google.com/resource-manager/docs/creating-managing-projects) on setting up a new project. After creating a new project, follow [these](https://support.google.com/cloud/answer/6158849?hl=en) instructions to set up OAuth credentials.

When you are configuring your OAuth consent screen, make sure to add `mongodb.com` in the list of _Authorized Domains_. When creating _Client ID_ credentials, add `https://stitch.mongodb.com` under _Authorized JavaScript Origins_ and the appropriate callback URL that corresponds to your cluster's region under _Authorized Redirect URIs_. Feel free to add the _Global_ callback URL in addition to your region specific callback as shown below.

| Region   | Callback URL                                                                |
| -------- | --------------------------------------------------------------------------- |
| Global   | https://stitch.mongodb.com/api/client/v2.0/auth/callback                    |
| Virginia | https://us-east-1.aws.stitch.mongodb.com/api/client/v2.0/auth/callback      |
| Oregon   | https://us-west-2.aws.stitch.mongodb.com/api/client/v2.0/auth/callback      |
| Ireland  | https://eu-west-1.aws.stitch.mongodb.com/api/client/v2.0/auth/callback      |
| Sydney   | https://ap-southeast-2.aws.stitch.mongodb.com/api/client/v2.0/auth/callback |

[webm video]

Once we have our _Client ID_ and _Client Secret_, we can head back to our Stitch dashboard and enable
the Google Auth Provider with our new credentials. Click on _Users_ in the left navigation and then click
on the _Providers_ tab. Locate _Google_ and then click _Edit_. Toggle the _Provider Status_ button to enable it.
Add the _Client ID_ and _Client Secret_ in the respective inputs. In the _Redirect URIs_ field, add a list of URIs
that a successful authentication will navigate back to. We'll add `http://localhost:8000/` for our local Gatsby development server and `https://thought-log.now.sh/` for our aliased deployment. You can change these values as needed for your own application. Pay special attention to the protocol and any trailing slashes. Stitch will not redirect to anything other than an exact match of URIs specified in this field.

[webm video]

With Auth fully configured and enabled, we can create a new database collection with rules to allow only document owners to read and write data. On the left navigation, click _Rules_. Then click _Add Collection_. For our database name, we'll use `thought-log` and we'll name our collection `thoughts`. Under the collection name, we're given a set of template rules to choose from. Select the template that matches _Users can only read and write their own data_. Finally, we need to specify a field that will link each document to a user. Let's use `owner_id`. Click _Add Collection_.

[webm video]

We've now successfully configured authentication and role based access to our database! Now it's time to move on to our client to tie everything together.

## Gatsby

Gatsby is a great choice for generating fast static apps and websites with React. We'll use Gatsby for
our frontend. To install the Gatsby CLI globally, we can run the following in our terminal:

```sh
  yarn global add gatsby-cli
```

Then we can start a new project locally with a minimal starter template:

```sh
gatsby new thought-log https://github.com/gatsbyjs/gatsby-starter-hello-world
```

Let's open up `src/pages/index.js` and start with our imports:

```jsx
import React, { useState, useEffect } from "react";
import {
	Stitch,
	RemoteMongoClient,
	GoogleRedirectCredential
} from "mongodb-stitch-browser-sdk";
```

We're importing `useState` and `useEffect` because our component
will keep track of local data and will instantiate a new Stitch
client after the first render. `Stitch`, `RemoteMongoClient`, and `GoogleRedirectCredential` are required for authentication and for
interacting with our Atlas cluster. Note that these modules only
work in a browser environment and so we use them after the component
has mounted to the DOM.

Next, let's define a few state variables so we can update our view as
the data changes:

```jsx
const IndexPage = () => {
	const [stitch, setStitch] = useState({
		client: null,
		db: null,
		thoughtsCollection: null
	});

	const [user, setUser] = useState({
		data: null,
		isLoggedIn: false
	});

	const [thoughts, setThoughts] = useState(null);

	const [newThought, setNewThought] = useState("");

	const [status, setStatus] = useState({
		sending: false,
		success: false,
		error: false
	});

	return <div>Hello World</div>;
};
```

The variables are responsible for the following:

- `stitch.client` : a reference to the main Stitch client
- `stitch.db`: a reference to the `thought-log` database in our Atlas cluster
- `stitch.thoughtsCollection`: a reference to the `thoughts` collection in our database
- `user.data`: an object containing a user metadata such as a `name`, and `email`
- `user.isLoggedIn`: boolean for whether the user is authenticated and logged in
- `newThought`: text for the new thought we would like to add to our collection
- `status.sending`: boolean flag toggled to _true_ when POST request is in flight, and _false_ when the request has succeeded or returned with an error
- `status.success`: boolean flag toggled to _true_ when request has succeeded
- `status.error`: boolean flag toggled to _true_ when request has returned with an error

Note that we are initializing the `stitch` and `user` objects to have fields that evaluate to `null` because the Stitch _browser sdk_ depends on the `window` object which
Gatsby does not have access to at _build time_. However, after a component mounts and
renders for the first time, we can call code that depends on browser
APIs in our `useEffect` [hook](https://reactjs.org/docs/hooks-intro.html):

```js
useEffect(() => {
	if (!stitch.client) {
		const client = Stitch.initializeAppClient("APP_ID");
		const db = client
			.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
			.db("thought-log");

		const thoughtsCollection = db.collection("thoughts");

		setStitch({ client, db, thoughtsCollection });
	}

	if (stitch.client && stitch.client.auth.hasRedirectResult()) {
		stitch.client.auth.handleRedirectResult().then(user => {
			setUser({ data: user.profile.data, isLoggedIn: true });
			console.log(user);
		});
	}
}, [stitch, user]);
```

If [`stitch.client`](https://docs.mongodb.com/stitch-sdks/js/4/interfaces/stitchappclient.html) is _not_ set, we call [`Stitch.initializeAppClient()`](https://docs.mongodb.com/stitch-sdks/js/4/classes/stitch.html#initializeappclient) with the _APP ID_ we got earlier when we first created our Stitch App. We also set references to the database
and collection.

If `stitch.client` _is_ set, we check whether or not an external login process has redirected the user to this page by calling [`stitch.client.auth.hasRedirectResult()`](https://docs.mongodb.com/stitch-sdks/js/4/interfaces/stitchauth.html#hasredirectresult). If there is a redirect result, we call [`stitch.client.auth.handleRedirectResult()`](https://docs.mongodb.com/stitch-sdks/js/4/interfaces/stitchauth.html#handleredirectresult) and set user profile information accordingly.

Notice that for the second argument to the `useEffect` hook, we are passing an array with the `stitch` and `user` objects as elements. This tells our component to re-render only when those objects change.

Let's have our component return a login button if the user is not logged in, and a form to add a new thought if the user is logged in:

```jsx
return (
	<div>
		{user.isLoggedIn ? (
			<>
				<h1>Hi {user.data.first_name}</h1>
				<form>
					<label> new thought</label>
					<input
						name='new-thought'
						value={newThought}
						onChange={e => setNewThought(e.target.value)}
					/>
					<button onClick={createNewThought}>create</button>
				</form>
			</>
		) : (
			<h1 onClick={login}>login</h1>
		)}
	</div>
);
```
