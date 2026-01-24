import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import notificationService, { Notification } from '@/services/notification.service';

export function useNotificationStream() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        let eventSource: EventSource | null = null;

        try {
            eventSource = notificationService.getStream();

            eventSource.onmessage = (event) => {
                try {
                    const newNotification = JSON.parse(event.data);
                    setNotifications((prev) => [newNotification, ...prev]);

                    // Show toast notification
                    toast({
                        title: newNotification.type || "New Notification",
                        description: newNotification.message,
                    });
                } catch (error) {
                    console.error("Error parsing notification event:", error);
                }
            };

            eventSource.onerror = (error) => {
                console.error("EventSource failed:", error);
                eventSource?.close();
            };

        } catch (error) {
            console.error("Failed to connect to notification stream:", error);
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [toast]);

    return { notifications };
}
