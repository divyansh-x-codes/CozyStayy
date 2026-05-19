import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "@/components/cozy/Logo";
import heroRoom from "@/assets/hero-room.jpg";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { syncUserToFirestore } from "@/firebase/firestore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [domainError, setDomainError] = useState(false);

  // Default redirect logic
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setDomainError(false);
      await signInWithGoogle();
      // AuthContext handles redirect to /admin or /dashboard automatically for fresh logins
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setDomainError(true);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      if (mode === "signup") {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        await syncUserToFirestore(res.user);
        toast.success("Account created successfully!");
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(res.user);
        toast.success("Welcome back!");
      }
      // AuthContext automatically watches for auth changes and redirects. 
      // But we can force it here just in case.
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered");
      } else if (err.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else {
        toast.error(err.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[480px] min-h-screen flex flex-col">
        <div className="relative h-[38%] min-h-[300px]">
          <img src={heroRoom} alt="Cozy room" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary" />
          <div className="relative p-6 h-full flex flex-col justify-between">
            <Logo light />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-display font-bold text-3xl">Verified stays.<br />Real comfort. <span className="text-accent">Total peace of mind.</span></h1>
              <div className="mt-4 inline-flex items-center gap-2 chip bg-card/10 backdrop-blur text-primary-foreground">
                <ShieldCheck className="h-4 w-4 text-safety" />
                Book safe, verified stays across India
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex-1 bg-card text-foreground rounded-t-[32px] -mt-6 p-6 flex flex-col"
        >
          <form onSubmit={submit} className="space-y-4">
            <div className="flex gap-2 p-1 bg-secondary rounded-full text-sm relative">
              {(["signup", "login"] as const).map((m) => (
                <button 
                  key={m} 
                  type="button" 
                  onClick={() => setMode(m)} 
                  className={`flex-1 h-10 rounded-full font-semibold transition-colors relative z-10 ${mode === m ? "text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {mode === m && (
                    <motion.div 
                      layoutId="auth-tab-active"
                      className="absolute inset-0 bg-primary rounded-full shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {m === "signup" ? "Sign up" : "Login"}
                </button>
              ))}
            </div>
            
            <div className="space-y-3 pt-2">
              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.9 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input label="Full Name" value={name} onChange={setName} placeholder="Abhishek Pradhan" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Input label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
              <Input label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
            </div>

            <button 
              type="submit" 
              disabled={loading || googleLoading}
              className="w-full h-14 rounded-full bg-accent text-accent-foreground font-bold mt-2 shadow-lg shadow-accent/20 active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Processing..." : (mode === "signup" ? "Create Account" : "Continue")}
            </button>
          </form>

          <div className="relative py-4 flex items-center justify-center mt-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <span className="relative px-2 bg-card text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full h-14 rounded-full bg-white border border-border flex items-center justify-center gap-3 font-bold shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50 text-black mb-4"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-5 w-5" />
            )}
            Continue with Google
          </button>

          <AnimatePresence>
            {domainError && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                className="bg-danger/10 border border-danger/20 rounded-xl p-4 mb-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold text-danger mb-1">Localhost / Domain Error</p>
                  <p className="text-muted-foreground leading-snug">
                    Firebase blocked the Google popup because you are accessing the app from an unauthorized URL (like 127.0.0.1). 
                    Please access the app using <strong className="text-foreground">http://localhost:8080</strong> in your browser instead.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[11px] text-muted-foreground text-center px-6 leading-relaxed mt-auto">
            By continuing you agree to our <span className="font-bold text-primary underline">Verified-stay policies</span> and Terms of Service.
          </p>
        </motion.div>
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
