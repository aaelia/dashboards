import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHy5M2Uj4DpBBZJsXW-rhAJFHf97zO64Y",
  authDomain: "dashboards-558d9.firebaseapp.com",
  projectId: "dashboards-558d9",
  storageBucket: "dashboards-558d9.firebasestorage.app",
  messagingSenderId: "190722953739",
  appId: "1:190722953739:web:243c1ced3f6aaa1be82d0e",
  measurementId: "G-YF99N9JJ9R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);