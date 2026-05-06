import { useState } from "react";
import { hotels } from "@/data/hotels";
import { Filter, BadgeCheck, ShieldAlert } from "lucide-react";

const seedBookings = [
  { id: "CS84219021", user: " Abhishek Pradhan", hotel: hotels[0], date: "29 Apr → 30 Apr", status: "Upcoming", minor: false, location: "Goa" },
  { id: "CS84219022", user: "Riya Verma (15)", hotel: hotels[1], date: "02 May → 04 May", status: "Upcoming", minor: true, location: "Goa" },
  { id: "CS84219023", user: "Karthik Iyer", hotel: hotels[2], date: "12 May → 14 May", status: "Pending", minor: false, location: "Goa" },
  { id: "CS84219024", user: "Meera Joshi", hotel: hotels[3], date: "20 May → 22 May", status: "Completed", minor: false, location: "Manali" },
  { id: "CS84219025", user: "Aarav Jr (12)", hotel: hotels[0], date: "25 May → 26 May", status: "Upcoming", minor: true, location: "Goa" },
];

export default function AdminBookings() {
  const [filter, setFilter] = useState<"all" | "minor" | "upcoming" | "completed">("all");
  const filtered = seedBookings.filter((b) => {
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
          <button key={f.id} onClick={() => setFilter(f.id as any)} className={`chip whitespace-nowrap ${filter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{f.label}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((b) => (
          <div key={b.id} className="card-soft p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  {b.user}
                  {b.minor && <ShieldAlert className="h-3.5 w-3.5 text-accent" />}
                </p>
                <p className="text-[11px] text-muted-foreground">{b.id} · {b.hotel.name}</p>
              </div>
              <span className={`chip text-[10px] ${b.status === "Upcoming" ? "bg-safety/10 text-safety" : b.status === "Pending" ? "bg-accent/15 text-accent" : "bg-secondary"}`}>{b.status}</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
              <span>{b.date}</span>
              {b.minor ? <span className="text-accent font-semibold flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Guardian Verified</span> : <span>{b.location}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}