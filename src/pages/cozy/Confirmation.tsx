import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import AppShell from "@/components/cozy/AppShell";
import { getHotel } from "@/data/hotels";
import { useApp } from "@/context/AppContext";

export default function Confirmation() {
  const { id } = useParams();
  const hotel = getHotel(id || "");
  const { bookings } = useApp();
  const booking = bookings[0];
  if (!hotel || !booking) return null;

  return (
    <AppShell hideNav>
      <div className="min-h-screen bg-safety flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center text-safety-foreground">
          <div className="h-24 w-24 rounded-full bg-card grid place-items-center shadow-float">
            <Check className="h-12 w-12 text-safety" strokeWidth={3} />
          </div>
          <h1 className="mt-6 font-display font-bold text-3xl">Booking Confirmed!</h1>
          <p className="mt-2 text-sm text-safety-foreground/90">Your stay is safe and cozy with CozyStay.</p>

          <div className="card-soft mt-8 w-full p-4 text-left text-foreground">
            <div className="flex gap-3 items-center">
              <img src={hotel.image} alt={hotel.name} className="h-16 w-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{hotel.name}</p>
                <p className="text-xs text-muted-foreground truncate">{hotel.location}</p>
              </div>
            </div>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between text-xs">
              <div>
                <p className="text-muted-foreground">Dates</p>
                <p className="font-semibold mt-0.5">{booking.checkIn} – {booking.checkOut}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Guests</p>
                <p className="font-semibold mt-0.5">{booking.guests} Guest · {booking.rooms} Room</p>
              </div>
            </div>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-semibold">{booking.id}</span>
            </div>
          </div>

          <div className="w-full mt-6 space-y-3">
            <Link to="/bookings" className="block w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold grid place-items-center">
              View Booking
            </Link>
            <Link to="/" className="block w-full h-12 rounded-full bg-card text-primary font-semibold grid place-items-center">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
