import AppShell from "@/components/cozy/AppShell";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export default function Bookings() {
  const { bookings } = useApp();
  return (
    <AppShell>
      <header className="px-5 pt-6 pb-2">
        <h1 className="font-display font-bold text-2xl">My Bookings</h1>
        <p className="text-sm text-muted-foreground">Past and upcoming stays</p>
      </header>
      <div className="px-5 mt-4 space-y-3">
        {bookings.length === 0 && (
          <div className="card-soft p-8 text-center">
            <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-semibold">No bookings yet</p>
            <p className="text-xs text-muted-foreground mt-1">Your future stays will appear here.</p>
            <Link to="/listings" className="inline-block mt-4 px-5 h-10 leading-[2.5rem] rounded-full bg-primary text-primary-foreground text-sm font-medium">Find a stay</Link>
          </div>
        )}
        {bookings.map((b) => (
          <div key={b.id} className="card-soft p-3 flex gap-3 items-center">
            <img src={b.hotelImage} alt={b.hotelName} className="h-20 w-24 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{b.hotelName}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{b.checkIn} – {b.checkOut}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{b.guests} Guest · {b.rooms} Room</p>
              <span className="chip mt-2 bg-safety/10 text-safety">{b.status}</span>
            </div>
            <p className="text-sm font-bold">₹{b.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
