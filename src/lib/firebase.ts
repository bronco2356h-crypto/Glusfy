import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export type Lead = {
  timestamp: Date;
  nombre?: string;
  email: string;
  telefono: string;
  espacio: 'baño' | 'cocina';
  nivel: 'esencial' | 'premium';
  paletaElegida: string;
  url_foto_subida: string;
  url_render_generado: string;
  precio_total: number;
  estado: 'nuevo' | 'contactado' | 'cerrado';
};

export const saveLead = async (lead: Omit<Lead, 'timestamp' | 'estado'>) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...lead,
      timestamp: new Date(),
      estado: 'nuevo'
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};
