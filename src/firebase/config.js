import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Default Firebase Configuration (Using demo project / fallback mode for offline/local resilience)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyKazakhstanAgency2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nebula-agency-kz.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nebula-agency-kz",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nebula-agency-kz.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109876543210",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109876543210:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Local storage fallback key for resilience when Firebase is offline/unconfigured
const LOCAL_LEADS_KEY = 'nebula_agency_local_leads';

// Initial default mock leads for admin demonstration
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

const getLocalLeads = () => {
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

// Firestore Lead Services with automatic graceful local fallback
export const createLead = async (leadData) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      status: 'new',
      createdAt: serverTimestamp()
    });
    // also cache locally
    saveLocalLead(leadData);
    return { id: docRef.id, success: true };
  } catch (error) {
    console.warn('Firebase error, saving lead locally:', error);
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
    console.warn('Firebase fetch error, using local database:', error);
    return getLocalLeads();
  }
};

export const updateLeadStatus = async (leadId, newStatus) => {
  try {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status: newStatus });
  } catch (error) {
    console.warn('Firebase update error, updating locally:', error);
  }
  // Always update local storage as well
  const existing = getLocalLeads();
  const updated = existing.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
  localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
  return updated;
};
