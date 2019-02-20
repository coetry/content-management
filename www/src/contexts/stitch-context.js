import React, { useState, useEffect, createContext } from "react";
import { Stitch, RemoteMongoClient } from "mongodb-stitch-browser-sdk";

const StitchContext = createContext();

const StitchProvider = ({ children }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    import("mongodb-stitch-browser-sdk")
      .then(sdk => {
        const client = sdk.Stitch.initializeAppClient(
          "content-management-mkiko"
        );

        const db = client
          .getServiceClient(sdk.RemoteMongoClient.factory, "atlas")
          .db("content");

        const artifacts = db.collection("artifacts");

        console.log(db, artifacts);

        setState({
          client,
          user: client.auth.user,
          isLoggedIn: client.auth.isLoggedIn,
          db,
          artifacts
        });
      })
      .catch(console.error);
  }, []);

  return (
    <StitchContext.Provider value={{ state, setState }}>
      {children}
    </StitchContext.Provider>
  );
};

export { StitchContext, StitchProvider };
