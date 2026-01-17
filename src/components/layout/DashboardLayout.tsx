import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function DashboardLayout({ children, title, subtitle, action }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-[70px] md:pl-[260px] transition-all duration-300">
        <DashboardHeader title={title} subtitle={subtitle} action={action} />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
