import { useState, useEffect } from "react";
import { hotels } from "@/data/hotels";
import { TrendingUp, IndianRupee, Users, CalendarCheck, Loader2 } from "lucide-react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/context/AppContext";

export default function AdminOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    // Listen to all bookings for global stats
    const q = query(collection(db, "bookings"));
    const unsubBookings = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];
      setBookings(data);
      setLoading(false);
    });

    // Listen to users collection for active users count
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsersCount(snap.docs.length);
    });

    return () => {
      unsubBookings();
      unsubUsers();
    };
  }, []);

  const revenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0);

  const stats = [
    { icon: CalendarCheck, label: "Bookings", value: bookings.length, color: "bg-primary/10 text-primary" },
    { icon: IndianRupee, label: "Revenue", value: `₹${(revenue / 1000).toFixed(1)}K`, color: "bg-safety/10 text-safety" },
    { icon: Users, label: "Active Users", value: usersCount, color: "bg-accent/15 text-accent" },
    { icon: TrendingUp, label: "Conversion", value: "12.4%", color: "bg-danger/10 text-danger" }, // Still mocked as it requires complex analytics
  ];

  return (
    <div className="px-5 pt-5 space-y-5 pb-24">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Platform Overview</p>
        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="card-soft p-4">
                <div className={`h-9 w-9 rounded-xl grid place-items-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xl font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Top Properties</p>
        <div className="space-y-2">
          {hotels.slice(0, 4).map((h, i) => {
            // Calculate real revenue for each property if possible, else fallback to mock for now
            const propertyBookings = bookings.filter(b => b.hotelId === h.id);
            const propertyRevenue = propertyBookings.reduce((sum, b) => sum + b.total, 0);
            const displayRevenue = propertyRevenue > 0 ? propertyRevenue : (h.price * (12 - i * 2));

            return (
              <div key={h.id} className="card-soft p-3 flex items-center gap-3">
                <img src={h.image} className="h-12 w-12 rounded-xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{h.name}</p>
                  <p className="text-[11px] text-muted-foreground">{h.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹{displayRevenue.toLocaleString()}</p>
                  <p className="text-[11px] text-safety">+{18 - i * 3}% wk</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}