import { GoogleAuthProvider } from "firebase/auth";

export const googleProvider = new GoogleAuthProvider();

// Request basic profile info and email
googleProvider.addScope("profile");
googleProvider.addScope("email");

// Optional: Force account selection even if one is already logged in
googleProvider.setCustomParameters({
  prompt: "select_account"
});
