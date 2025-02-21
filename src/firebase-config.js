// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApaBjbv4dRf635agJDCnby9EaX0B5ZGIA",
  authDomain: "shiv-logistics.firebaseapp.com",
  projectId: "shiv-logistics",
  storageBucket: "shiv-logistics.firebasestorage.app",
  messagingSenderId: "437094866784",
  appId: "1:437094866784:web:bf95f129b84370abbb0805",
  measurementId: "G-K00FCP5Y4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)