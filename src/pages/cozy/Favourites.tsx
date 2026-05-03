import AppShell from "@/components/cozy/AppShell";
import HotelCard from "@/components/cozy/HotelCard";
import { hotels } from "@/data/hotels";
import { useApp } from "@/context/AppContext";
import { Heart } from "lucide-react";

export default function Favourites() {
  const { favourites } = useApp();
  const list = hotels.filter((h) => favourites.includes(h.id));
  return (
    <AppShell>
      <header className="px-5 pt-6 pb-2">
        <h1 className="font-display font-bold text-2xl">Favourites</h1>
        <p className="text-sm text-muted-foreground">Saved cozy stays</p>
      </header>
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {list.map((h) => <HotelCard key={h.id} hotel={h} />)}
      </div>
      {list.length === 0 && (
        <div className="px-5 mt-8 card-soft mx-5 p-8 text-center">
          <Heart className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 font-semibold">No favourites yet</p>
        </div>
      )}
    </AppShell>
  );
}
