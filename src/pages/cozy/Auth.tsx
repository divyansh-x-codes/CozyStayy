import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Logo from "@/components/cozy/Logo";
import heroRoom from "@/assets/hero-room.jpg";
import { ShieldCheck, Mail } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function Auth() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const googleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === "signup") {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Auth failed: Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[480px] min-h-screen flex flex-col">
        <div className="relative h-[38%] min-h-[300px]">
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
        <form onSubmit={submit} className="flex-1 bg-card text-foreground rounded-t-[32px] -mt-6 p-6 space-y-4">
          <div className="flex gap-2 p-1 bg-secondary rounded-full text-sm">
            {(["signup", "login"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={`flex-1 h-10 rounded-full font-semibold transition-colors ${mode === m ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
                {m === "signup" ? "Sign up" : "Login"}
              </button>
            ))}
          </div>
          
          <div className="space-y-3">
            {mode === "signup" && (
              <Input label="Full Name" value={name} onChange={setName} placeholder="Abhishek Pradhan" />
            )}
            <Input label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
            <Input label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-full bg-accent text-accent-foreground font-bold mt-2 shadow-lg shadow-accent/20 active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? "Processing..." : (mode === "signup" ? "Create Account" : "Continue")}
          </button>

          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <span className="relative px-2 bg-card text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
          </div>

          <button 
            type="button"
            onClick={googleSignIn}
            className="w-full h-14 rounded-full bg-white border border-border flex items-center justify-center gap-3 font-bold shadow-sm active:scale-[0.98] transition-transform"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="text-[11px] text-muted-foreground text-center px-6 leading-relaxed">
            By continuing you agree to our <span className="font-bold text-primary underline">Verified-stay policies</span> and Terms of Service.
          </p>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <label className="block p-3.5 rounded-2xl bg-secondary border border-transparent focus-within:border-primary/20 transition-colors">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">{label}</span>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full bg-transparent outline-none text-[15px] font-medium mt-0.5 px-1 placeholder:text-muted-foreground/30" 
      />
    </label>
  );
}
