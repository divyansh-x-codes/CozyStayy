import { Link } from "react-router-dom";
import { Heart, Star, ShieldCheck } from "lucide-react";
import { Hotel } from "@/data/hotels";
import { useApp } from "@/context/AppContext";

export default function HotelCard({ hotel, compact = false }: { hotel: Hotel; compact?: boolean }) {
  const { favourites, toggleFavourite } = useApp();
  const fav = favourites.includes(hotel.id);
  return (
    <Link to={`/hotel/${hotel.id}`} className={`block group ${compact ? "w-[200px] shrink-0" : "w-full"}`}>
      <div className="relative overflow-hidden rounded-[var(--radius)] shadow-soft">
        <img src={hotel.image} alt={hotel.name} loading="lazy" className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
        <button
          onClick={(e) => { e.preventDefault(); toggleFavourite(hotel.id); }}
          className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-card/90 grid place-items-center"
          aria-label="Favourite"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-danger text-danger" : "text-primary"}`} />
        </button>
        {hotel.isVerified && (
          <span className="absolute bottom-2.5 left-2.5 chip bg-card/95 text-safety">
            <ShieldCheck className="h-3 w-3" /> Verified Safe
          </span>
        )}
      </div>
      <div className="pt-3">
        <h3 className="font-semibold text-sm leading-tight">{hotel.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{hotel.location}</p>
        <div className="flex items-center gap-1 mt-1.5 text-xs">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-semibold">{hotel.rating}</span>
          <span className="text-muted-foreground">({hotel.reviews})</span>
        </div>
        <p className="mt-1 font-bold text-sm">₹{hotel.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ night</span></p>
      </div>
    </Link>
  );
}
