import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import visaApplicationService from '@/services/visaApplication.service';
import type { 
    CreateVisaApplicationDto, 
    UpdateVisaApplicationDto,
    VisaApplicationQueryParams
} from '@/types/visaApplication.types';
import { toast } from 'sonner';

export const visaApplicationKeys = {
    all: ['visa-applications'] as const,
    lists: () => [...visaApplicationKeys.all, 'list'] as const,
    list: (params?: VisaApplicationQueryParams) => [...visaApplicationKeys.lists(), params] as const,
    details: () => [...visaApplicationKeys.all, 'detail'] as const,
    detail: (id: string) => [...visaApplicationKeys.details(), id] as const,
    byStudent: (studentId: string) => [...visaApplicationKeys.all, 'student', studentId] as const,
};

/**
 * Hook to fetch paginated visa applications
 */
export function useVisaApplications(params?: VisaApplicationQueryParams) {
    return useQuery({
        queryKey: visaApplicationKeys.list(params),
        queryFn: () => visaApplicationService.getVisaApplications(params),
    });
}

/**
 * Hook to fetch visa applications for a specific student
 */
export function useStudentVisaApplications(studentId: string, params?: Omit<VisaApplicationQueryParams, 'studentId'>) {
    return useQuery({
        queryKey: visaApplicationKeys.byStudent(studentId),
        queryFn: () => visaApplicationService.getVisaApplications({ ...params, studentId }),
        enabled: !!studentId,
    });
}

/**
 * Hook to fetch a single visa application by ID
 */
export function useVisaApplication(id: string) {
    return useQuery({
        queryKey: visaApplicationKeys.detail(id),
        queryFn: () => visaApplicationService.getVisaApplicationById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new visa application
 */
export function useCreateVisaApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVisaApplicationDto) => visaApplicationService.createVisaApplication(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa application created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to create visa application: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing visa application
 */
export function useUpdateVisaApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVisaApplicationDto }) =>
            visaApplicationService.updateVisaApplication(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.detail(variables.id) });
            toast.success('Visa application updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update visa application: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a visa application
 */
export function useDeleteVisaApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => visaApplicationService.deleteVisaApplication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa application deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to delete visa application: ${error.message}`);
        },
    });
}
