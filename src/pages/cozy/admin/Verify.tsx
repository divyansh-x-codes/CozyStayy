import { useState } from "react";
import { hotels } from "@/data/hotels";
import { Check, X, ShieldCheck } from "lucide-react";

export default function AdminVerify() {
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});
  const queue = [
    { id: "new-1", name: "Sunset Beach Inn", location: "Anjuna, Goa", img: hotels[0].image },
    { id: "new-2", name: "Cedar Heights", location: "Shimla, HP", img: hotels[3].image },
    { id: "new-3", name: "Backwater Lodge", location: "Alleppey, Kerala", img: hotels[1].image },
  ];
  return (
    <div className="px-5 pt-5">
      <h2 className="font-display font-bold text-lg mb-3">Verification Queue</h2>
      <div className="space-y-3">
        {queue.map((q) => {
          const d = decisions[q.id];
          return (
            <div key={q.id} className="card-soft p-3">
              <div className="flex items-center gap-3">
                <img src={q.img} className="h-14 w-14 rounded-xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{q.name}</p>
                  <p className="text-[11px] text-muted-foreground">{q.location}</p>
                </div>
                {d && <span className={`chip ${d === "approved" ? "bg-safety/10 text-safety" : "bg-danger/10 text-danger"}`}>{d}</span>}
              </div>
              {!d && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setDecisions((s) => ({ ...s, [q.id]: "rejected" }))} className="flex-1 h-10 rounded-full bg-secondary font-semibold text-sm flex items-center justify-center gap-1">
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <button onClick={() => setDecisions((s) => ({ ...s, [q.id]: "approved" }))} className="flex-1 h-10 rounded-full bg-safety text-safety-foreground font-semibold text-sm flex items-center justify-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Mark Verified Safe
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}