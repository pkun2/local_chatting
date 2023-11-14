import admin from "firebase-admin";
import serviceAccount from "../i-dont-know-chat-firebase-adminsdk-hddfm-84d128f814.json"
// Fetch the service account key JSON file contents

// Initialize the app with a custom auth variable, limiting the server's access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://i-dont-know-chat-default-rtdb.firebaseio.com/",
  databaseAuthVariableOverride: {
    uid: "pkun"
  }
});
// The app only has access as defined in the Security Rules
const db = admin.database();
export default db;