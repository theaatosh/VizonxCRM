import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/services/student.service';
import type {
    Student,
    CreateStudentDto,
    UpdateStudentDto,
    PaginationParams,
} from '@/types/student.types';
import { toast } from 'sonner';

// Query keys
export const studentKeys = {
    all: ['students'] as const,
    lists: () => [...studentKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...studentKeys.lists(), params] as const,
    details: () => [...studentKeys.all, 'detail'] as const,
    detail: (id: string) => [...studentKeys.details(), id] as const,
    documents: (id: string) => [...studentKeys.all, 'documents', id] as const,
};

/**
 * Hook to fetch paginated students
 */
export function useStudents(params?: PaginationParams) {
    return useQuery({
        queryKey: studentKeys.list(params),
        queryFn: () => studentService.getStudents(params),
    });
}

/**
 * Hook to fetch a single student by ID
 */
export function useStudent(id: string) {
    return useQuery({
        queryKey: studentKeys.detail(id),
        queryFn: () => studentService.getStudentById(id),
        enabled: !!id,
    });
}

/**
 * Hook to fetch student documents
 */
export function useStudentDocuments(id: string) {
    return useQuery({
        queryKey: studentKeys.documents(id),
        queryFn: () => studentService.getStudentDocuments(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new student
 */
export function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStudentDto) => studentService.createStudent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
            toast.success('Applicant created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create applicant: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing student
 */
export function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
            studentService.updateStudent(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
            toast.success('Applicant updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update applicant: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a student
 */
export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => studentService.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
            toast.success('Applicant deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete applicant: ${error.message}`);
        },
    });
}
