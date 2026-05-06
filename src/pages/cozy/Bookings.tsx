import AppShell from "@/components/cozy/AppShell";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight, MapPin, X, Smartphone, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Bookings() {
  const { bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past" | "Cancelled">("Upcoming");
  
  const [refundBooking, setRefundBooking] = useState<any>(null);
  const [refundStep, setRefundStep] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  const handleRefundClick = (e: React.MouseEvent, booking: any) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    setRefundBooking(booking);
    setRefundStep("phone");
    setPhone("");
    setOtp("");
  };

  const closeRefund = () => {
    setRefundBooking(null);
  };

  const sendOtp = () => {
    if (phone.length > 5) setRefundStep("otp");
  };

  const verifyRefund = () => {
    if (otp.length === 6) {
      cancelBooking(refundBooking.id);
      setRefundStep("success");
    }
  };

  return (
    <AppShell>
      <header className="px-5 pt-8 pb-4">
        <h1 className="font-display font-bold text-2xl">My Bookings</h1>
        
        {/* Tabs */}
        <div className="flex gap-6 mt-6 border-b border-border">
          {(["Upcoming", "Past", "Cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? "text-primary" : "text-muted-foreground"}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 mt-2 space-y-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-secondary grid place-items-center mb-4">
                  <CalendarDays className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-bold text-lg">No {activeTab.toLowerCase()} bookings</p>
                <p className="text-sm text-muted-foreground mt-1 px-8">When you book a stay, it will appear here.</p>
                {activeTab === "Upcoming" && (
                  <Link to="/listings" className="inline-block mt-6 px-8 h-12 leading-[3rem] rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20">Find a stay</Link>
                )}
              </div>
            ) : (
              filteredBookings.map((b) => (
                <Link to={`/bookings/${b.id}`} key={b.id} className="block bg-white rounded-[24px] p-4 border border-border/50 shadow-sm active:scale-[0.98] transition-all relative">
                  <div className="flex gap-4">
                    <img src={b.hotelImage} alt={b.hotelName} className="h-20 w-24 rounded-2xl object-cover shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[15px] truncate">{b.hotelName}</h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> {b.checkIn} – {b.checkOut}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{b.guests} Guests · {b.rooms} Room</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${b.status === "Upcoming" ? "bg-[#16a34a]/10 text-[#16a34a]" : b.status === "Cancelled" ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground"}`}>
                            {b.status === "Upcoming" ? "Confirmed" : b.status}
                          </span>
                        </div>
                        <p className="text-sm font-bold">₹{b.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-border flex justify-between items-center">
                    <span className="text-[10px] font-medium tracking-wider text-muted-foreground">Booking ID: {b.id}</span>
                    {b.status === "Upcoming" && (
                      <button 
                        onClick={(e) => handleRefundClick(e, b)}
                        className="h-8 px-4 rounded-full bg-danger/10 text-danger font-bold text-xs active:bg-danger/20"
                      >
                        1-Tap Refund
                      </button>
                    )}
                  </div>
                </Link>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Refund Popup */}
      <AnimatePresence>
        {refundBooking && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeRefund}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[480px] bg-card rounded-t-[40px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-muted/40 rounded-full mx-auto mb-8" />
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display">Instant Refund</h2>
                <button onClick={closeRefund} className="h-8 w-8 rounded-full bg-secondary grid place-items-center">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {refundStep === "phone" && (
                <div className="space-y-6">
                  <div className="p-4 bg-secondary/50 rounded-2xl flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Refund Amount</span>
                      <span className="font-bold text-green-600 text-lg">₹{(refundBooking.total * 0.95).toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-danger font-medium text-right">* 5% deduction applied on original ₹{refundBooking.total.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase ml-1">REGISTERED MOBILE</label>
                    <div className="relative flex items-center w-full h-[52px] px-4 rounded-2xl bg-[#f8fafc] border border-border/50 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                      <span className="text-[15px] font-bold text-foreground mr-2">+91</span>
                      <input 
                        type="tel" 
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 bg-transparent outline-none text-[15px] font-bold"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={sendOtp}
                    className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-xl"
                  >
                    Send OTP to Proceed
                  </button>
                </div>
              )}

              {refundStep === "otp" && (
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <div className="h-16 w-16 bg-primary/10 text-primary rounded-full mx-auto grid place-items-center mb-4">
                      <Smartphone className="h-8 w-8" />
                    </div>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to <span className="font-bold text-foreground">+91 {phone}</span></p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase ml-1">OTP</label>
                    <input 
                      type="tel" 
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full h-[52px] px-4 rounded-2xl bg-[#f8fafc] border border-border/50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-[15px] font-bold tracking-widest text-center"
                    />
                  </div>

                  <button 
                    onClick={verifyRefund}
                    disabled={otp.length !== 6}
                    className="w-full h-14 rounded-full bg-[#ef4444] text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-danger/20 disabled:opacity-50"
                  >
                    Verify & Process Refund
                  </button>
                </div>
              )}

              {refundStep === "success" && (
                <div className="py-8 text-center space-y-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-24 w-24 rounded-full bg-green-500 mx-auto grid place-items-center text-white shadow-xl shadow-green-500/20"
                  >
                    <Check className="h-12 w-12" strokeWidth={4} />
                  </motion.div>
                  
                  <div>
                    <h2 className="text-2xl font-bold font-display">Refund Successful!</h2>
                    <p className="text-sm text-muted-foreground mt-2 px-4">
                      <span className="font-bold text-foreground">₹{(refundBooking.total * 0.95).toLocaleString()}</span> has been processed. It will reflect in your original payment method instantly.
                    </p>
                  </div>

                  <button 
                    onClick={closeRefund}
                    className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg"
                  >
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
