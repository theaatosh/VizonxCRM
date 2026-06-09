import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staff.service';
import type { StaffQueryParams } from '@/types/staff.types';
import { toast } from 'sonner';

export const staffKeys = {
    all: ['staff'] as const,
    lists: () => [...staffKeys.all, 'list'] as const,
    list: (params?: StaffQueryParams) => [...staffKeys.lists(), params] as const,
    details: () => [...staffKeys.all, 'detail'] as const,
    detail: (id: string) => [...staffKeys.details(), id] as const,
    workload: (staffId?: string) => [...staffKeys.all, 'workload', staffId] as const,
    available: () => [...staffKeys.all, 'available'] as const,
    stats: () => [...staffKeys.all, 'stats'] as const,
};

export function useStaffList(params?: StaffQueryParams) {
    return useQuery({
        queryKey: staffKeys.list(params),
        queryFn: () => staffService.getAll(params),
    });
}

export function useStaffMember(id: string) {
    return useQuery({
        queryKey: staffKeys.detail(id),
        queryFn: () => staffService.getById(id),
        enabled: !!id,
    });
}

export function useStaffWorkload(staffId?: string) {
    return useQuery({
        queryKey: staffKeys.workload(staffId),
        queryFn: () => staffService.getWorkload(staffId),
    });
}

export function useStaffAvailable() {
    return useQuery({
        queryKey: staffKeys.available(),
        queryFn: () => staffService.getAvailable(),
    });
}

export function useStaffStats() {
    return useQuery({
        queryKey: staffKeys.stats(),
        queryFn: () => staffService.getStats(),
    });
}

export function useUpdateStaffStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'Available' | 'Busy' | 'OnLeave' | 'Offline' }) =>
            staffService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
            queryClient.invalidateQueries({ queryKey: staffKeys.workload() });
            toast.success('Status updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update status: ${error.message}`);
        },
    });
}

export function useUpdateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: import('@/types/staff.types').UpdateStaffDto }) =>
            staffService.update(id, data),
        onSuccess: (_result, { id }) => {
            queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
            queryClient.invalidateQueries({ queryKey: staffKeys.workload() });
            toast.success('Staff profile updated');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update profile: ${error.message}`);
        },
    });
}

export function useDeleteStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => staffService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
            queryClient.invalidateQueries({ queryKey: staffKeys.workload() });
            toast.success('Staff profile deleted');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete profile: ${error.message}`);
        },
    });
}
