import { NavLink } from "react-router-dom";
import { Home, CalendarDays, Heart, MessageSquare, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/favourites", label: "Favourites", icon: Heart },
  { to: "/inbox", label: "Inbox", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 bg-card/95 backdrop-blur border-t border-border">
      <ul className="grid grid-cols-5 px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
