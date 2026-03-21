import api from './api';
import type { 
    ActivityLog, 
    LogQueryParams, 
    ActivityStats,
    PaginationParams
} from '@/types/log.types';
import type { PaginatedResponse } from '@/types/student.types';

const LOGS_ENDPOINT = '/logs';

export const logService = {
    /**
     * Get all activity logs with filtering
     */
    async getLogs(params?: LogQueryParams): Promise<PaginatedResponse<ActivityLog>> {
        const response = await api.get<PaginatedResponse<ActivityLog>>(LOGS_ENDPOINT, {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                sortBy: params?.sortBy,
                sortOrder: params?.sortOrder || 'desc',
                search: params?.search,
                userId: params?.userId,
                entityType: params?.entityType,
                entityId: params?.entityId,
                action: params?.action,
                fromDate: params?.fromDate,
                toDate: params?.toDate,
            },
        });
        return response.data;
    },

    /**
     * Get activity statistics
     */
    async getLogStats(): Promise<ActivityStats> {
        const response = await api.get<ActivityStats>(`${LOGS_ENDPOINT}/stats`);
        return response.data;
    },

    /**
     * Get activity logs for a specific entity
     */
    async getEntityLogs(entityType: string, entityId: string, params?: PaginationParams): Promise<PaginatedResponse<ActivityLog>> {
        const response = await api.get<PaginatedResponse<ActivityLog>>(`${LOGS_ENDPOINT}/entity/${entityType}/${entityId}`, {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                sortBy: params?.sortBy,
                sortOrder: params?.sortOrder || 'desc',
                search: params?.search,
            },
        });
        return response.data;
    },

    /**
     * Get activity logs for a specific user
     */
    async getUserLogs(userId: string, params?: PaginationParams): Promise<PaginatedResponse<ActivityLog>> {
        const response = await api.get<PaginatedResponse<ActivityLog>>(`${LOGS_ENDPOINT}/user/${userId}`, {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                sortBy: params?.sortBy,
                sortOrder: params?.sortOrder || 'desc',
                search: params?.search,
            },
        });
        return response.data;
    },
};

export default logService;
