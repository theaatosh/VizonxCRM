import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source';
import api from './api';

export interface Notification {
    id: string;
    tenantId: string;
    userId: string;
    type: string;
    message: string;
    status: string;
    metadata?: any;
    readAt?: string;
    createdAt: string;
}

export interface UnreadCountResponse {
    count: number;
}

export interface PaginatedNotifications {
    data: Notification[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const notificationService = {
    /**
     * Get all notifications for the current user
     */
    async getAllNotifications(params?: { page?: number; limit?: number }): Promise<PaginatedNotifications | Notification[]> {
        const response = await api.get<PaginatedNotifications | Notification[]>('/notifications', { params });
        return response.data;
    },

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<UnreadCountResponse> {
        const response = await api.get<UnreadCountResponse>('/notifications/unread-count');
        return response.data;
    },

    /**
     * Mark a notification as read
     */
    async markAsRead(id: string): Promise<void> {
        await api.put(`/notifications/${id}/read`);
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<void> {
        await api.put('/notifications/mark-all-read');
    },

    /**
     * Delete a notification
     */
    async deleteNotification(id: string): Promise<void> {
        await api.delete(`/notifications/${id}`);
    },

    /**
     * Get real-time notification stream
     */
    getStream(
        onMessage: (data: Notification) => void,
        onError: (err: any) => void
    ): () => void {
        const token = localStorage.getItem('accessToken');
        const ctrl = new AbortController();

        fetchEventSource('http://crmapi.vizon-x.com/api/v1/notifications/stream', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            signal: ctrl.signal,
            async onopen(response) {
                if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
                    return; // everything is good
                } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    // client-side errors are usually non-retriable:
                    throw new Error(`Failed to establish SSE connection: ${response.statusText}`);
                } else {
                    // rethrow to keep alive
                    // throw new Error(`Failed to establish SSE connection: ${response.statusText}`);
                }
            },
            onmessage(msg) {
                if (msg.event === 'close') {
                    // handle close event if needed
                } else if (msg.data) {
                    try {
                        const data = JSON.parse(msg.data);
                        onMessage(data);
                    } catch (e) {
                        // console.error('Failed to parse SSE message', e);
                    }
                }
            },
            onerror(err) {
                if (err instanceof Error) {
                    onError(err);
                    throw err; // rethrow to stop the operation
                }
            }
        }).catch(err => {
            onError(err);
        });

        return () => ctrl.abort();
    }
};

export default notificationService;
