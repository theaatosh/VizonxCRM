import api from './api';
import type {
    AssignmentHistoryItem,
    CreateAssignmentDto,
    ReassignDto,
} from '@/types/assignment.types';
import type { PaginatedResponse } from '@/types/queue.types';

export const assignmentService = {
    async getLeadHistory(leadId: string): Promise<AssignmentHistoryItem[]> {
        const response = await api.get<PaginatedResponse<AssignmentHistoryItem>>(`/queues/leads/${leadId}/assignment-history`);
        return response.data.data;
    },

    async addToQueue(data: CreateAssignmentDto): Promise<void> {
        const { queueId, leadId, note } = data;
        await api.post(`/queues/${queueId}/items`, { leadId, notes: note });
    },

    async assignToStaff(queueId: string, itemId: string, staffProfileId: string, note?: string): Promise<void> {
        await api.post(`/queues/${queueId}/items/${itemId}/assign`, { staffProfileId, note });
    },

    async reassign(queueId: string, itemId: string, data: ReassignDto): Promise<void> {
        await api.post(`/queues/${queueId}/items/${itemId}/reassign`, data);
    },
};

export default assignmentService;
