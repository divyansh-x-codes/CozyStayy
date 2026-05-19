import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc, collection, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

export type User = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  age?: number;
  isVerified?: boolean;
  isAdult?: boolean;
} | null;

export type Booking = {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  total: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  guestId?: string;
  userName?: string;
  minor?: boolean;
  location?: string;
  createdAt?: any;
};

export type Notification = { id: string; title: string; desc: string; time: string; unread: boolean; type?: "booking" | "safety" | "promo" };

type Ctx = {
  user: User;
  loading: boolean;
  login: (u: NonNullable<User>) => void;
  logout: () => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  cancelBooking: (id: string) => void;
  notifications: Notification[];
  markAllRead: () => void;
  verifyWithDigiLocker: (dob: string) => Promise<void>;
  search: { location: string; checkIn: string; checkOut: string; guests: number; rooms: number };
  setSearch: (s: Ctx["search"]) => void;
  openSOS: () => void;
  closeSOS: () => void;
  resetVerification: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile, loading, logout: authLogout } = useAuth();

  const user: User = userProfile ? {
    uid: userProfile.uid,
    name: userProfile.name || "Cozy Traveler",
    email: userProfile.email || "",
    isVerified: (userProfile as any).isVerified || false,
    isAdult: (userProfile as any).isAdult || false,
    phone: (userProfile as any).phone || "",
    dob: (userProfile as any).dob || "",
    age: (userProfile as any).age || undefined,
  } : null;

  const [favourites, setFavourites] = useState<string[]>(["sea-breeze"]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", title: "Welcome to CozyStay", desc: "Enjoy your safe and comfortable travel experience.", time: "Just now", unread: true },
    { id: "n2", title: "New Safety Badge", desc: "CozyStay just launched 'Safe-Stay Verified'.", time: "5h ago", unread: false },
  ]);
  const [search, setSearch] = useState({ location: "Goa, India", checkIn: "29 Apr 2026", checkOut: "30 Apr 2026", guests: 2, rooms: 1 });
  const [sosOpen, setSosOpen] = useState(false);

  // Realtime Firestore Bookings Sync
  useEffect(() => {
    if (!userProfile) {
      setBookings([]);
      return;
    }
    const q = query(collection(db, "bookings"), where("guestId", "==", userProfile.uid));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];
      // Sort by newest first
      docs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      setBookings(docs);
    }, (err) => {
      console.error("Failed to sync bookings", err);
    });
    return unsub;
  }, [userProfile]);

  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const verifyWithDigiLocker = async (dob: string) => {
    const age = calculateAge(dob);
    const isAdult = age >= 18;
    const updates = { dob, age, isVerified: true, isAdult };
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), updates);
      } catch (e) {
        console.error("Failed to verify user in DB", e);
      }
    }
  };

  const resetVerification = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), { isVerified: false, isAdult: false, age: null, dob: null });
      } catch (e) {
        console.error("Failed to reset verification", e);
      }
    }
  };

  return (
    <AppCtx.Provider value={{
      user,
      loading,
      login: () => {},
      logout: authLogout,
      favourites,
      toggleFavourite: (id) => setFavourites((f) => f.includes(id) ? f.filter(x => x !== id) : [...f, id]),
      bookings,
      addBooking: async (b) => {
        if (!userProfile) return;
        try {
          // Optimistic UI update (optional, but helps perceived performance)
          setBookings(prev => [b, ...prev]);
          
          await setDoc(doc(db, "bookings", b.id), {
            ...b,
            guestId: userProfile.uid,
            userName: userProfile.name || userProfile.email || "Guest",
            createdAt: serverTimestamp()
          });
          
          setNotifications((ns) => [
            { id: Date.now().toString(), title: "Booking Confirmed", desc: `Your stay at ${b.hotelName} is confirmed.`, time: "Just now", unread: true, type: "booking" },
            ...ns
          ]);
        } catch (error) {
          console.error("Failed to create booking", error);
        }
      },
      cancelBooking: async (id) => {
        if (!userProfile) return;
        try {
          await updateDoc(doc(db, "bookings", id), { status: "Cancelled" });
          setNotifications((ns) => [
            { id: Date.now().toString(), title: "Booking Cancelled", desc: `Refund processed for Booking ${id}.`, time: "Just now", unread: true, type: "booking" },
            ...ns
          ]);
        } catch (error) {
          console.error("Failed to cancel booking", error);
        }
      },
      notifications,
      markAllRead: () => setNotifications((ns) => ns.map(n => ({ ...n, unread: false }))),
      verifyWithDigiLocker,
      search,
      setSearch,
      sosOpen,
      openSOS: () => setSosOpen(true),
      closeSOS: () => setSosOpen(false),
      resetVerification,
    }}>
      {children}
    </AppCtx.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppCtx);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
