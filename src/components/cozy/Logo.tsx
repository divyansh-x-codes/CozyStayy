import { Home } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg border-2 border-accent grid place-items-center">
        <Home className="h-4 w-4 text-accent" strokeWidth={2.5} />
      </div>
      <span className={`font-display font-bold text-xl ${light ? "text-primary-foreground" : "text-primary"}`}>
        Cozy<span className="text-accent">Stay</span>
      </span>
    </div>
  );
}
