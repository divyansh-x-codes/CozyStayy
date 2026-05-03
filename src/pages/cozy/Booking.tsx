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
  const [idUploaded, setIdUploaded] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianRel, setGuardianRel] = useState("Parent");
  const [guardianIdUploaded, setGuardianIdUploaded] = useState(false);

  if (!hotel) return null;
  const taxes = Math.round(hotel.price * 0.18);
  const original = Math.round(hotel.price * 1.25);
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
            {/* Booking Summary */}
            <div className="card-soft overflow-hidden">
              <div className="flex gap-3 p-3">
                <img src={hotel.image} className="h-24 w-24 rounded-2xl object-cover" alt={hotel.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{hotel.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{hotel.location}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold text-lg">₹{hotel.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{original.toLocaleString()}</span>
                    <span className="chip bg-safety/10 text-safety">Lowest price</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                <ReadOnly label="Check-in" value={search.checkIn} />
                <ReadOnly label="Check-out" value={search.checkOut} />
              </div>
              <button
                onClick={() => setMinor(!minor)}
                className="w-full flex items-center justify-between px-4 py-3 border-t border-border"
              >
                <div className="text-left">
                  <p className="text-sm font-semibold">Booking for a minor?</p>
                  <p className="text-[11px] text-muted-foreground">Guardian verification required</p>
                </div>
                <span className={`relative h-6 w-11 rounded-full transition-colors ${minor ? "bg-accent" : "bg-border"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card transition-all ${minor ? "left-5" : "left-0.5"}`} />
                </span>
              </button>
            </div>

            <Section title="Guest Details">
              <Field label="Full Name" value={name} onChange={setName} />
              <Field label="Phone Number" value={phone} onChange={setPhone} />
              <Field label="Email Address" value={email} onChange={setEmail} />
            </Section>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="card-soft p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-safety/10 grid place-items-center"><BadgeCheck className="h-5 w-5 text-safety" /></div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-safety">{minor ? "Guardian + Guest Verification" : "Identity Verification"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Government-grade identity check keeps every stay safe.</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-safety" />
            </div>

            <Section title="ID Upload">
              <button
                onClick={() => setIdUploaded(true)}
                className={`w-full p-4 rounded-2xl border-2 border-dashed text-sm font-medium transition-colors ${idUploaded ? "border-safety bg-safety/5 text-safety" : "border-border bg-secondary text-muted-foreground"}`}
              >
                {idUploaded ? "✓ Aadhaar / DigiLocker verified" : "Tap to upload ID (simulated)"}
              </button>
            </Section>
            <Section title="Face Verification">
              <button
                onClick={() => setFaceVerified(true)}
                disabled={!idUploaded}
                className={`w-full p-4 rounded-2xl border-2 border-dashed text-sm font-medium transition-colors disabled:opacity-50 ${faceVerified ? "border-safety bg-safety/5 text-safety" : "border-border bg-secondary text-muted-foreground"}`}
              >
                {faceVerified ? "✓ Face matched with ID" : "Tap to start face scan"}
              </button>
            </Section>

            {minor && (
              <>
                <div className="card-soft bg-accent/10 p-3 text-xs font-medium text-primary">
                  Minor booking — guardian must complete verification.
                </div>
                <Section title="Guardian Details">
                  <Field label="Guardian Full Name" value={guardianName} onChange={setGuardianName} />
                  <div className="p-3 rounded-2xl bg-secondary">
                    <p className="text-[11px] text-muted-foreground mb-2">Relationship</p>
                    <div className="flex gap-2 flex-wrap">
                      {["Parent", "Sibling", "Relative", "Legal Guardian"].map((r) => (
                        <button key={r} onClick={() => setGuardianRel(r)} className={`chip ${guardianRel === r ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setGuardianIdUploaded(true)}
                    className={`w-full p-4 rounded-2xl border-2 border-dashed text-sm font-medium transition-colors ${guardianIdUploaded ? "border-safety bg-safety/5 text-safety" : "border-border bg-secondary text-muted-foreground"}`}
                  >
                    {guardianIdUploaded ? "✓ Guardian ID verified" : "Upload guardian ID"}
                  </button>
                </Section>
              </>
            )}

            {(faceVerified && (!minor || (guardianName && guardianIdUploaded))) && (
              <div className="card-soft bg-safety/10 p-4 flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-safety" />
                <p className="text-sm font-semibold text-safety">{minor ? "Guardian Verified ✓" : "Identity Verified ✓"}</p>
              </div>
            )}
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
            disabled={step === 2 && (!faceVerified || (minor && (!guardianName || !guardianIdUploaded)))}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {step === 3 && <Lock className="h-4 w-4" />}
            {step === 1 ? "Continue to Verify" : step === 2 ? "Continue to Payment" : `Pay ₹${total.toLocaleString()} Securely`}
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
