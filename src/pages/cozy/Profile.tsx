import AppShell from "@/components/cozy/AppShell";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, ChevronRight, Heart, CalendarDays, ShieldCheck, LogOut, Settings, LayoutDashboard } from "lucide-react";

export default function Profile() {
  const { bookings, favourites } = useApp();
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null; // ProtectedRoute will handle redirecting if needed

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-4">
        <h1 className="font-display font-bold text-2xl">Profile</h1>
      </header>
      <div className="px-5">
        <div className="card-soft p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-accent grid place-items-center text-primary font-bold text-2xl overflow-hidden shadow-inner">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt={userProfile?.displayName || "Profile"} className="h-full w-full object-cover" />
            ) : (
              (userProfile?.displayName || currentUser.email || "U")[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-lg truncate">{userProfile?.displayName || "User"}</p>
              <BadgeCheck className="h-5 w-5 text-safety shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">{currentUser.email}</p>
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
          {userProfile?.role === "admin" && (
            <Row to="/admin" icon={LayoutDashboard} label="BDO Admin Console" badge="Admin" />
          )}
          <Row to="#" icon={Settings} label="Settings" />
          <button 
            onClick={async () => { 
              await logout(); 
              navigate("/auth"); 
            }} 
            className="w-full flex items-center gap-3 p-4 text-danger hover:bg-danger/10 transition-colors"
          >
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
    <Link to={to} className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors">
      <Icon className="h-5 w-5 text-primary" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge && <span className="chip bg-safety/10 text-safety">{badge}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
