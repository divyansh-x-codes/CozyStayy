import AppShell from "@/components/cozy/AppShell";
import { useApp } from "@/context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BadgeCheck, ChevronRight, Heart, CalendarDays, ShieldCheck, LogOut, Settings, LayoutDashboard } from "lucide-react";

export default function Profile() {
  const { user, logout, bookings, favourites } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;
  return (
    <AppShell>
      <header className="px-5 pt-6 pb-4">
        <h1 className="font-display font-bold text-2xl">Profile</h1>
      </header>
      <div className="px-5">
        <div className="card-soft p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-accent grid place-items-center text-primary font-bold text-2xl">
            {user.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold truncate">{user.name}</p>
              {user.verified && <BadgeCheck className="h-4 w-4 text-safety" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat icon={CalendarDays} value={bookings.length} label="Bookings" />
          <Stat icon={Heart} value={favourites.length} label="Saved" />
          <Stat icon={ShieldCheck} value="100%" label="Verified" />
        </div>

        <div className="mt-5 card-soft divide-y divide-border">
          <Row to="/bookings" icon={CalendarDays} label="My Bookings" />
          <Row to="/favourites" icon={Heart} label="Saved Hotels" />
          <Row to="/safety" icon={ShieldCheck} label="Verification Status" badge="Verified" />
          <Row to="/admin" icon={LayoutDashboard} label="BDO Admin Console" badge="Admin" />
          <Row to="#" icon={Settings} label="Settings" />
          <button onClick={() => { logout(); navigate("/auth"); }} className="w-full flex items-center gap-3 p-4 text-danger">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, value, label }: any) {
  return (
    <div className="card-soft p-3 text-center">
      <Icon className="h-5 w-5 mx-auto text-accent" />
      <p className="font-bold mt-1">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
function Row({ to, icon: Icon, label, badge }: any) {
  return (
    <Link to={to} className="flex items-center gap-3 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge && <span className="chip bg-safety/10 text-safety">{badge}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
