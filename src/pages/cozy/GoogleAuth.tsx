import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Logo from "@/components/cozy/Logo";
import { ShieldCheck, ArrowLeft, Chrome, Lock } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { motion } from "framer-motion";

export default function GoogleAuth() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />

      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 h-10 w-10 grid place-items-center rounded-full border border-border hover:bg-secondary transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </motion.button>

      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Logo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-10"
        >
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-sm px-4">
            Sign in to access your verified stays and safe travel community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-4"
        >
          <button 
            onClick={googleSignIn}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-white border-2 border-border flex items-center justify-center gap-3 font-bold hover:bg-secondary active:scale-[0.98] transition-all relative overflow-hidden group shadow-sm"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-6 w-6" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-10 w-10 rounded-full bg-safety/5 text-safety grid place-items-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-10 w-10 rounded-full bg-primary/5 text-primary grid place-items-center">
                <Lock className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Private</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-[11px] text-muted-foreground leading-relaxed px-8"
        >
          By continuing, you agree to CozyStay's <span className="font-bold text-foreground underline decoration-primary/30">Terms of Service</span> and <span className="font-bold text-foreground underline decoration-primary/30">Privacy Policy</span>.
        </motion.div>
      </div>
      
      {/* Bottom Footer Decor */}
      <div className="absolute bottom-8 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
        Verified Safe · CozyStay India
      </div>
    </div>
  );
}
