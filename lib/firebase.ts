// lib/firebase.ts - FINAL, STRICT TYPESCRIPT FIX

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Zaroori: Environment variables ko non-null assertion operator (!) se istemal karein
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Types ko explicit define karein, aur unhein 'null' hone ki ijazat dein
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// 🚨 Vercel Deployment Fix:
// Initialization sirf client-side (browser) par hogi, build-time (server) par nahi.
if (typeof window !== "undefined" && firebaseConfig.apiKey) {
  // Agar app pehle se initialized nahi hai, toh initialize karo
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
