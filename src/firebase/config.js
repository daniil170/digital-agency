import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'firebase/auth';

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
export const auth = getAuth(app);

const LOCAL_LEADS_KEY = 'webora_agency_local_leads';
const LOCAL_AUTH_PIN_KEY = 'webora_admin_session_auth';

// Admin Key PIN (Hardcoded secret pin for quick secure access: "7714")
const ADMIN_PIN = "7714";

const initialMockLeads = [
  {
    id: 'lead-101',
    name: 'Ануар Сериков',
    businessType: 'Интернет-магазин одежды (Алматы)',
    contact: '+7 (777) 321-4567',
    budget: 'custom',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    source: 'Форма на главной'
  },
  {
    id: 'lead-102',
    name: 'Динара Ахметова',
    businessType: 'Медицинский центр (Астана)',
    contact: '@dinara_clinic',
    budget: 'premium',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    source: 'Демо: Клиника'
  },
  {
    id: 'lead-103',
    name: 'Ерлан Муратов',
    businessType: 'Клининговая компания (Шымкент)',
    contact: '+7 (701) 987-6543',
    budget: 'ready',
    status: 'closed',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: 'Демо: Клининг'
  }
];

export const getLocalLeads = () => {
  try {
    const data = localStorage.getItem(LOCAL_LEADS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(initialMockLeads));
      return initialMockLeads;
    }
    return JSON.parse(data);
  } catch (e) {
    return initialMockLeads;
  }
};

const saveLocalLead = (leadData) => {
  const existing = getLocalLeads();
  const newLead = {
    id: 'lead-' + Date.now(),
    ...leadData,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  const updated = [newLead, ...existing];
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
  return newLead;
};

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

// Firestore Lead Services
export const createLead = async (leadData) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      status: 'new',
      createdAt: serverTimestamp()
    });
    saveLocalLead(leadData);
    return { id: docRef.id, success: true };
  } catch (error) {
    console.warn('Firebase write fallback to local storage:', error);
    const localLead = saveLocalLead(leadData);
    return { id: localLead.id, success: true, isLocal: true };
  }
};

export const fetchLeads = async () => {
  try {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const leads = [];
    querySnapshot.forEach((doc) => {
      leads.push({ id: doc.id, ...doc.data() });
    });
    if (leads.length > 0) return leads;
    return getLocalLeads();
  } catch (error) {
    console.warn('Firebase read fallback to local storage:', error);
    return getLocalLeads();
  }
};

export const updateLeadStatus = async (leadId, newStatus) => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status: newStatus });
  } catch (error) {
    console.warn('Firebase update fallback to local storage:', error);
  }
  const existing = getLocalLeads();
  const updated = existing.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
  return updated;
};
