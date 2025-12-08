import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJ9hLxC4AN6oTalqDV2ywqhjbPk7cxAFs",
  authDomain: "ficha-clientas.firebaseapp.com",
  projectId: "ficha-clientas",
  storageBucket: "ficha-clientas.firebasestorage.app",
  messagingSenderId: "78140160829",
  appId: "1:78140160829:web:2b49a201f5ee62faa66354",
  measurementId: "G-SHWGS3L1Z6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);


