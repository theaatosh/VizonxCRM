import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '@/services/class.service';
import type {
    CreateClassDto,
    UpdateClassDto,
    PaginationParams,
} from '@/types/class.types';
import { toast } from 'sonner';

export const classKeys = {
    all: ['classes'] as const,
    lists: () => [...classKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...classKeys.lists(), params] as const,
    details: () => [...classKeys.all, 'detail'] as const,
    detail: (id: string) => [...classKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated classes
 */
export function useClasses(params?: PaginationParams) {
    return useQuery({
        queryKey: classKeys.list(params),
        queryFn: () => classService.getClasses(params),
    });
}

/**
 * Hook to fetch a single class by ID
 */
export function useClass(id: string) {
    return useQuery({
        queryKey: classKeys.detail(id),
        queryFn: () => classService.getClassById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new class
 */
export function useCreateClass() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClassDto) => classService.createClass(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: classKeys.lists() });
            toast.success('Class created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create class: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing class
 */
export function useUpdateClass() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateClassDto }) =>
            classService.updateClass(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: classKeys.lists() });
            queryClient.invalidateQueries({ queryKey: classKeys.detail(variables.id) });
            toast.success('Class updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update class: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a class
 */
export function useDeleteClass() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => classService.deleteClass(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: classKeys.lists() });
            toast.success('Class deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete class: ${error.message}`);
        },
    });
}
