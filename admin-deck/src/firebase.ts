import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjJaKI6SXNRlTMhrKIGcDVNOVHUxsjEO4",
  authDomain: "hotboxgaming-51dc2.firebaseapp.com",
  databaseURL: "https://hotboxgaming-51dc2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hotboxgaming-51dc2",
  storageBucket: "hotboxgaming-51dc2.firebasestorage.app",
  messagingSenderId: "167301436788",
  appId: "1:167301436788:web:8ca699ceab337408060821",
  measurementId: "G-1ZFGY4BJW2"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore Database with experimentalForceLongPolling to bypass sandboxed or corporate routing blockades
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
