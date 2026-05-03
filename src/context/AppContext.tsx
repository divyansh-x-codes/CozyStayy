import { createContext, useContext, useState, ReactNode } from "react";

export type User = { name: string; email: string; phone: string; verified: boolean } | null;
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

type Ctx = {
  user: User;
  login: (u: NonNullable<User>) => void;
  logout: () => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  search: { location: string; checkIn: string; checkOut: string; guests: number; rooms: number };
  setSearch: (s: Ctx["search"]) => void;
  sosOpen: boolean;
  openSOS: () => void;
  closeSOS: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ name: "Aarav Sharma", email: "aarav@gmail.com", phone: "+91 98765 43210", verified: true });
  const [favourites, setFavourites] = useState<string[]>(["sea-breeze"]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState({ location: "Goa, India", checkIn: "29 Apr 2026", checkOut: "30 Apr 2026", guests: 2, rooms: 1 });
  const [sosOpen, setSosOpen] = useState(false);

  return (
    <AppCtx.Provider value={{
      user,
      login: (u) => setUser(u),
      logout: () => setUser(null),
      favourites,
      toggleFavourite: (id) => setFavourites((f) => f.includes(id) ? f.filter(x => x !== id) : [...f, id]),
      bookings,
      addBooking: (b) => setBookings((bs) => [b, ...bs]),
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
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
};
