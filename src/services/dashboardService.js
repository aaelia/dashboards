import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getDashboardsConfig = async () => {
  try {
    const docRef = doc(db, 'config', 'dashboards');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('No dashboard configuration found!');
      return { panels: [] };
    }
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    return { panels: [] };
  }
};