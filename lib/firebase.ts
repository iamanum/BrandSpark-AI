// lib/firebase.ts - FINAL FIX FOR VERCEL DEPLOYMENT

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Sirf woh keys lein jinse hamara Firebase app initialize hota hai
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Yeh check lagana sab se zaroori hai.
// Agar API Key nahi hai (build time par), toh app ko initialize mat karo.
// Isse Vercel build karte waqt crash nahi hoga.
const IS_FIREBASE_CONFIG_VALID = 
    typeof window !== 'undefined' && 
    firebaseConfig.apiKey && 
    firebaseConfig.projectId;


let app;
let auth;
let db;

if (IS_FIREBASE_CONFIG_VALID) {
    // Agar app pehle se initialized nahi hai, toh initialize karo
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // Build time ya ghalat config par inko null set kar dein
    app = null;
    auth = null;
    db = null;
}

export { app, auth, db };