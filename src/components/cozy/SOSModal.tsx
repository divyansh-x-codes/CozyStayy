import { useApp } from "@/context/AppContext";
import { Phone, MapPin, X, Users, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SOSModal() {
  const { sosOpen, closeSOS } = useApp();
  
  if (!sosOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end justify-center"
        onClick={closeSOS}
      >
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-[480px] bg-[#f8fafc] rounded-t-[40px] p-6 pb-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-start mb-4">
            <button onClick={closeSOS} className="h-10 w-10 grid place-items-center rounded-full bg-white shadow-sm border border-border/50">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="text-center space-y-1 mb-8">
            <h2 className="text-3xl font-display font-bold">Need Help?</h2>
            <p className="text-muted-foreground font-medium">We're here for you.</p>
          </div>

          {/* Central SOS Button */}
          <div className="relative flex justify-center mb-10 mt-2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-danger/20 rounded-full blur-3xl"
            />
            <div className="relative h-48 w-48 rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center bg-gradient-to-br from-danger to-[#dc2626] cursor-pointer active:scale-95 transition-transform group">
              <span className="text-5xl font-display font-black text-white tracking-tighter">SOS</span>
              <span className="text-[10px] font-bold text-white/80 uppercase mt-2">Tap to Alert</span>
              
              {/* Outer rings */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-110" />
              <div className="absolute inset-0 rounded-full border border-white/10 scale-125" />
            </div>
          </div>

          {/* Other Options */}
          <div className="space-y-4">
            <p className="text-sm font-bold ml-1">Other Options</p>
            <div className="bg-white rounded-[32px] border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
              <button className="w-full flex items-center gap-4 p-5 hover:bg-secondary transition-colors text-left group">
                <div className="h-11 w-11 rounded-full bg-secondary grid place-items-center shrink-0">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Call Hotel</p>
                  <p className="text-[11px] text-muted-foreground font-medium">+91 832 123 4567</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-active:translate-x-1 transition-transform" />
              </button>

              <button className="w-full flex items-center gap-4 p-5 hover:bg-secondary transition-colors text-left group">
                <div className="h-11 w-11 rounded-full bg-secondary grid place-items-center shrink-0">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Share Location</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Share your live location</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-active:translate-x-1 transition-transform" />
              </button>

              <button className="w-full flex items-center gap-4 p-5 hover:bg-secondary transition-colors text-left group">
                <div className="h-11 w-11 rounded-full bg-secondary grid place-items-center shrink-0">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Contact Emergency</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Alert your emergency contact</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-active:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="mt-8 p-4 rounded-2xl bg-danger/5 border border-danger/10 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed text-danger/80">
              Your alert will be sent to hotel staff and emergency contacts.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
