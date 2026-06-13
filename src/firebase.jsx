// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlC5jGWQgNWreHYzFYPGLUrJvKpv7DSNU",
  authDomain: "mundial2026-4af5f.firebaseapp.com",
  projectId: "mundial2026-4af5f",
  storageBucket: "mundial2026-4af5f.firebasestorage.app",
  messagingSenderId: "1055763089002",
  appId: "1:1055763089002:web:3c240cb6c29d2d9007ec13",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
