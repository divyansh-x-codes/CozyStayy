import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut, getIdToken } from "firebase/auth";
import { auth, setupPersistentAuth, checkRedirectResult, signInWithGoogleRobust } from "../firebase/auth";
import { syncUserToFirestore, UserDocument } from "../firebase/firestore";
import { isAdmin } from "../firebase/admin";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserDocument | null;
  loading: boolean;
  isAdminUser: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Setup persistent sessions
    setupPersistentAuth();

    // 2. Check if coming back from mobile Google redirect
    checkRedirectResult().then((user) => {
      if (user) {
        toast.success("Signed in successfully!");
      }
    });

    // 3. Listen to realtime auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Force token refresh on login to ensure latest claims
          await getIdToken(user, true);
          
          const profile = await syncUserToFirestore(user);
          setCurrentUser(user);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error syncing profile:", error);
          toast.error("Failed to load user profile");
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 4. Reactive Navigation
  // This solves the React race condition where imperative navigation inside onAuthStateChanged
  // executes before the context state (currentUser) has propagated to the ProtectedRoute components.
  useEffect(() => {
    if (!loading && currentUser && userProfile) {
      if (location.pathname === "/auth" || location.pathname === "/login") {
        if (userProfile.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          // Use location.state.from if available, otherwise default to "/"
          const from = location.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        }
      }
    }
  }, [loading, currentUser, userProfile, location.pathname, navigate, location.state]);

  const signInWithGoogle = async () => {
    try {
      await signInWithGoogleRobust();
      toast.success("Successfully signed in with Google!");
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        toast.error("Security Error: This URL is not authorized. Please access via localhost.");
      } else if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(error.message || "Failed to sign in with Google");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      isAdminUser: isAdmin(userProfile),
      signInWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
