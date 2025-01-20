import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';

export const getDashboardsConfig = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'config'));
    const doc = querySnapshot.docs.find(doc => doc.id === 'dashboards');
    
    if (doc) {
      const data = doc.data();
      console.log('Firestore data:', data);
      return data;
    } else {
      console.error('No dashboard configuration found!');
      return { panels: [] };
    }
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    return { panels: [] };
  }
};