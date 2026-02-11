import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Plane,
  GraduationCap,
  Globe,
  Calendar,
  GitBranch,
  CheckSquare,
  Award,
  Wrench,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap as Logo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePermissions } from "@/contexts/PermissionContext";
import type { PermissionModule } from "@/types/permission.types";

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  module?: PermissionModule; // If undefined, always show (e.g., Overview, Settings)
}

const menuItems: MenuItem[] = [
  { title: "Overview", icon: LayoutDashboard, path: "/" },
  { title: "Leads", icon: Users, path: "/leads", module: "leads" },
  { title: "Visas", icon: Plane, path: "/visas", module: "visa-types" },
  { title: "Applicants", icon: GraduationCap, path: "/applicants", module: "students" },
  { title: "Countries", icon: Globe, path: "/countries", module: "countries" },
  { title: "Appointments", icon: Calendar, path: "/appointments", module: "appointments" },
  { title: "Workflow", icon: GitBranch, path: "/workflow", module: "workflows" },
  { title: "Tasks", icon: CheckSquare, path: "/tasks", module: "tasks" },
  { title: "Scholarships", icon: Award, path: "/scholarships", module: "scholarships" },
  { title: "Services", icon: Wrench, path: "/services", module: "services" },
  { title: "Content Management", icon: FileText, path: "/content-management", module: "blogs" },
  { title: "Messaging", icon: MessageSquare, path: "/messaging" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { canRead, isLoading } = usePermissions();

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter((item) => {
    // Always show items without a module requirement (Overview, Settings)
    if (!item.module) return true;
    // Show item if user has read permission for the module
    return canRead(item.module);
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Logo className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-base font-semibold text-sidebar-foreground">EduVisa</h1>
              <p className="text-xs text-sidebar-muted">CRM Dashboard</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)] py-4">
        <nav className="space-y-1 px-3">
          {isLoading ? (
            // Show skeleton while loading permissions
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 animate-pulse",
                  collapsed && "justify-center px-2"
                )}
              >
                <div className="h-5 w-5 rounded bg-sidebar-muted/30" />
                {!collapsed && <div className="h-4 w-24 rounded bg-sidebar-muted/30" />}
              </div>
            ))
          ) : (
            visibleMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              const linkContent = (
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary-foreground")} />
                  {!collapsed && <span className="animate-fade-in">{item.title}</span>}
                </NavLink>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.path} delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.path}>{linkContent}</div>;
            })
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
}
