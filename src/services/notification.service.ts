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
    getStream(): EventSource {
        const token = localStorage.getItem('accessToken');
        const url = new URL('http://crmapi.vizon-x.com/api/v1/notifications/stream');
        if (token) {
            url.searchParams.append('token', token);
        }
        return new EventSource(url.toString());
    }
};

export default notificationService;
