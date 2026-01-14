import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/lead.service';
import type {
    Lead,
    CreateLeadDto,
    UpdateLeadDto,
    PaginationParams,
} from '@/types/lead.types';
import { toast } from 'sonner';

// Query keys
export const leadKeys = {
    all: ['leads'] as const,
    lists: () => [...leadKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...leadKeys.lists(), params] as const,
    details: () => [...leadKeys.all, 'detail'] as const,
    detail: (id: string) => [...leadKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated leads
 */
export function useLeads(params?: PaginationParams) {
    return useQuery({
        queryKey: leadKeys.list(params),
        queryFn: () => leadService.getLeads(params),
    });
}

/**
 * Hook to fetch a single lead by ID
 */
export function useLead(id: string) {
    return useQuery({
        queryKey: leadKeys.detail(id),
        queryFn: () => leadService.getLeadById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new lead
 */
export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLeadDto) => leadService.createLead(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            toast.success('Lead created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create lead: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing lead
 */
export function useUpdateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) =>
            leadService.updateLead(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.id) });
            toast.success('Lead updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update lead: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a lead
 */
export function useDeleteLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => leadService.deleteLead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            toast.success('Lead deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete lead: ${error.message}`);
        },
    });
}

/**
 * Hook to convert lead to student
 */
export function useConvertLeadToStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => leadService.convertLeadToStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
            toast.success('Lead converted to student successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to convert lead: ${error.message}`);
        },
    });
}
