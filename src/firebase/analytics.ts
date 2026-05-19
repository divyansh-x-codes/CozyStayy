import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import app from "./config";

// Initialize Analytics conditionally as it only works in browser environments
let analytics: ReturnType<typeof getAnalytics> | null = null;

export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    try {
      const supported = await isSupported();
      if (supported) {
        analytics = getAnalytics(app);
      }
    } catch (error) {
      console.error("Firebase Analytics initialization error:", error);
    }
  }
};

// Initialize it
initAnalytics();

/**
 * Standardized tracking events for CozyStay
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error(`Error logging event ${eventName}:`, error);
    }
  }
};

export const trackLogin = (method: "email" | "google") => {
  trackEvent("login", { method });
};

export const trackSignup = (method: "email" | "google") => {
  trackEvent("sign_up", { method });
};

export const trackPropertyView = (propertyId: string) => {
  trackEvent("view_item", {
    item_id: propertyId,
    content_type: "property"
  });
};

export const trackBookingAction = (action: "initiated" | "completed" | "cancelled", propertyId: string) => {
  trackEvent(`booking_${action}`, { propertyId });
};

export const trackWishlistAction = (action: "add" | "remove", propertyId: string) => {
  trackEvent(action === "add" ? "add_to_wishlist" : "remove_from_wishlist", {
    item_id: propertyId,
  });
};

export const trackSearch = (searchQuery: string) => {
  trackEvent("search", { search_term: searchQuery });
};
