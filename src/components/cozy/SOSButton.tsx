import { Siren } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SOSButton() {
  const { openSOS } = useApp();
  return (
    <button
      onClick={openSOS}
      aria-label="Emergency SOS"
      className="fixed z-40 bottom-20 right-4 h-14 w-14 rounded-full bg-danger text-danger-foreground shadow-float grid place-items-center font-bold text-xs animate-pulse"
      style={{ boxShadow: "0 10px 30px hsl(var(--danger) / 0.45)" }}
    >
      <div className="flex flex-col items-center leading-none">
        <Siren className="h-4 w-4 mb-0.5" />
        SOS
      </div>
    </button>
  );
}
