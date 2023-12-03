import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/database"
// Fetch the service account key JSON file contents

const firebaseConfig = {
  apiKey: "AIzaSyCS35uDckRiNGOQkXTaxzdrUpvcKT8iQlg",
  authDomain: "i-dont-know-chat.firebaseapp.com",
  databaseURL: "https://i-dont-know-chat-default-rtdb.firebaseio.com",
  projectId: "i-dont-know-chat",
  storageBucket: "i-dont-know-chat.appspot.com",
  messagingSenderId: "406641026438",
  appId: "1:406641026438:web:a46fedeb94836fed023807",
  measurementId: "G-FD97QM1ZNW"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const rtDB = firebase.database();


