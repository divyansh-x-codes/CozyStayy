import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, CalendarCheck, ShieldCheck, ChevronLeft } from "lucide-react";

export default function Admin() {
  const { pathname } = useLocation();
  const tabs = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/properties", label: "Properties", icon: Building2 },
    { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { to: "/admin/verify", label: "Verify", icon: ShieldCheck },
  ];
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-[480px] min-h-screen bg-background shadow-[0_0_60px_hsl(222_47%_11%/0.08)] flex flex-col">
        <header className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-border">
          <Link to="/" className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"><ChevronLeft className="h-5 w-5" /></Link>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-accent font-semibold">BDO Console</p>
            <h1 className="font-display font-bold text-lg leading-tight">CozyStay Admin</h1>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">BD</div>
        </header>
        <main className="flex-1 pb-20">
          <Outlet />
        </main>
        <nav className="sticky bottom-0 bg-card/95 border-t border-border backdrop-blur">
          <ul className="grid grid-cols-4">
            {tabs.map((t) => (
              <li key={t.to}>
                <NavLink to={t.to} end={t.end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  <t.icon className="h-5 w-5" />
                  <span>{t.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}