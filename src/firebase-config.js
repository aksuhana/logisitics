// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDbCGeIrpzvKHgH2gVYLjJh6spLCWyyUvM",
  authDomain: "logistic-test-6128b.firebaseapp.com",
  projectId: "logistic-test-6128b",
  storageBucket: "logistic-test-6128b.firebasestorage.app",
  messagingSenderId: "125594156039",
  appId: "1:125594156039:web:efab946c1845d2692dbea2",
  measurementId: "G-HJ6N6DPWRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)