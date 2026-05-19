import { initializeApp, getApps, getApp } from "firebase/app";

/**
 * PRODUCTION FIREBASE CONFIGURATION
 * Loads from environment variables.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// PREVENT MULTIPLE INITIALIZATION
// Very important for hot-reloading in dev environments
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;
