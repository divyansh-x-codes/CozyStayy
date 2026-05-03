import { hotels } from "@/data/hotels";
import { Plus, Upload, ShieldCheck, Box } from "lucide-react";
import { useState } from "react";

export default function AdminProperties() {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [glb, setGlb] = useState<string | null>(null);
  const [imgs, setImgs] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const allAmenities = ["Wi-Fi", "Pool", "Breakfast", "Parking", "CCTV", "Verified Staff", "Heating"];
  const toggle = (a: string) => setAmenities((s) => s.includes(a) ? s.filter(x => x !== a) : [...s, a]);

  return (
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">Properties</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="chip bg-primary text-primary-foreground"><Plus className="h-3 w-3" /> Add Hotel</button>
      </div>

      {showAdd && (
        <div className="card-soft p-4 space-y-3 mb-5">
          <Input label="Hotel Name" value={name} onChange={setName} />
          <Input label="Location" value={location} onChange={setLocation} />
          <Input label="Price per night (₹)" value={price} onChange={setPrice} />

          <div>
            <p className="text-[11px] text-muted-foreground mb-1.5">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {allAmenities.map((a) => (
                <button key={a} onClick={() => toggle(a)} className={`chip ${amenities.includes(a) ? "bg-safety text-safety-foreground" : "bg-secondary"}`}>{a}</button>
              ))}
            </div>
          </div>

          <label className="block p-4 rounded-2xl border-2 border-dashed border-border text-center cursor-pointer">
            <input type="file" multiple accept="image/*" hidden onChange={(e) => {
              const files = Array.from(e.target.files || []).map((f) => URL.createObjectURL(f));
              setImgs((s) => [...s, ...files]);
            }} />
            <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
            <p className="text-xs mt-1 font-medium">{imgs.length ? `${imgs.length} image(s) uploaded` : "Upload hotel images"}</p>
          </label>

          <label className="block p-4 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 text-center cursor-pointer">
            <input type="file" accept=".glb,.gltf" hidden onChange={(e) => {
              const f = e.target.files?.[0]; if (f) setGlb(f.name);
            }} />
            <Box className="h-5 w-5 mx-auto text-accent" />
            <p className="text-xs mt-1 font-medium">{glb ? `✓ ${glb}` : "Upload 3D Room Model (.glb)"}</p>
          </label>

          <button onClick={() => { setShowAdd(false); setName(""); setLocation(""); setPrice(""); setGlb(null); setImgs([]); setAmenities([]); }} className="w-full h-11 rounded-full bg-primary text-primary-foreground font-semibold">
            Submit for Review
          </button>
        </div>
      )}

      <div className="space-y-2">
        {hotels.map((h) => (
          <div key={h.id} className="card-soft p-3 flex items-center gap-3">
            <img src={h.image} className="h-14 w-14 rounded-xl object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{h.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{h.location}</p>
              <div className="flex gap-1.5 mt-1">
                {h.isVerified && <span className="chip bg-safety/10 text-safety text-[10px] px-2"><ShieldCheck className="h-2.5 w-2.5" /> Verified</span>}
                {h.has360 && <span className="chip bg-primary/10 text-primary text-[10px] px-2">3D</span>}
              </div>
            </div>
            <p className="text-sm font-bold">₹{h.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block p-3 rounded-2xl bg-secondary">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium mt-0.5" />
    </label>
  );
}