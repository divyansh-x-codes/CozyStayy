import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import app from "./config";

export const db = getFirestore(app);

export interface UserDocument {
  uid: string;
  name: string | null;
  email: string | null;
  role: "admin" | "user";
  profileImage: string | null;
  createdAt: any;
  lastLogin: any;
  isBanned: boolean;
}

const ADMIN_EMAIL = "simplydivyanshk@gmail.com";

/**
 * Creates or updates a user document in Firestore.
 * Automatically checks and assigns the admin role if it matches ADMIN_EMAIL.
 */
export const syncUserToFirestore = async (user: any): Promise<UserDocument> => {
  if (!user) throw new Error("No user provided to sync");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // Determine role
  const isTargetAdmin = user.email === ADMIN_EMAIL;
  
  if (!userSnap.exists()) {
    // New user creation
    const newUser: UserDocument = {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      role: isTargetAdmin ? "admin" : "user",
      profileImage: user.photoURL || "",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isBanned: false
    };
    
    await setDoc(userRef, newUser);
    return newUser;
  } else {
    // Existing user - update last login
    const existingData = userSnap.data() as UserDocument;
    
    // Safety check - force admin role if it's the designated email but somehow lost it
    const updatedRole = isTargetAdmin ? "admin" : existingData.role;
    
    const updateData = {
      lastLogin: serverTimestamp(),
      role: updatedRole
    };
    
    await setDoc(userRef, updateData, { merge: true });
    
    return {
      ...existingData,
      role: updatedRole,
    };
  }
};
