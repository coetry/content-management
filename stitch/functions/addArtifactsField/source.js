exports = event => {
  const db = context.services.get("atlas").db("content");
  const user = db.collection("users").insertOne({
    _id: event.user.id,
    artifacts: []
  });
  return { user }
};
