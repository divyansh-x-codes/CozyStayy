import { useAuth } from "../contexts/AuthContext";

/**
 * Hook specifically to determine admin capability
 * Returns true if the user is authenticated and holds the admin role.
 */
export const useAdmin = () => {
  const { userProfile, loading } = useAuth();
  
  const isTargetAdmin = userProfile?.role === "admin" 
                     && userProfile?.email === "simplydivyanshk@gmail.com";
                     
  return {
    isAdmin: isTargetAdmin,
    loading
  };
};
