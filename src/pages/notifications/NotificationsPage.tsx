import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Trash2, Bell } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import notificationService, { Notification } from "@/services/notification.service";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Fetch more items for the full page
            const response = await notificationService.getAllNotifications({ limit: 50 });
            const data = Array.isArray(response) ? response : response.data;
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast({
                title: "Error",
                description: "Failed to load notifications.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, readAt: new Date().toISOString() } : n
            ));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
            toast({
                title: "Success",
                description: "All notifications marked as read.",
            });
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast({
                title: "Deleted",
                description: "Notification removed.",
            });
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.readAt);

    return (
        <div className="flex min-h-screen flex-col bg-muted/40 font-sans">
            <DashboardHeader title="Notifications" />
            <main className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Your Notifications</h2>
                        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    </div>

                    <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">
                                Unread
                                {notifications.filter(n => !n.readAt).length > 0 && (
                                    <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">{notifications.filter(n => !n.readAt).length}</Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4 mt-4">
                            <NotificationList
                                items={filteredNotifications}
                                loading={loading}
                                onRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        </TabsContent>

                        <TabsContent value="unread" className="space-y-4 mt-4">
                            <NotificationList
                                items={filteredNotifications}
                                loading={loading}
                                onRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

function NotificationList({
    items,
    loading,
    onRead,
    onDelete
}: {
    items: Notification[],
    loading: boolean,
    onRead: (id: string) => void,
    onDelete: (id: string) => void
}) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4 opacity-50" />
                    <p>No notifications found.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            {items.map(notification => (
                <Card key={notification.id} className={`transition-all hover:shadow-sm ${notification.readAt ? 'opacity-80' : 'border-l-4 border-l-primary'}`}>
                    <CardContent className="p-4 flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{notification.type || 'Notification'}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-sm">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {!notification.readAt && (
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onRead(notification.id)} title="Mark as read">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(notification.id)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
