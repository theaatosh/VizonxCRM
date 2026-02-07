import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import notificationService, { Notification } from '@/services/notification.service';
import { useToast } from '@/components/ui/use-toast';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
    refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { toast } = useToast();

    const refreshUnreadCount = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const { count } = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Initial fetch
        refreshUnreadCount();

        // SSE setup - started only once on mount
        const cleanup = notificationService.getStream(
            (newNotification) => {
                // STRICT FILTERING: Only process real notifications with IDs and valid content
                // Skip connection established messages, technical status updates, or empty messages
                const isSystemMessage =
                    !newNotification.id ||
                    newNotification.type?.toLowerCase().includes('connection') ||
                    newNotification.message?.toLowerCase().includes('connected') ||
                    newNotification.message?.toLowerCase().includes('established') ||
                    newNotification.message?.toLowerCase() === 'success';

                if (isSystemMessage) {
                    return; // Completely ignore these messages
                }

                setNotifications((prev) => [newNotification, ...prev]);

                if (!newNotification.readAt) {
                    setUnreadCount(prev => prev + 1);
                }

                toast({
                    title: newNotification.type || "New Notification",
                    description: newNotification.message,
                });
            },
            (error) => {
                console.error("Notification stream error:", error);
            }
        );

        return () => {
            if (cleanup) cleanup();
        };
    }, [toast]); // Added toast as dependency to be safe, but it's typically stable

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, setUnreadCount, refreshUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};
