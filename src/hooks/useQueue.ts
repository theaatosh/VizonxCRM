import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queueService } from '@/services/queue.service';
import type { QueueQueryParams, QueueItemStatus } from '@/types/queue.types';
import { toast } from 'sonner';

export const queueKeys = {
    all: ['queue'] as const,
    queues: () => [...queueKeys.all, 'queues'] as const,
    queue: (id: string) => [...queueKeys.queues(), id] as const,
    items: (queueId: string, params?: QueueQueryParams) => [...queueKeys.all, 'items', queueId, params] as const,
    item: (itemId: string) => [...queueKeys.all, 'item', itemId] as const,
    analytics: () => [...queueKeys.all, 'analytics'] as const,
    queueAnalytics: (queueId: string) => [...queueKeys.all, 'analytics', queueId] as const,
};

export function useQueues() {
    return useQuery({
        queryKey: queueKeys.queues(),
        queryFn: () => queueService.getQueues(),
    });
}

export function useQueue(id: string) {
    return useQuery({
        queryKey: queueKeys.queue(id),
        queryFn: () => queueService.getQueue(id),
        enabled: !!id,
    });
}

export function useQueueItems(queueId: string, params?: QueueQueryParams) {
    return useQuery({
        queryKey: queueKeys.items(queueId, params),
        queryFn: () => queueService.getItems(queueId, params),
        enabled: !!queueId,
    });
}

export function useQueueAnalytics() {
    return useQuery({
        queryKey: queueKeys.analytics(),
        queryFn: () => queueService.getAnalytics(),
        refetchInterval: 30000,
    });
}

export function useUpdateQueueItemStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ queueId, itemId, status, notes }: { queueId: string; itemId: string; status: QueueItemStatus; notes?: string }) =>
            queueService.updateItemStatus(queueId, itemId, status, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queueKeys.all });
            toast.success('Queue item status updated');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update queue item: ${error.message}`);
        },
    });
}

export function useAssignQueueItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ queueId, itemId, staffProfileId, note }: { queueId: string; itemId: string; staffProfileId: string; note?: string }) =>
            queueService.assignItem(queueId, itemId, staffProfileId, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queueKeys.all });
            toast.success('Queue item assigned');
        },
        onError: (error: Error) => {
            toast.error(`Failed to assign queue item: ${error.message}`);
        },
    });
}

export function useAutoAssignQueueItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ queueId, itemId }: { queueId: string; itemId: string }) =>
            queueService.autoAssignItem(queueId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queueKeys.all });
            toast.success('Queue item auto-assigned');
        },
        onError: (error: Error) => {
            toast.error(`Failed to auto-assign: ${error.message}`);
        },
    });
}

export function useReassignQueueItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ queueId, itemId, toStaffProfileId, reason }: { queueId: string; itemId: string; toStaffProfileId: string; reason: string }) =>
            queueService.reassignItem(queueId, itemId, toStaffProfileId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queueKeys.all });
            toast.success('Queue item reassigned');
        },
        onError: (error: Error) => {
            toast.error(`Failed to reassign: ${error.message}`);
        },
    });
}
