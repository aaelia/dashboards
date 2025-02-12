
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBHy5M2Uj4DpBBZJsXW-rhAJFHf97zO64Y",
    authDomain: "dashboards-558d9.firebaseapp.com",
    projectId: "dashboards-558d9",
    storageBucket: "dashboards-558d9.firebasestorage.app",
    messagingSenderId: "190722953739",
    appId: "1:190722953739:web:243c1ced3f6aaa1be82d0e",
 
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const database = getDatabase(app);

// export { database, ref, set, get, onValue };
export { db, collection, doc, getDoc, setDoc, onSnapshot };