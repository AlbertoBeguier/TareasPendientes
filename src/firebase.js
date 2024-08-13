import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmr_kZNo6VsETVv7UtTnKqb5HwhmDuXiY",
  authDomain: "tareasestudio-d66ad.firebaseapp.com",
  projectId: "tareasestudio-d66ad",
  storageBucket: "tareasestudio-d66ad.appspot.com",
  messagingSenderId: "311273520382",
  appId: "1:311273520382:web:104cf76440ca536157b9af",
  measurementId: "G-Z799WRK2TX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
