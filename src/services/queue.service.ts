import api from './api';
import type {
    Queue,
    QueueItem,
    QueueAnalytics,
    QueueQueryParams,
    QueueItemStatus,
    PaginatedResponse,
    AssignmentHistoryItem,
    AssignmentReason,
} from '@/types/queue.types';

const QUEUE_ENDPOINT = '/queues';

export const queueService = {
    // Queue CRUD
    async getQueues(): Promise<PaginatedResponse<Queue>> {
        const response = await api.get<PaginatedResponse<Queue>>(QUEUE_ENDPOINT);
        return response.data;
    },

    async getQueue(id: string): Promise<Queue> {
        const response = await api.get<Queue>(`${QUEUE_ENDPOINT}/${id}`);
        return response.data;
    },

    async createQueue(data: { type: string; name: string; description?: string; autoAssign?: boolean }): Promise<Queue> {
        const response = await api.post<Queue>(QUEUE_ENDPOINT, data);
        return response.data;
    },

    async updateQueue(id: string, data: { name?: string; description?: string; isActive?: boolean; autoAssign?: boolean }): Promise<Queue> {
        const response = await api.put<Queue>(`${QUEUE_ENDPOINT}/${id}`, data);
        return response.data;
    },

    async deleteQueue(id: string): Promise<void> {
        await api.delete(`${QUEUE_ENDPOINT}/${id}`);
    },

    // Queue Items
    async getItems(queueId: string, params?: QueueQueryParams): Promise<PaginatedResponse<QueueItem>> {
        const response = await api.get<PaginatedResponse<QueueItem>>(`${QUEUE_ENDPOINT}/${queueId}/items`, { params });
        return response.data;
    },

    async getItem(itemId: string): Promise<QueueItem> {
        const response = await api.get<QueueItem>(`${QUEUE_ENDPOINT}/items/${itemId}`);
        return response.data;
    },

    async addItem(queueId: string, data: { leadId: string; notes?: string }): Promise<QueueItem> {
        const response = await api.post<QueueItem>(`${QUEUE_ENDPOINT}/${queueId}/items`, data);
        return response.data;
    },

    async updateItemStatus(queueId: string, itemId: string, status: QueueItemStatus, notes?: string): Promise<QueueItem> {
        const response = await api.patch<QueueItem>(`${QUEUE_ENDPOINT}/${queueId}/items/${itemId}/status`, { status, notes });
        return response.data;
    },

    async deleteItem(itemId: string): Promise<void> {
        await api.delete(`${QUEUE_ENDPOINT}/items/${itemId}`);
    },

    // Assignment
    async assignItem(queueId: string, itemId: string, staffProfileId: string, note?: string): Promise<QueueItem> {
        const response = await api.post<QueueItem>(`${QUEUE_ENDPOINT}/${queueId}/items/${itemId}/assign`, { staffProfileId, note });
        return response.data;
    },

    async autoAssignItem(queueId: string, itemId: string): Promise<QueueItem> {
        const response = await api.post<QueueItem>(`${QUEUE_ENDPOINT}/${queueId}/items/${itemId}/auto-assign`);
        return response.data;
    },

    async reassignItem(queueId: string, itemId: string, toStaffProfileId: string, reason: string): Promise<QueueItem> {
        const response = await api.post<QueueItem>(`${QUEUE_ENDPOINT}/${queueId}/items/${itemId}/reassign`, { toStaffProfileId, reason });
        return response.data;
    },

    // Lead Processing
    async processNewLead(leadId: string, queueId: string): Promise<QueueItem> {
        const response = await api.post<QueueItem>(`${QUEUE_ENDPOINT}/leads/${leadId}/process-new`, null, {
            params: { queueId },
        });
        return response.data;
    },

    async revisitLead(leadId: string): Promise<QueueItem> {
        const response = await api.post<QueueItem>(`${QUEUE_ENDPOINT}/leads/${leadId}/revisit`);
        return response.data;
    },

    // Analytics
    async getAnalytics(): Promise<QueueAnalytics> {
        const response = await api.get<QueueAnalytics>(`${QUEUE_ENDPOINT}/analytics`);
        return response.data;
    },

    async getQueueAnalytics(queueId: string): Promise<QueueAnalytics> {
        const response = await api.get<QueueAnalytics>(`${QUEUE_ENDPOINT}/${queueId}/analytics`);
        return response.data;
    },

    // Assignment History
    async getAssignmentHistory(params?: {
        page?: number;
        limit?: number;
        leadId?: string;
        staffId?: string;
        reason?: AssignmentReason;
    }): Promise<PaginatedResponse<AssignmentHistoryItem>> {
        const response = await api.get<PaginatedResponse<AssignmentHistoryItem>>(`${QUEUE_ENDPOINT}/assignment-history`, { params });
        return response.data;
    },

    async getLeadAssignmentHistory(leadId: string): Promise<AssignmentHistoryItem[]> {
        const response = await api.get<AssignmentHistoryItem[]>(`${QUEUE_ENDPOINT}/leads/${leadId}/assignment-history`);
        return response.data;
    },
};

export default queueService;
