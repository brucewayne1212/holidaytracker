import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDLhBNQg2E1cY768U0ZJC-eojEsK57MCGk",
  authDomain: "holidaytracker-94874.firebaseapp.com",
  projectId: "holidaytracker-94874",
  storageBucket: "holidaytracker-94874.firebasestorage.app",
  messagingSenderId: "449441787897",
  appId: "1:449441787897:web:93fe055eb729791dc19728",
  measurementId: "G-DT1HQRFTYH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);