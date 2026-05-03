import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart, Share2, Star, ShieldCheck, Compass, Wifi, Coffee, Car, Camera, BadgeCheck, ChevronRight } from "lucide-react";
import AppShell from "@/components/cozy/AppShell";
import { getHotel } from "@/data/hotels";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const amenityIcons: Record<string, any> = {
  "Free Wi-Fi": Wifi, Pool: ShieldCheck, Breakfast: Coffee, Parking: Car, CCTV: Camera, "Verified Staff": BadgeCheck, Heating: Coffee,
};

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = getHotel(id || "");
  const { favourites, toggleFavourite } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState<"Overview" | "Rooms" | "Amenities" | "Reviews">("Overview");

  if (!hotel) return <AppShell><div className="p-8 text-center">Hotel not found</div></AppShell>;
  const fav = favourites.includes(hotel.id);

  return (
    <AppShell hideNav>
      <div className="relative">
        <img src={hotel.images[imgIdx]} alt={hotel.name} className="w-full h-72 object-cover" />
        <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-card/90 backdrop-blur"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex gap-2">
            <button className="h-10 w-10 grid place-items-center rounded-full bg-card/90"><Share2 className="h-4 w-4" /></button>
            <button onClick={() => toggleFavourite(hotel.id)} className="h-10 w-10 grid place-items-center rounded-full bg-card/90">
              <Heart className={`h-4 w-4 ${fav ? "fill-danger text-danger" : ""}`} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 chip bg-primary/80 text-primary-foreground">
          {imgIdx + 1}/{hotel.images.length}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {hotel.images.map((_, i) => (
            <button key={i} onClick={() => setImgIdx(i)} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-6 bg-card" : "w-1.5 bg-card/60"}`} />
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 pb-32">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip bg-safety/10 text-safety"><ShieldCheck className="h-3 w-3" /> {hotel.safetyScore}% Safe</span>
          {hotel.has360 && <span className="chip bg-primary/10 text-primary"><Compass className="h-3 w-3" /> 360° Rooms</span>}
        </div>
        <div className="flex items-start justify-between mt-3 gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl">{hotel.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{hotel.location}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-accent text-accent" /><span className="font-bold">{hotel.rating}</span></div>
            <p className="text-[11px] text-muted-foreground">({hotel.reviews} reviews)</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          {hotel.amenities.slice(0, 4).map((a) => {
            const Icon = amenityIcons[a] || ShieldCheck;
            return (
              <div key={a} className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-secondary">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-center leading-tight">{a}</span>
              </div>
            );
          })}
          <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-secondary">
            <span className="text-sm font-bold text-primary">+{Math.max(hotel.amenities.length - 4, 0)}</span>
            <span className="text-[10px]">more</span>
          </div>
        </div>

        {/* Safety */}
        <div className="mt-5 card-soft bg-safety/10 p-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-safety/20 grid place-items-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-safety" />
          </div>
          <div>
            <p className="font-semibold text-sm text-safety">What you see is what you get</p>
            <p className="text-xs text-muted-foreground mt-0.5">Real 360° room views. No stock photos.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-5 border-b border-border text-sm">
          {(["Overview", "Rooms", "Amenities", "Reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 font-medium transition-colors ${tab === t ? "text-primary border-b-2 border-accent" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm">About the property</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{hotel.description}</p>
          </div>
        )}
        {tab === "Rooms" && (
          <div className="mt-4 space-y-3">
            {hotel.rooms.map((r) => (
              <Link to={`/booking/${hotel.id}?room=${r.id}`} key={r.id} className="block card-soft p-3 flex gap-3 items-center">
                <img src={hotel.image} alt={r.name} className="h-20 w-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{r.name}</p>
                  <p className="text-[11px] text-safety mt-1">● {r.safety}% Safe</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{r.guests} Guests · {r.beds}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm">₹{r.price.toLocaleString()}</p>
                  <button className="mt-1 px-3 py-1.5 text-xs rounded-full bg-primary text-primary-foreground font-medium">Select</button>
                </div>
              </Link>
            ))}
          </div>
        )}
        {tab === "Amenities" && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {hotel.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2 p-3 rounded-xl bg-secondary text-sm">
                <ShieldCheck className="h-4 w-4 text-safety" /> {a}
              </div>
            ))}
          </div>
        )}
        {tab === "Reviews" && (
          <div className="mt-4 text-sm text-muted-foreground">{hotel.reviews} verified reviews · Avg {hotel.rating}/5</div>
        )}

        <Link to="/safety" className="mt-5 flex items-center justify-between p-4 rounded-2xl bg-secondary">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-safety" />
            <span className="text-sm font-medium">Our Safety Promise</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Sticky booking bar */}
      <div className="fixed bottom-0 inset-x-0 z-30">
        <div className="mx-auto max-w-[480px] bg-card border-t border-border p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">₹{hotel.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ night</span></p>
            <p className="text-[11px] text-muted-foreground">Includes all taxes</p>
          </div>
          <button onClick={() => navigate(`/booking/${hotel.id}`)} className="h-12 px-6 rounded-full bg-accent text-accent-foreground font-semibold">
            Select Room
          </button>
        </div>
      </div>
    </AppShell>
  );
}
