import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

/**
 * Hook to protect routes that require authentication
 * @param redirectUrl - URL to redirect to if not authenticated (default: '/login')
 */
export const useRequireAuth = (redirectUrl: string = "/login") => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please log in to access this page");
      navigate(redirectUrl);
    }
  }, [currentUser, loading, navigate, redirectUrl]);

  return { currentUser, loading };
};
