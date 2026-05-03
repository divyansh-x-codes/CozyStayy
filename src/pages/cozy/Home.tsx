import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, MapPin, Calendar, Users, Search, ShieldCheck, Compass, Siren, BadgeCheck, ChevronRight, ShieldHalf } from "lucide-react";
import AppShell from "@/components/cozy/AppShell";
import Logo from "@/components/cozy/Logo";
import HotelCard from "@/components/cozy/HotelCard";
import { hotels } from "@/data/hotels";
import { useApp } from "@/context/AppContext";
import heroRoom from "@/assets/hero-room.jpg";

const features = [
  { icon: ShieldCheck, label: "Verified Stays", color: "bg-safety/10 text-safety" },
  { icon: Compass, label: "360° View", color: "bg-primary/10 text-primary" },
  { icon: Siren, label: "One-tap SOS", color: "bg-danger/10 text-danger" },
  { icon: BadgeCheck, label: "ID Verified", color: "bg-accent/15 text-accent" },
];

export default function Home() {
  const { search } = useApp();
  const navigate = useNavigate();
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative text-primary-foreground">
        <img src={heroRoom} alt="Cozy hotel room at dusk" className="absolute inset-0 h-[460px] w-full object-cover" width={1280} height={1600} />
        <div className="absolute inset-0 h-[460px] bg-gradient-to-b from-primary/70 via-primary/55 to-primary/95" />
        <div className="relative px-5 pt-5">
          <div className="flex items-center justify-between">
            <button className="h-10 w-10 grid place-items-center rounded-full bg-card/10 backdrop-blur"><Menu className="h-5 w-5" /></button>
            <Logo light />
            <button className="h-10 w-10 grid place-items-center rounded-full bg-card/10 backdrop-blur relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
            </button>
          </div>
          <div className="mt-10">
            <h1 className="font-display font-bold text-4xl leading-[1.1]">
              Feel safe.<br />Stay <span className="text-accent">cozy.</span>
            </h1>
            <p className="mt-3 text-sm text-primary-foreground/80 max-w-[260px]">
              Verified stays. Real comfort.<br />Total peace of mind.
            </p>
          </div>

          {/* Search card */}
          <div className="mt-6 card-soft p-4 space-y-3 text-foreground">
            <SearchRow icon={MapPin} label="Where are you going?" value={search.location} />
            <div className="border-t border-border" />
            <div className="grid grid-cols-2 gap-2">
              <SearchRow icon={Calendar} label="Check-in" value={search.checkIn} compact />
              <SearchRow label="Check-out" value={search.checkOut} compact />
            </div>
            <div className="border-t border-border" />
            <SearchRow icon={Users} label="Guests & Rooms" value={`${search.guests} Guests · ${search.rooms} Room`} />
            <button
              onClick={() => navigate("/listings")}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 mt-1 hover:opacity-95 transition-opacity"
            >
              <Search className="h-4 w-4" /> Search Stays
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 mt-6">
        <ul className="grid grid-cols-4 gap-2">
          {features.map((f) => (
            <li key={f.label} className="flex flex-col items-center text-center gap-2">
              <div className={`h-14 w-14 rounded-2xl grid place-items-center ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-medium leading-tight">{f.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular */}
      <section className="mt-7 pl-5">
        <div className="flex items-center justify-between pr-5 mb-3">
          <h2 className="font-display font-bold text-lg">Popular Stays</h2>
          <Link to="/listings" className="text-sm text-accent font-medium flex items-center gap-1">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 pr-5 scrollbar-none">
          {hotels.map((h) => <HotelCard key={h.id} hotel={h} compact />)}
        </div>
      </section>

      {/* Why CozyStay */}
      <section className="px-5 mt-6 mb-6">
        <div className="card-soft bg-accent/10 p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary grid place-items-center text-accent shrink-0">
            <ShieldHalf className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold">Why CozyStay?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Every stay is verified for your safety and comfort.</p>
          </div>
          <button className="h-9 w-9 rounded-full bg-card grid place-items-center shadow-soft">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </AppShell>
  );
}

function SearchRow({ icon: Icon, label, value, compact = false }: { icon?: any; label: string; value: string; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {Icon && <div className="h-10 w-10 rounded-full bg-primary grid place-items-center text-primary-foreground shrink-0"><Icon className="h-4 w-4" /></div>}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className={`font-semibold ${compact ? "text-sm" : "text-[15px]"} truncate`}>{value}</div>
      </div>
      {!compact && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
}
