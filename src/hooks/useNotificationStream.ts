import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import notificationService, { Notification } from '@/services/notification.service';

export function useNotificationStream(onNotification?: (notification: Notification) => void) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        try {
            cleanup = notificationService.getStream(
                (newNotification) => {
                    setNotifications((prev) => [newNotification, ...prev]);
                    if (onNotification) {
                        onNotification(newNotification);
                    }

                    // Show toast notification

                    // Show toast notification
                    toast({
                        title: newNotification.type || "New Notification",
                        description: newNotification.message,
                    });
                },
                (error) => {
                    console.error("Notification stream error:", error);
                }
            );
        } catch (error) {
            console.error("Failed to connect to notification stream:", error);
        }

        return () => {
            if (cleanup) {
                cleanup();
            }
        };
    }, [toast]);

    return { notifications };
}
