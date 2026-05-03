import { hotels } from "@/data/hotels";
import { useApp } from "@/context/AppContext";
import { TrendingUp, IndianRupee, Users, CalendarCheck } from "lucide-react";

export default function AdminOverview() {
  const { bookings } = useApp();
  const revenue = bookings.reduce((s, b) => s + b.total, 0) || 284500;
  const stats = [
    { icon: CalendarCheck, label: "Bookings", value: bookings.length || 142, color: "bg-primary/10 text-primary" },
    { icon: IndianRupee, label: "Revenue", value: `₹${(revenue / 1000).toFixed(1)}K`, color: "bg-safety/10 text-safety" },
    { icon: Users, label: "Active Users", value: 1284, color: "bg-accent/15 text-accent" },
    { icon: TrendingUp, label: "Conversion", value: "12.4%", color: "bg-danger/10 text-danger" },
  ];
  return (
    <div className="px-5 pt-5 space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">This Week</p>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="card-soft p-4">
              <div className={`h-9 w-9 rounded-xl grid place-items-center ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <p className="mt-3 text-xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Top Properties</p>
        <div className="space-y-2">
          {hotels.slice(0, 4).map((h, i) => (
            <div key={h.id} className="card-soft p-3 flex items-center gap-3">
              <img src={h.image} className="h-12 w-12 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{h.name}</p>
                <p className="text-[11px] text-muted-foreground">{h.location}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">₹{(h.price * (12 - i * 2)).toLocaleString()}</p>
                <p className="text-[11px] text-safety">+{18 - i * 3}% wk</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}