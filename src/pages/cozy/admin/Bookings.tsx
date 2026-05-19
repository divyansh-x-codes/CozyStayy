import { useState, useEffect } from "react";
import { Filter, BadgeCheck, ShieldAlert, Loader2 } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/context/AppContext";

export default function AdminBookings() {
  const [filter, setFilter] = useState<"all" | "minor" | "upcoming" | "completed">("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin reads all bookings in realtime
    const q = query(collection(db, "bookings"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA; // Newest first
      });
      setBookings(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === "minor") return b.minor;
    if (filter === "upcoming") return b.status === "Upcoming";
    if (filter === "completed") return b.status === "Completed";
    return true;
  });

  return (
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">Bookings Monitor</h2>
        <Filter className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {[
          { id: "all", label: "All" },
          { id: "upcoming", label: "Upcoming" },
          { id: "minor", label: "Minor bookings" },
          { id: "completed", label: "Completed" },
        ].map((f) => (
          <button 
            key={f.id} 
            onClick={() => setFilter(f.id as any)} 
            className={`chip whitespace-nowrap ${filter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 pb-24">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No bookings found.</p>
        ) : (
          filtered.map((b) => (
            <div key={b.id} className="card-soft p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm flex items-center gap-1.5">
                    {b.userName || "Guest"}
                    {b.minor && <ShieldAlert className="h-3.5 w-3.5 text-accent" />}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{b.id} · {b.hotelName}</p>
                </div>
                <span className={`chip text-[10px] ${b.status === "Upcoming" ? "bg-safety/10 text-safety" : b.status === "Cancelled" ? "bg-danger/10 text-danger" : "bg-secondary"}`}>
                  {b.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                <span>{b.checkIn} → {b.checkOut}</span>
                {b.minor ? (
                  <span className="text-accent font-semibold flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Guardian Verified</span>
                ) : (
                  <span>{b.location || "Location not set"}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}