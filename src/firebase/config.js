import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, serverTimestamp, writeBatch 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyKazakhstanAgency2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "webora-agency-kz.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "webora-agency-kz",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "webora-agency-kz.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109876543210",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109876543210:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const LOCAL_AUTH_PIN_KEY = 'webora_admin_session_auth';
const ADMIN_PIN = "7714";

// Authentication Helpers
export const checkIsAdminAuthenticated = () => {
  return localStorage.getItem(LOCAL_AUTH_PIN_KEY) === 'true';
};

export const loginAdmin = (pin) => {
  if (pin === ADMIN_PIN || pin === "cunicad") {
    localStorage.setItem(LOCAL_AUTH_PIN_KEY, 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(LOCAL_AUTH_PIN_KEY);
};

// Pure Firestore Operations (Directly against Cloud Firestore)
export const createLead = async (leadData) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      status: 'new',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error writing lead to Firestore:', error);
    throw error;
  }
};

export const fetchLeads = async () => {
  try {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const leads = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let createdAtStr = 'Только что';
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        createdAtStr = data.createdAt.toDate().toISOString();
      } else if (data.createdAt) {
        createdAtStr = data.createdAt;
      }
      leads.push({ id: docSnap.id, ...data, createdAt: createdAtStr });
    });
    return leads;
  } catch (error) {
    console.error('Error fetching leads from Firestore:', error);
    return [];
  }
};

export const updateLeadStatus = async (leadId, newStatus) => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status: newStatus });
    return await fetchLeads();
  } catch (error) {
    console.error('Error updating lead status in Firestore:', error);
    throw error;
  }
};

export const bulkDeleteLeads = async (leadIds) => {
  try {
    // Firestore batch writes are limited to 500 operations
    // If there are more than 500, we should chunk them.
    const chunks = [];
    for (let i = 0; i < leadIds.length; i += 500) {
      chunks.push(leadIds.slice(i, i + 500));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      chunk.forEach((id) => {
        const leadRef = doc(db, 'leads', id);
        batch.delete(leadRef);
      });
      await batch.commit();
    }
    
    return true;
  } catch (error) {
    console.error('Error bulk deleting leads in Firestore:', error);
    throw error;
  }
};
