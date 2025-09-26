// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZzTQYUJY5wGDFF7rdl4ZqV4WlNRV6kQk",
  authDomain: "live-clipboard-a5614.firebaseapp.com",
  projectId: "live-clipboard-a5614",
  storageBucket: "live-clipboard-a5614.firebasestorage.app",
  messagingSenderId: "117323036943",
  appId: "1:117323036943:web:c1ccfcc7e09060bb71e67a",
  measurementId: "G-TV3SJ98WC9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
