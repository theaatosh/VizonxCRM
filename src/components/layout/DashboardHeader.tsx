import { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, LogOut, Loader2, Users, FileText, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authService from "@/services/auth.service";
import notificationService, { Notification } from "@/services/notification.service";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { useGlobalSearch } from "@/hooks/useDashboard";
import type { SearchLeadResult, SearchApplicationResult, SearchStaffResult } from "@/types/dashboard.types";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { unreadCount, notifications: liveNotifications, refreshUnreadCount } = useNotificationContext();
  const { user } = usePermissions();
  const { data: searchResults, isLoading: isSearching } = useGlobalSearch(searchQuery);

  useEffect(() => {
    if (liveNotifications.length > 0) {
      setLocalNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = liveNotifications.filter(n => !existingIds.has(n.id));
        return [...uniqueNew, ...prev];
      });
    }
  }, [liveNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setLocalNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n
      ));
      refreshUnreadCount();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setLocalNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
      refreshUnreadCount();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  const totalResults = searchResults
    ? searchResults.leads.length + searchResults.applications.length + searchResults.staff.length
    : 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left - Title */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="hidden sm:block">{action}</div>}
      </div>

      {/* Right - Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads, applicants..."
            className="w-[280px] pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
          />
          {showSearchResults && searchQuery.length >= 2 && (
            <div className="absolute top-full mt-1 w-full rounded-lg border bg-popover shadow-lg z-50">
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : totalResults === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.leads.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leads</span>
                      </div>
                      {searchResults.leads.map((lead: SearchLeadResult) => (
                        <button
                          key={`lead-${lead.id}`}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent cursor-pointer"
                          onClick={() => { navigate(`/leads/${lead.id}`); setShowSearchResults(false); setSearchQuery(""); }}
                        >
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {lead.firstName[0]}{lead.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{lead.firstName} {lead.lastName}</p>
                            <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                  {searchResults.applications.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applicants</span>
                      </div>
                      {searchResults.applications.map((app: SearchApplicationResult) => (
                        <button
                          key={`app-${app.id}`}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent cursor-pointer"
                          onClick={() => { navigate(`/applicants`); setShowSearchResults(false); setSearchQuery(""); }}
                        >
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {app.student.firstName[0]}{app.student.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{app.student.firstName} {app.student.lastName}</p>
                            <p className="text-xs text-muted-foreground truncate">{app.course.name} - {app.university.name}</p>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                  {searchResults.staff.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
                        <UserCog className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Staff</span>
                      </div>
                      {searchResults.staff.map((s: SearchStaffResult) => (
                        <button
                          key={`staff-${s.id}`}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent cursor-pointer"
                          onClick={() => { navigate(`/staff`); setShowSearchResults(false); setSearchQuery(""); }}
                        >
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {s.user.name?.charAt(0) || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{s.user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{s.staffType} - {s.user.email}</p>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <DropdownMenu onOpenChange={(open) => {
          if (open) {
            setLoading(true);
            notificationService.getAllNotifications({ limit: 5 })
              .then((res) => {
                const notifs = Array.isArray(res) ? res : res.data;
                setLocalNotifications(notifs);
              })
              .catch(console.error)
              .finally(() => setLoading(false));
          }
        }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto text-xs text-muted-foreground hover:text-primary p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMarkAllRead();
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : localNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                localNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${notification.readAt ? 'opacity-60' : 'bg-muted/30'}`}
                    onClick={() => handleMarkRead(notification.id)}
                  >
                    <div className="flex w-full justify-between items-start">
                      <span className="font-medium text-sm">{notification.type || 'Notification'}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {notification.createdAt && !isNaN(new Date(notification.createdAt).getTime())
                          ? new Date(notification.createdAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-2">{notification.message}</span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            {localNotifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-center text-xs text-primary cursor-pointer"
                  onClick={() => navigate('/notifications')}
                >
                  View all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
