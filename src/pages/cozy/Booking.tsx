import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, BadgeCheck, ShieldCheck, CreditCard, Smartphone, Building2, Lock } from "lucide-react";
import AppShell from "@/components/cozy/AppShell";
import { getHotel } from "@/data/hotels";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = getHotel(id || "");
  const { user, addBooking, search } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [minor, setMinor] = useState(false);
  const [verified, setVerified] = useState(true);
  const [pay, setPay] = useState<"upi" | "card" | "net">("upi");

  if (!hotel) return null;
  const taxes = Math.round(hotel.price * 0.18);
  const total = hotel.price + taxes;

  const next = () => setStep((s) => s + 1);
  const back = () => (step === 1 ? navigate(-1) : setStep((s) => s - 1));

  const confirm = () => {
    addBooking({
      id: "CS" + Math.floor(Math.random() * 90000000 + 10000000),
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: search.guests,
      rooms: search.rooms,
      total,
      status: "Upcoming",
    });
    navigate(`/confirmation/${hotel.id}`);
  };

  return (
    <AppShell hideNav>
      <header className="px-4 py-3 flex items-center gap-3 border-b border-border">
        <button onClick={back} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><ChevronLeft className="h-5 w-5" /></button>
        <h1 className="font-display font-semibold flex-1">
          {step === 1 ? "Booking Details" : step === 2 ? "Verification" : "Payment"}
        </h1>
        <span className="text-xs text-muted-foreground">Step {step} of 3</span>
      </header>

      <div className="px-5 py-5 pb-32">
        {step === 1 && (
          <div className="space-y-5">
            <Section title="Guest Details">
              <Field label="Full Name" value={name} onChange={setName} />
              <Field label="Phone Number" value={phone} onChange={setPhone} />
              <Field label="Email Address" value={email} onChange={setEmail} />
            </Section>
            <Section title="Stay Details">
              <div className="grid grid-cols-2 gap-3">
                <ReadOnly label="Check-in" value={search.checkIn} />
                <ReadOnly label="Check-out" value={search.checkOut} />
                <ReadOnly label="Guests" value={`${search.guests} Guest${search.guests > 1 ? "s" : ""}`} />
                <ReadOnly label="Rooms" value={`${search.rooms} Room`} />
              </div>
            </Section>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="card-soft p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-safety/10 grid place-items-center"><BadgeCheck className="h-5 w-5 text-safety" /></div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-safety">DigiLocker Verified</p>
                <p className="text-xs text-muted-foreground mt-0.5">Stay safe with government-verified identity check.</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-safety" />
            </div>

            <Section title="Guest Verification">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary">
                <div className="h-9 w-9 rounded-full bg-card grid place-items-center"><BadgeCheck className="h-4 w-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{verified ? "Verified via DigiLocker" : "Not verified"}</p>
                  <p className="text-[11px] text-muted-foreground">Aadhaar verified</p>
                </div>
                <button onClick={() => setVerified(!verified)} className={`h-5 w-5 rounded-full grid place-items-center ${verified ? "bg-safety text-safety-foreground" : "bg-border"}`}>
                  {verified && "✓"}
                </button>
              </div>
            </Section>

            <Section title="Booking for a minor?">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary">
                <p className="text-sm">Add guardian details</p>
                <button onClick={() => setMinor(!minor)} className={`relative h-6 w-11 rounded-full transition-colors ${minor ? "bg-accent" : "bg-border"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card transition-all ${minor ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </Section>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Section title="Price Details">
              <Row label={`Room Price (1 Night)`} value={`₹${hotel.price.toLocaleString()}`} />
              <Row label="Taxes & Fees" value={`₹${taxes.toLocaleString()}`} />
              <Row label="CozyStay Safety Fee" value="FREE" valueClass="text-safety font-semibold" />
              <div className="border-t border-border my-2" />
              <Row label="Total Amount" value={`₹${total.toLocaleString()}`} bold />
            </Section>
            <Section title="Payment Methods">
              {[
                { id: "upi", label: "UPI", icon: Smartphone },
                { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                { id: "net", label: "Net Banking", icon: Building2 },
              ].map((p) => (
                <button key={p.id} onClick={() => setPay(p.id as any)} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary mb-2">
                  <p.icon className="h-5 w-5" />
                  <span className="flex-1 text-left text-sm font-medium">{p.label}</span>
                  <span className={`h-4 w-4 rounded-full border-2 ${pay === p.id ? "border-primary bg-primary" : "border-border"}`} />
                </button>
              ))}
            </Section>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30">
        <div className="mx-auto max-w-[480px] bg-card border-t border-border p-4">
          <button
            onClick={step === 3 ? confirm : next}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            {step === 3 && <Lock className="h-4 w-4" />}
            {step === 1 ? "Continue to Verification" : step === 2 ? "Continue to Payment" : `Pay ₹${total.toLocaleString()} Securely`}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block p-3 rounded-2xl bg-secondary">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium mt-0.5" />
    </label>
  );
}
function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-2xl bg-secondary">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}
function Row({ label, value, bold, valueClass }: { label: string; value: string; bold?: boolean; valueClass?: string }) {
  return (
    <div className={`flex items-center justify-between text-sm ${bold ? "font-bold" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
