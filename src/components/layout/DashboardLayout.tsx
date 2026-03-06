import { ReactNode, useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function DashboardLayout({ children, title, subtitle, action }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar collapsed={collapsed} onToggle={setCollapsed} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          collapsed ? "pl-[70px]" : "pl-[70px] md:pl-[260px]"
        )}
      >
        <DashboardHeader title={title} subtitle={subtitle} action={action} />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
