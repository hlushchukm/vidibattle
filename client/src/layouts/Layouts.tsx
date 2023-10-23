import { ReactNode } from "react";
import HomeFooterNav from "../components/HomeFooterNav";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gradient-2">
      {children}
      <HomeFooterNav />
    </div>
  );
}
