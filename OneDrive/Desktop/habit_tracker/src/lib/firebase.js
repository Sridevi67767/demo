// ============================================================
// FILE: src/lib/firebase.js
// PURPOSE: Connects your app to Firebase (database + auth)
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⬇️  STEP 1: Replace these values with YOUR Firebase project config.
// How to get them:
//   1. Go to https://console.firebase.google.com
//   2. Click "Add project" → give it a name → click through the steps
//   3. On the project home, click the </> (Web) icon to register your app
//   4. Copy the firebaseConfig object they show you and paste it here

const firebaseConfig = {
  apiKey: "AIzaSyDprG2UaqhhZe6w3W8-MKgFvN6S8xsjrWU",
  authDomain: "habitgrow-a11c1.firebaseapp.com",
  projectId: "habitgrow-a11c1",
  storageBucket: "habitgrow-a11c1.firebasestorage.app",
  messagingSenderId: "795381524231",
  appId: "1:795381524231:web:93c7a58a53b4c2038f47a2",
};

// Initialize Firebase — this sets everything up behind the scenes
const app = initializeApp(firebaseConfig);

// auth  → handles login / logout
// db    → your Firestore database (where habits + check-ins are stored)
// googleProvider → lets users sign in with their Google account
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
