import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, BadgeCheck, ShieldCheck, CreditCard, Smartphone, Building2, Lock, X, Smartphone as PhoneIcon, Wallet, ChevronRight, Upload, Users, Calendar, Heart, Star, ShieldAlert } from "lucide-react";
import AppShell from "@/components/cozy/AppShell";
import { getHotel } from "@/data/hotels";
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Room3DViewer from "@/components/cozy/Room3DViewer";

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hotel = getHotel(id || "");
  const { user, addBooking, search, verifyWithDigiLocker, loading, resetVerification } = useApp();
  
  const [step, setStep] = useState(1);
  const [minor, setMinor] = useState(searchParams.get("minor") === "true");
  const [selectedIdType, setSelectedIdType] = useState("Aadhaar Card");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [digiLockerStatus, setDigiLockerStatus] = useState<"idle" | "verifying" | "dob-input" | "success">("idle");
  const [dob, setDob] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    emergency: "",
    guardianName: "",
    guardianRel: "",
    guardianPhone: "",
    minorName: "",
    minorDOB: "",
  });

  const [idUploaded, setIdUploaded] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const startDigiLocker = () => {
    setDigiLockerStatus("verifying");
    setTimeout(() => {
      setDigiLockerStatus("dob-input");
    }, 1500);
  };

  const handleVerify = async () => {
    if (!dob) return;
    setDigiLockerStatus("verifying");
    await verifyWithDigiLocker(dob);
    setDigiLockerStatus("success");
    setIdUploaded(true);
  };

  if (!hotel) return null;
  const taxes = Math.round(hotel.price * 0.12);
  const total = hotel.price + taxes;

  const next = () => {
    if (step === 2 && !user?.isAdult) {
      // Handled by restricted UI
      return;
    }
    if (step === 2 && user?.isAdult) {
      setStep(4); // Skip guardian for adults
    } else {
      setStep((s) => s + 1);
    }
  };
  
  const back = () => {
    if (step === 4 && user?.isAdult) {
      setStep(2);
    } else if (step === 1) {
      navigate(-1);
    } else {
      setStep((s) => s - 1);
    }
  };

  const confirm = () => {
    const bookingId = "COZYSTAY" + Math.floor(Math.random() * 900000 + 100000);
    addBooking({
      id: bookingId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: search.guests,
      rooms: search.rooms,
      total,
      status: "Upcoming",
      minor,
      location: hotel.location
    });
    navigate(`/confirmation/${hotel.id}?bookingId=${bookingId}&amount=${total}`);
  };

  const stepTitles = [
    "Booking Summary",
    "Verify your ID",
    "Booking for a minor",
    "Payment"
  ];

  return (
    <AppShell hideNav>
      <div className="min-h-screen bg-[#f8fafc]">
        {/* Header */}
        <header className="px-4 py-4 flex items-center gap-3">
          <button onClick={back} className="h-9 w-9 grid place-items-center rounded-full hover:bg-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Step {step} of 4 · <span className="text-foreground">{stepTitles[step - 1]}</span>
            </p>
          </div>
        </header>

        <main className="px-4 pb-24">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-white rounded-[32px] p-6 shadow-sm border border-border/50"
            >
              {/* Step 1: Summary */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-[32px]">
                    {hotel.has360 ? (
                      <Room3DViewer imageUrl={hotel.image} sketchfabId={hotel.sketchfabId} hideButton simple />
                    ) : (
                      <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} />
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur"><Share2 className="h-4 w-4" /></button>
                      <button className="h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur text-danger"><Heart className="h-4 w-4 fill-danger" /></button>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold font-display">{hotel.name}</h2>
                    <p className="text-sm text-muted-foreground">{hotel.location} · Beachfront</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-bold">{hotel.rating}</span>
                      <span className="text-xs text-muted-foreground">(1.2K reviews)</span>
                      <span className="ml-auto chip bg-safety/10 text-safety px-2.5 py-1">Verified Safe</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 pt-2 border-t border-border/50">
                    <span className="text-2xl font-bold">₹{hotel.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through">₹5,800</span>
                    <span className="ml-auto chip bg-[#16a34a] text-white px-3 py-1 font-bold text-[10px]">Lowest price</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground -mt-4">per night · all taxes included</p>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Check In</p>
                      <p className="font-bold text-sm">29 Apr, 2025</p>
                      <p className="text-[10px] text-muted-foreground">Tuesday</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Check Out</p>
                      <p className="font-bold text-sm">30 Apr, 2025</p>
                      <p className="text-[10px] text-muted-foreground">Wednesday</p>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-between py-1">
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Guests & Room</p>
                      <p className="font-bold text-sm">2 Guests · 1 Room</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50">
                    <div>
                      <p className="text-sm font-bold">Booking for a minor</p>
                      <p className="text-[11px] text-muted-foreground">Adds guardian verification step</p>
                    </div>
                    <button 
                      onClick={() => setMinor(!minor)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${minor ? "bg-accent" : "bg-muted"}`}
                    >
                      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${minor ? "right-1" : "left-1"}`} />
                    </button>
                  </div>

                  <button onClick={next} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                    Continue to verify <ChevronRight className="h-4 w-4" />
                  </button>
                  <p className="text-center text-[11px] text-muted-foreground">You won't be charged until your ID is verified.</p>
                </div>
              )}

              {/* Step 2: DigiLocker ID Verification */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display">Verify your ID</h2>
                  
                  {digiLockerStatus === "idle" && !user?.isVerified && (
                    <>
                      <p className="text-sm text-muted-foreground -mt-4">
                        We use DigiLocker to instantly verify your identity. It's secure, fast and paperless.
                      </p>
                      
                      <div className="bg-[#6366f1]/5 border border-[#6366f1]/10 rounded-[32px] p-6 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2.5">
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/DigiLocker_logo.svg/1200px-DigiLocker_logo.svg.png" alt="DigiLocker" className="w-full h-auto" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#6366f1] text-lg">DigiLocker</h3>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Government of India</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full w-fit">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold uppercase">100% Secure · Official · Paperless</span>
                        </div>

                        <div className="space-y-4 pt-2">
                          {[
                            { icon: Smartphone, title: "Instant verification", desc: "No manual uploads required", color: "bg-blue-500" },
                            { icon: Lock, title: "Secure & private", desc: "Your data is safe with DigiLocker", color: "bg-indigo-600" },
                            { icon: BadgeCheck, title: "Accepted by CozyStay", desc: "For a safe and verified stay", color: "bg-accent" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className={`h-8 w-8 rounded-full ${item.color} text-white grid place-items-center shrink-0`}>
                                <item.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold">{item.title}</p>
                                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10 flex items-start gap-3">
                        <ShieldCheck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-green-700 leading-relaxed font-medium">Your data is only used for verification and will not be stored.</p>
                      </div>

                      <div className="space-y-4">
                        <button 
                          onClick={startDigiLocker}
                          className="w-full h-14 rounded-full bg-[#0f172a] text-white font-bold flex items-center justify-center gap-3 shadow-xl hover:opacity-95 transition-opacity"
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/DigiLocker_logo.svg/1200px-DigiLocker_logo.svg.png" alt="" className="h-5 invert" />
                          Continue with DigiLocker
                        </button>
                        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          You will be redirected to DigiLocker to securely verify your identity.
                        </div>
                      </div>
                    </>
                  )}

                  {digiLockerStatus === "verifying" && (
                    <div className="h-[400px] flex flex-col items-center justify-center gap-6 text-center">
                      <div className="relative h-20 w-20">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-4 border-[#6366f1]/20 border-t-[#6366f1]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/DigiLocker_logo.svg/1200px-DigiLocker_logo.svg.png" className="h-8" alt="" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Verifying Identity</h3>
                        <p className="text-sm text-muted-foreground mt-1">Connecting to DigiLocker secure servers...</p>
                      </div>
                    </div>
                  )}

                  {digiLockerStatus === "dob-input" && (
                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-secondary/50 space-y-4">
                        <div className="h-12 w-12 rounded-full bg-[#6366f1] grid place-items-center text-white mb-2">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold">Please confirm your DOB</h3>
                        <p className="text-xs text-muted-foreground">DigiLocker requires your Date of Birth to verify age eligibility.</p>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Date of Birth</label>
                          <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full h-14 px-5 rounded-2xl bg-white border border-border outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                          />
                        </div>
                      </div>
                      <button 
                        disabled={!dob}
                        onClick={handleVerify}
                        className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-xl disabled:opacity-40"
                      >
                        Confirm & Verify
                      </button>
                    </div>
                  )}

                  {(digiLockerStatus === "success" || user?.isVerified) && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 justify-center px-4 py-2 bg-green-500/10 text-green-600 rounded-full w-fit mx-auto">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-bold">Verified by DigiLocker</span>
                      </div>

                      {user?.isAdult ? (
                        <div className="bg-green-500/5 border border-green-500/20 rounded-[32px] p-8 text-center space-y-6">
                          <div className="h-20 w-20 bg-green-500 rounded-full mx-auto grid place-items-center text-white shadow-xl shadow-green-500/20">
                            <ShieldCheck className="h-10 w-10" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">Verification Successful!</h3>
                            <p className="text-sm text-muted-foreground mt-1">Your identity has been verified successfully as an adult.</p>
                          </div>

                          <div className="bg-white rounded-2xl p-5 text-left space-y-4 shadow-sm border border-border/50">
                            {[
                              { label: "Name", value: user.name, icon: Users },
                              { label: "Age", value: `${user.age} Years`, icon: ShieldCheck },
                              { label: "Status", value: "Verified Adult", icon: BadgeCheck, success: true },
                            ].map((field, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-secondary grid place-items-center text-muted-foreground">
                                    <field.icon className="h-4 w-4" />
                                  </div>
                                  <span className="text-sm text-muted-foreground font-medium">{field.label}</span>
                                </div>
                                <span className={`text-sm font-bold ${field.success ? "text-green-600" : ""}`}>{field.value}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={next} className="w-full h-14 rounded-full bg-[#0f172a] text-white font-bold flex items-center justify-center gap-2 shadow-xl">
                            Continue to Booking <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="bg-danger/5 border border-danger/20 rounded-[32px] p-8 text-center space-y-6">
                          <div className="h-20 w-20 bg-danger rounded-full mx-auto grid place-items-center text-white shadow-xl shadow-danger/20">
                            <ShieldAlert className="h-10 w-10" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">Access Restricted</h3>
                            <p className="text-sm text-muted-foreground mt-2 px-4 leading-relaxed">
                              Users under 18 cannot book rooms without guardian verification.
                            </p>
                          </div>
                          <div className="bg-white rounded-2xl p-5 text-left space-y-4 shadow-sm border border-border/50">
                            {[
                              { label: "Name", value: user.name, icon: Users },
                              { label: "Age", value: `${user.age} Years`, icon: ShieldCheck },
                              { label: "Eligibility", value: "Minor", icon: X, danger: true },
                            ].map((field, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-secondary grid place-items-center text-muted-foreground">
                                    <field.icon className="h-4 w-4" />
                                  </div>
                                  <span className="text-sm text-muted-foreground font-medium">{field.label}</span>
                                </div>
                                <span className={`text-sm font-bold ${field.danger ? "text-danger" : ""}`}>{field.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 gap-3 pt-2">
                            <button onClick={() => setStep(3)} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold shadow-lg">
                              Continue with Guardian
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                              <button onClick={back} className="h-12 rounded-full border border-border font-bold text-sm">
                                Go Back
                              </button>
                              <button 
                                onClick={() => {
                                  resetVerification();
                                  setDigiLockerStatus("idle");
                                }} 
                                className="h-12 rounded-full border border-border font-bold text-sm text-muted-foreground"
                              >
                                Try another ID
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 3: Minor + Guardian */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-display">Booking for a minor</h2>
                    <button onClick={() => setMinor(false)} className="h-6 w-11 rounded-full bg-accent relative">
                      <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-safety/10 text-safety flex items-start gap-3">
                    <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium">Guardian verification is required to complete this booking.</p>
                  </div>

                  <div className="space-y-4">
                    {!otpSent ? (
                      <>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Guardian Details</p>
                        <Input label="GUARDIAN NAME" placeholder="Enter guardian full name" value={formData.guardianName} onChange={(v) => setFormData({...formData, guardianName: v})} />
                        <SelectDropdown label="RELATIONSHIP WITH MINOR" options={["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Legal Guardian"]} value={formData.guardianRel} onChange={(v) => setFormData({...formData, guardianRel: v})} />
                        <PhoneInput label="GUARDIAN MOBILE NUMBER" value={formData.guardianPhone} onChange={(v) => setFormData({...formData, guardianPhone: v})} />

                        <button 
                          disabled={formData.guardianName.trim().length < 3 || !formData.guardianRel || formData.guardianPhone.length !== 10}
                          onClick={() => setOtpSent(true)} 
                          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-40 disabled:grayscale mt-4 transition-all"
                        >
                          Send OTP to Guardian <ChevronRight className="h-4 w-4" />
                        </button>
                        <p className="text-[10px] text-muted-foreground/60 text-center mt-2 font-medium italic">
                          * All fields are mandatory for guardian verification
                        </p>
                      </>
                    ) : (
                      <div className="py-8 text-center space-y-6">
                        <div className="h-16 w-16 bg-primary/10 text-primary rounded-full mx-auto grid place-items-center">
                          <Smartphone className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Enter Guardian OTP</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            We've sent a verification code to {formData.guardianPhone || "the guardian's mobile number"}.
                          </p>
                        </div>
                        <OtpInput label="OTP" placeholder="Enter 6-digit OTP" value={otp} onChange={setOtp} />
                        
                        <button onClick={next} disabled={otp.length !== 6} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 transition-opacity">
                          Verify & Continue <ChevronRight className="h-4 w-4" />
                        </button>
                        <button onClick={() => setOtpSent(false)} className="text-sm font-bold text-muted-foreground">
                          Back to Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display">Payment</h2>
                  <div className="flex items-center gap-1.5 text-[#16a34a] text-xs font-bold">
                    <ShieldCheck className="h-4 w-4" /> Your payment is secure
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Price Details</p>
                    <div className="space-y-4">
                      <Row label="Room Rate (1 Night)" value={`₹${hotel.price.toLocaleString()}`} />
                      <Row label="Taxes & Fees" value="Included" />
                      <Row label="SafeStay Safety Fee" value="Free" />
                      <div className="pt-4 border-t border-border flex justify-between items-baseline">
                        <p className="text-lg font-bold">Total Amount</p>
                        <p className="text-2xl font-bold">₹{total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Payment Method</p>
                    <div className="space-y-3">
                      {[
                        { id: "UPI", icon: Smartphone, desc: "Pay using any UPI app", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" },
                        { id: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Rupay" },
                        { id: "Net Banking", icon: Building2, desc: "All major banks" },
                        { id: "Wallets", icon: Wallet, desc: "Paytm, PhonePe, Amazon Pay" },
                      ].map((method) => (
                        <button 
                          key={method.id} 
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${paymentMethod === method.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30"}`}
                        >
                          <div className={`h-10 w-10 rounded-xl grid place-items-center ${paymentMethod === method.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                            {method.logo ? <img src={method.logo} className="h-4 w-auto" alt="" /> : <method.icon className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-bold">{method.id}</p>
                            <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                          </div>
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? "border-primary bg-primary" : "border-muted"}`}>
                            {paymentMethod === method.id && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <button onClick={confirm} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 text-lg">
                      Pay ₹{total.toLocaleString()}
                    </button>
                    <p className="text-center text-[10px] text-muted-foreground px-4 leading-relaxed">
                      By continuing, you agree to our <span className="underline font-bold text-foreground">Terms & Conditions</span> and <span className="underline font-bold text-foreground">Privacy Policy</span>.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AppShell>
  );
}

function Input({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase ml-1">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[52px] px-4 rounded-2xl bg-[#f8fafc] border border-border/50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-[15px] font-medium placeholder:text-muted-foreground/40"
      />
    </div>
  );
}

function SelectDropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase ml-1">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[52px] px-4 rounded-2xl bg-[#f8fafc] border border-border/50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-[15px] font-medium appearance-none text-foreground cursor-pointer"
        >
          <option value="" disabled className="text-muted-foreground/40">Select relationship</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <p className="text-muted-foreground font-medium">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function Share2(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>; }
function Car(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.6 2 11.8 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>; }

function PhoneInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase ml-1">{label}</label>
      <div className="relative flex items-center w-full h-[52px] px-4 rounded-2xl bg-[#f8fafc] border border-border/50 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
        <span className="text-[15px] font-bold text-foreground mr-2">+91</span>
        <input 
          type="tel" 
          placeholder="Enter mobile number"
          value={value}
          onChange={handleInput}
          className="flex-1 bg-transparent outline-none text-[15px] font-medium placeholder:text-muted-foreground/40"
        />
      </div>
    </div>
  );
}

function OtpInput({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase ml-1">{label}</label>
      <input 
        type="tel" 
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        className="w-full h-[52px] px-4 rounded-2xl bg-[#f8fafc] border border-border/50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-[15px] font-medium placeholder:text-muted-foreground/40 tracking-widest text-center"
      />
    </div>
  );
}
