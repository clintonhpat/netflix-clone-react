//  OUTDATED VERSION """"" import firebase from 'firebase' """""";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAV0As2QBbPLkxRuE1a_AomBmvPT7E3-eM",
    authDomain: "netflix-clone-portfolio-78eeb.firebaseapp.com",
    projectId: "netflix-clone-portfolio-78eeb",
    storageBucket: "netflix-clone-portfolio-78eeb.appspot.com",
    messagingSenderId: "1052657028040",
    appId: "1:1052657028040:web:a3989bba8e0683fc668efd"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  /* firestore() is the database we will be using through firebase */
  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { auth }
  export default db;