import AppShell from "@/components/cozy/AppShell";
import { MessageSquare, ShieldCheck } from "lucide-react";

const messages = [
  { id: 1, title: "Sea Breeze Resort", text: "Welcome! Your check-in is confirmed.", time: "2h", verified: true },
  { id: 2, title: "CozyStay Safety", text: "Your DigiLocker verification is complete.", time: "1d", verified: true },
  { id: 3, title: "The Lagoon Villa", text: "Thank you for choosing us!", time: "3d", verified: true },
];

export default function Inbox() {
  return (
    <AppShell>
      <header className="px-5 pt-6 pb-2">
        <h1 className="font-display font-bold text-2xl">Inbox</h1>
        <p className="text-sm text-muted-foreground">Messages from your stays</p>
      </header>
      <div className="px-5 mt-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="card-soft p-4 flex gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm truncate">{m.title}</p>
                {m.verified && <ShieldCheck className="h-3.5 w-3.5 text-safety" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.text}</p>
            </div>
            <span className="text-[11px] text-muted-foreground">{m.time}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
