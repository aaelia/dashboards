import { collection, db, doc, getDoc, onSnapshot } from "../firebase";
import { useState, useEffect } from "react";

const JsonEditor = () => {
  const [jsonData, setJsonData] = useState(null);
  const docRef = doc(db, "dashboards", "0"); // Using the document ID "0" from the dashboards collection

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Firestore Data:", docSnap.data()); // Debugging
          setJsonData(docSnap.data()); // Assuming Firestore document is a JSON object
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
      }
    };

    fetchData();

    // Listen for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setJsonData(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>JSON Editor</h2>
      <pre>{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
};

export default JsonEditor;
