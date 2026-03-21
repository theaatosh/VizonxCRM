import { useQuery } from '@tanstack/react-query';
import logService from '@/services/log.service';
import type { 
    LogQueryParams,
    PaginationParams
} from '@/types/log.types';

export const logKeys = {
    all: ['logs'] as const,
    lists: () => [...logKeys.all, 'list'] as const,
    list: (params?: LogQueryParams) => [...logKeys.lists(), params] as const,
    stats: () => [...logKeys.all, 'stats'] as const,
    byEntity: (entityType: string, entityId: string, params?: PaginationParams) => 
        [...logKeys.all, 'entity', entityType, entityId, params] as const,
    byUser: (userId: string, params?: PaginationParams) => 
        [...logKeys.all, 'user', userId, params] as const,
};

/**
 * Hook to fetch paginated activity logs
 */
export function useLogs(params?: LogQueryParams) {
    return useQuery({
        queryKey: logKeys.list(params),
        queryFn: () => logService.getLogs(params),
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Hook to fetch activity statistics
 */
export function useLogStats() {
    return useQuery({
        queryKey: logKeys.stats(),
        queryFn: () => logService.getLogStats(),
    });
}

/**
 * Hook to fetch logs for a specific entity
 */
export function useEntityLogs(entityType: string, entityId: string, params?: PaginationParams) {
    return useQuery({
        queryKey: logKeys.byEntity(entityType, entityId, params),
        queryFn: () => logService.getEntityLogs(entityType, entityId, params),
        enabled: !!entityType && !!entityId,
    });
}

/**
 * Hook to fetch logs for a specific user
 */
export function useUserLogs(userId: string, params?: PaginationParams) {
    return useQuery({
        queryKey: logKeys.byUser(userId, params),
        queryFn: () => logService.getUserLogs(userId, params),
        enabled: !!userId,
    });
}
