import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
  sosOpen: boolean;
  openSOS: () => void;
  closeSOS: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    uid: "mock-uid",
    name: "Abhishek Pradhan",
    email: "abhishek....nee@gmail.com",
    phone: "+91 98765 XXXX",
    isVerified: false,
    isAdult: false,
  });
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<string[]>(["sea-breeze"]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", title: "Welcome to CozyStay", desc: "Enjoy your safe and comfortable travel experience.", time: "Just now", unread: true },
    { id: "n2", title: "New Safety Badge", desc: "CozyStay just launched 'Safe-Stay Verified'.", time: "5h ago", unread: false },
  ]);
  const [search, setSearch] = useState({ location: "Goa, India", checkIn: "29 Apr 2026", checkOut: "30 Apr 2026", guests: 2, rooms: 1 });
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          const newUser = {
            uid: fbUser.uid,
            name: fbUser.displayName || "Cozy Traveler",
            email: fbUser.email || "",
            isVerified: false,
            isAdult: false
          };
          await setDoc(doc(db, "users", fbUser.uid), newUser);
          setUser(newUser as User);
        }
      } else {
        // Do not overwrite the initial mock user on first load if not logged in.
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // For the demo, let's provide a default mock user on mount if we want the profile to show.
  // Actually, we can just intercept the logout function.
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

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
    const updates = {
      dob,
      age,
      isVerified: true,
      isAdult
    };

    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), updates);
        setUser({ ...user, ...updates });
      } catch (e) {
        setUser({ ...user, ...updates });
      }
    } else {
      // Mock user if not logged in
      setUser({
        uid: "mock-user",
        name: "Guest User",
        email: "guest@example.com",
        ...updates
      } as User);
    }
  };

  return (
    <AppCtx.Provider value={{
      user,
      loading,
      login: (u) => setUser(u),
      logout: handleLogout,
      favourites,
      toggleFavourite: (id) => setFavourites((f) => f.includes(id) ? f.filter(x => x !== id) : [...f, id]),
      bookings,
      addBooking: (b) => {
        setBookings((bs) => [b, ...bs]);
        setNotifications((ns) => [
          { id: Date.now().toString(), title: "Booking Confirmed", desc: `Your stay at ${b.hotelName} is confirmed.`, time: "Just now", unread: true, type: "booking" },
          ...ns
        ]);
      },
      cancelBooking: (id) => {
        setBookings((bs) => bs.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
        setNotifications((ns) => [
          { id: Date.now().toString(), title: "Booking Cancelled", desc: `Refund processed for Booking ${id}.`, time: "Just now", unread: true, type: "booking" },
          ...ns
        ]);
      },
      notifications,
      markAllRead: () => setNotifications((ns) => ns.map(n => ({ ...n, unread: false }))),
      verifyWithDigiLocker,
      search,
      setSearch,
      sosOpen,
      openSOS: () => setSosOpen(true),
      closeSOS: () => setSosOpen(false),
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
