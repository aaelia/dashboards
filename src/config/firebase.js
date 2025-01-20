import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore/lite';

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
const db = getFirestore(app);

// Enable CORS for development
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { db };