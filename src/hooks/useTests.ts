import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import testService from '@/services/test.service';
import type { CreateTestDto, UpdateTestDto, PaginationParams } from '@/types/test.types';
import { toast } from 'sonner';
import { studentKeys } from './useStudents';

export const TEST_KEYS = {
    all: ['tests'] as const,
    lists: () => [...TEST_KEYS.all, 'list'] as const,
    list: (params: PaginationParams) => [...TEST_KEYS.lists(), params] as const,
    details: () => [...TEST_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...TEST_KEYS.details(), id] as const,
};

export function useTests(params: PaginationParams = {}) {
    return useQuery({
        queryKey: TEST_KEYS.list(params),
        queryFn: () => testService.getTests(params),
    });
}

export function useTest(id: string) {
    return useQuery({
        queryKey: TEST_KEYS.detail(id),
        queryFn: () => testService.getTestById(id),
        enabled: !!id,
    });
}

export function useCreateTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTestDto) => testService.createTest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TEST_KEYS.lists() });
            toast.success('Test created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create test');
        },
    });
}

export function useUpdateTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTestDto }) =>
            testService.updateTest(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: TEST_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: TEST_KEYS.detail(data.id) });
            toast.success('Test updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update test');
        },
    });
}

export function useDeleteTest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => testService.deleteTest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TEST_KEYS.lists() });
            toast.success('Test deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete test');
        },
    });
}

/**
 * Hook to assign a test to a student
 */
export function useAssignStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ testId, studentId }: { testId: string; studentId: string }) =>
            testService.assignStudent(testId, studentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: TEST_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.studentId) });
            toast.success('Test assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to assign test: ${error.message}`);
        },
    });
}
