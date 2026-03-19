import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '@/services/class.service';
import type {
    CreateClassDto,
    UpdateClassDto,
    PaginationParams,
} from '@/types/class.types';
import { toast } from 'sonner';
import { studentKeys } from './useStudents';

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

/**
 * Hook to enroll a student in a class
 */
export function useEnrollStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
            classService.enrollStudent(classId, studentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: classKeys.lists() });
            queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.studentId) });
            toast.success('Student enrolled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to enroll student: ${error.message}`);
        },
    });
}

/**
 * Hook to unenroll a student from a class
 */
export function useUnenrollStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
            classService.unenrollStudent(classId, studentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: classKeys.lists() });
            queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.studentId) });
            toast.success('Student unenrolled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to unenroll student: ${error.message}`);
        },
    });
}

/**
 * Hook to fetch students enrolled in a class
 */
export function useClassStudents(classId: string, params?: PaginationParams) {
    return useQuery({
        queryKey: [...classKeys.all, 'students', classId, params],
        queryFn: () => classService.getClassStudents(classId, params),
        enabled: !!classId,
    });
}

/**
 * Hook to fetch booking requests for a class
 */
export function useClassBookingRequests(classId: string, params?: PaginationParams) {
    return useQuery({
        queryKey: [...classKeys.all, 'booking-requests', classId, params],
        queryFn: () => classService.getClassBookingRequests(classId, params),
        enabled: !!classId,
    });
}
