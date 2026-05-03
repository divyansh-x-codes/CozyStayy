import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, SlidersHorizontal, Star, ShieldCheck, Compass } from "lucide-react";
import AppShell from "@/components/cozy/AppShell";
import { hotels } from "@/data/hotels";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const tags = ["Safe Stays", "Budget", "Luxury", "Family"];

export default function Listings() {
  const { search } = useApp();
  const navigate = useNavigate();
  const [active, setActive] = useState("Safe Stays");

  return (
    <AppShell>
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-base truncate">{search.location}</h1>
            <p className="text-[11px] text-muted-foreground truncate">{search.checkIn} – {search.checkOut} · {search.guests} Guest · {search.rooms} Room</p>
          </div>
          <button className="chip bg-secondary text-primary px-3 py-2"><SlidersHorizontal className="h-3.5 w-3.5" /> Filters</button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="text-muted-foreground">{hotels.length} properties found</span>
          <button className="text-primary font-medium">Sort by ▾</button>
        </div>
      </header>

      <div className="px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`chip border whitespace-nowrap ${active === t ? "bg-accent/15 text-accent border-accent/30" : "bg-card border-border text-muted-foreground"}`}
          >
            {t === "Safe Stays" && <ShieldCheck className="h-3 w-3" />}
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-4">
        {hotels.map((h) => (
          <Link to={`/hotel/${h.id}`} key={h.id} className="block card-soft overflow-hidden">
            <div className="relative">
              <img src={h.image} alt={h.name} loading="lazy" className="w-full h-44 object-cover" />
              <span className="absolute top-2.5 left-2.5 chip bg-card/95 text-safety">
                <ShieldCheck className="h-3 w-3" /> {h.safetyScore}% Safe
              </span>
              {h.has360 && (
                <span className="absolute top-2.5 left-[112px] chip bg-card/95 text-primary">
                  <Compass className="h-3 w-3" /> 360°
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">{h.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{h.location}</p>
                </div>
                <div className="flex items-center gap-1 text-xs shrink-0">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="font-semibold">{h.rating}</span>
                  <span className="text-muted-foreground">({h.reviews})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {h.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="text-[11px] text-muted-foreground">· {a}</span>
                ))}
              </div>
              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="font-bold">₹{h.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ night</span></p>
                  <p className="text-[11px] text-muted-foreground">Includes all taxes</p>
                </div>
                <span className="chip bg-safety/10 text-safety">Lowest price</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
