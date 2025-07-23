// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD3GZYl-9d3mH9UzoOHDPSftGTlcfojkr0",
  authDomain: "shop-easy-ac7ce.firebaseapp.com",
  projectId: "shop-easy-ac7ce",
  storageBucket: "shop-easy-ac7ce.appspot.com", // ✅ Fixed: .app not storage domain
  messagingSenderId: "203480695350",
  appId: "1:203480695350:web:d42521dc38322b0323ce97",
  measurementId: "G-HGLFX7MFQH",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

// ✅ Optional: Analytics (only on client/browser)
isSupported().then((enabled) => {
  if (enabled) {
    getAnalytics(app);
  }
});
