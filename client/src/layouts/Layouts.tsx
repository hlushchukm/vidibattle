import { ReactNode } from "react";
import HomeFooterNav from "../components/HomeFooterNav";

export function MainLayout({
  children,
  active,
}: {
  children: ReactNode;
  active?: string;
}) {
  return (
    <div className="bg-gradient-2">
      {children}
      <HomeFooterNav active={active} />
    </div>
  );
}
