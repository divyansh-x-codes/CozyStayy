import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Logo from "@/components/cozy/Logo";
import heroRoom from "@/assets/hero-room.jpg";
import { ShieldCheck } from "lucide-react";

export default function Auth() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ name: name || "Guest", email: email || "guest@cozystay.app", phone: phone || "+91 00000 00000", verified: true });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[480px] min-h-screen flex flex-col">
        <div className="relative h-[44%]">
          <img src={heroRoom} alt="Cozy room" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-primary" />
          <div className="relative p-6 h-full flex flex-col justify-between">
            <Logo light />
            <div>
              <h1 className="font-display font-bold text-3xl">Verified stays.<br />Real comfort. <span className="text-accent">Total peace of mind.</span></h1>
              <div className="mt-4 inline-flex items-center gap-2 chip bg-card/10 backdrop-blur text-primary-foreground">
                <ShieldCheck className="h-4 w-4 text-safety" />
                Book safe, verified stays across India
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="flex-1 bg-card text-foreground rounded-t-3xl -mt-4 p-6 space-y-4">
          <div className="flex gap-2 p-1 bg-secondary rounded-full text-sm">
            {(["signup", "login"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={`flex-1 h-9 rounded-full font-semibold transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {m === "signup" ? "Sign up" : "Login"}
              </button>
            ))}
          </div>
          {mode === "signup" && (
            <Input label="Full Name" value={name} onChange={setName} placeholder="Aarav Sharma" />
          )}
          <Input label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
          <Input label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
          <button type="submit" className="w-full h-12 rounded-full bg-accent text-accent-foreground font-semibold mt-2">
            {mode === "signup" ? "Create Account" : "Continue"}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">By continuing you agree to our verified-stay policies.</p>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <label className="block p-3 rounded-2xl bg-secondary">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none text-sm font-medium mt-0.5" />
    </label>
  );
}
