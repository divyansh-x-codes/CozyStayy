import AppShell from "@/components/cozy/AppShell";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Compass, BadgeCheck, Camera, Siren, Headphones } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Verified Hotels", desc: "Government-verified properties" },
  { icon: Compass, title: "360° Room View", desc: "See exactly what you book" },
  { icon: BadgeCheck, title: "ID Verified Guests", desc: "Aadhaar / DigiLocker verified" },
  { icon: Camera, title: "CCTV Surveillance", desc: "Common areas under CCTV" },
  { icon: Siren, title: "One-tap SOS", desc: "24×7 emergency assistance" },
  { icon: Headphones, title: "24/7 Support", desc: "Real people, always here" },
];

export default function Safety() {
  const navigate = useNavigate();
  return (
    <AppShell hideNav>
      <header className="px-4 py-3 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><ChevronLeft className="h-5 w-5" /></button>
        <h1 className="font-display font-semibold flex-1 text-center -ml-9">Our Safety Promise</h1>
      </header>
      <div className="px-5 py-6 text-center">
        <div className="inline-block relative">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-safety/10 grid place-items-center">
            <ShieldCheck className="h-10 w-10 text-safety" />
          </div>
        </div>
        <h2 className="font-display font-bold text-2xl mt-4">Your safety is our<br />top priority</h2>
      </div>
      <div className="px-5 grid grid-cols-2 gap-3">
        {items.map((i) => (
          <div key={i.title} className="card-soft p-4">
            <i.icon className="h-5 w-5 text-safety" />
            <p className="font-semibold text-sm mt-2">{i.title}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{i.desc}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
