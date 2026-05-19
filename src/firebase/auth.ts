import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import app from "./config";
import { googleProvider } from "./providers";
import { syncUserToFirestore } from "./firestore";

export const auth = getAuth(app);

// Ensures user stays logged in across tabs and reloads
export const setupPersistentAuth = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error("Auth persistence error:", error);
  }
};

/**
 * Robust Google Sign In
 * Tries popup first. If popup is blocked (e.g. mobile browsers), falls back to redirect.
 */
export const signInWithGoogleRobust = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserToFirestore(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      console.warn("Popup blocked or closed. Falling back to redirect.");
      await signInWithRedirect(auth, googleProvider);
    } else {
      throw error;
    }
  }
};

/**
 * Checks for Google Sign In redirect result on mount
 */
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await syncUserToFirestore(result.user);
      return result.user;
    }
  } catch (error) {
    console.error("Redirect check error:", error);
  }
  return null;
};
