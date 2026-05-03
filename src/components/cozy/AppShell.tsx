import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import SOSButton from "./SOSButton";
import SOSModal from "./SOSModal";

export default function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="app-shell flex flex-col">
        <main className="flex-1 pb-2">{children}</main>
        {!hideNav && <BottomNav />}
        <SOSButton />
        <SOSModal />
      </div>
    </div>
  );
}
