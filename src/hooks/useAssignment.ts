import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '@/services/assignment.service';
import type { CreateAssignmentDto, ReassignDto } from '@/types/assignment.types';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils/error.utils';

export const assignmentKeys = {
    all: ['assignments'] as const,
    leadHistory: (leadId: string) => [...assignmentKeys.all, 'lead', leadId] as const,
    historyById: (id: string) => [...assignmentKeys.all, 'history', id] as const,
};

export function useLeadAssignmentHistory(leadId: string) {
    return useQuery({
        queryKey: assignmentKeys.leadHistory(leadId),
        queryFn: () => assignmentService.getLeadHistory(leadId),
        enabled: !!leadId,
    });
}

export function useAssignmentHistoryById(id: string) {
    return useQuery({
        queryKey: assignmentKeys.historyById(id),
        queryFn: () => assignmentService.getHistoryById(id),
        enabled: !!id,
    });
}

export function useAddToQueue() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAssignmentDto) => assignmentService.addToQueue(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue'] });
            toast.success('Lead added to queue');
        },
        onError: (error) => {
            toast.error(`Failed to add to queue: ${getApiErrorMessage(error)}`);
        },
    });
}

export function useAssignToStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ queueId, itemId, staffProfileId, note }: { queueId: string; itemId: string; staffProfileId: string; note?: string }) =>
            assignmentService.assignToStaff(queueId, itemId, staffProfileId, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue'] });
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            toast.success('Lead assigned successfully');
        },
        onError: (error) => {
            toast.error(`Failed to assign lead: ${getApiErrorMessage(error)}`);
        },
    });
}

export function useReassignStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ queueId, itemId, data }: { queueId: string; itemId: string; data: ReassignDto }) =>
            assignmentService.reassign(queueId, itemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue'] });
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            toast.success('Lead reassigned successfully');
        },
        onError: (error) => {
            toast.error(`Failed to reassign lead: ${getApiErrorMessage(error)}`);
        },
    });
}
