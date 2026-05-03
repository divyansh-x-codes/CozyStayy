import { useApp } from "@/context/AppContext";
import { Phone, BellRing, MapPin, X } from "lucide-react";

export default function SOSModal() {
  const { sosOpen, closeSOS } = useApp();
  if (!sosOpen) return null;
  const actions = [
    { icon: Phone, label: "Call Hotel", desc: "Direct line to front desk" },
    { icon: BellRing, label: "Alert Emergency Contact", desc: "Notify your trusted contact" },
    { icon: MapPin, label: "Share Live Location", desc: "Send to CozyStay safety team" },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/50 backdrop-blur-sm" onClick={closeSOS}>
      <div className="w-full max-w-[480px] bg-card rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-danger">Emergency SOS</h3>
            <p className="text-sm text-muted-foreground">Help is one tap away</p>
          </div>
          <button onClick={closeSOS} className="h-9 w-9 grid place-items-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          {actions.map((a) => (
            <button key={a.label} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary hover:bg-accent/20 transition-colors text-left">
              <div className="h-11 w-11 rounded-full bg-danger/10 text-danger grid place-items-center">
                <a.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">{a.label}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
