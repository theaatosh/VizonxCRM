import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import scholarshipService from '@/services/scholarship.service';
import {
    CreateScholarshipDto,
    UpdateScholarshipDto,
    ScholarshipQueryParams,
} from '@/types/scholarship.types';
import { toast } from 'sonner';

// Query keys
export const scholarshipKeys = {
    all: ['scholarships'] as const,
    lists: () => [...scholarshipKeys.all, 'list'] as const,
    list: (params?: ScholarshipQueryParams) => [...scholarshipKeys.lists(), params] as const,
    details: () => [...scholarshipKeys.all, 'detail'] as const,
    detail: (id: string) => [...scholarshipKeys.details(), id] as const,
    active: () => [...scholarshipKeys.all, 'active'] as const,
};

// ==================== Query Hooks ====================

/**
 * Fetch all scholarships with pagination
 */
export const useScholarships = (params?: ScholarshipQueryParams) => {
    return useQuery({
        queryKey: scholarshipKeys.list(params),
        queryFn: () => scholarshipService.getScholarships(params),
    });
};

/**
 * Fetch a single scholarship by ID
 */
export const useScholarship = (id: string) => {
    return useQuery({
        queryKey: scholarshipKeys.detail(id),
        queryFn: () => scholarshipService.getScholarshipById(id),
        enabled: !!id,
    });
};

/**
 * Fetch active scholarships
 */
export const useActiveScholarships = () => {
    return useQuery({
        queryKey: scholarshipKeys.active(),
        queryFn: () => scholarshipService.getActiveScholarships(),
    });
};

// ==================== Mutation Hooks ====================

/**
 * Create a new scholarship
 */
export const useCreateScholarship = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateScholarshipDto) => scholarshipService.createScholarship(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scholarshipKeys.lists() });
            toast.success('Scholarship created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create scholarship');
        },
    });
};

/**
 * Update an existing scholarship
 */
export const useUpdateScholarship = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateScholarshipDto }) =>
            scholarshipService.updateScholarship(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: scholarshipKeys.lists() });
            queryClient.invalidateQueries({ queryKey: scholarshipKeys.detail(variables.id) });
            toast.success('Scholarship updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update scholarship');
        },
    });
};

/**
 * Toggle publish status
 */
export const useTogglePublish = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
            scholarshipService.togglePublish(id, isPublished),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: scholarshipKeys.lists() });
            queryClient.invalidateQueries({ queryKey: scholarshipKeys.detail(variables.id) });
            toast.success(variables.isPublished ? 'Scholarship published' : 'Scholarship unpublished');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update publish status');
        },
    });
};

/**
 * Delete a scholarship
 */
export const useDeleteScholarship = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => scholarshipService.deleteScholarship(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scholarshipKeys.lists() });
            toast.success('Scholarship deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete scholarship');
        },
    });
};
