import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '@/services/service.service';
import type {
    CreateServiceDto,
    UpdateServiceDto,
    PaginationParams,
} from '@/types/service.types';
import { toast } from 'sonner';

// Query keys
export const serviceKeys = {
    all: ['services'] as const,
    lists: () => [...serviceKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...serviceKeys.lists(), params] as const,
    details: () => [...serviceKeys.all, 'detail'] as const,
    detail: (id: string) => [...serviceKeys.details(), id] as const,
    students: (serviceId: string, params?: PaginationParams) =>
        [...serviceKeys.all, 'students', serviceId, params] as const,
    studentServices: (studentId: string) =>
        [...serviceKeys.all, 'studentServices', studentId] as const,
};

/**
 * Hook to fetch paginated services
 */
export function useServices(params?: PaginationParams) {
    return useQuery({
        queryKey: serviceKeys.list(params),
        queryFn: () => serviceService.getServices(params),
    });
}

/**
 * Hook to fetch a single service by ID
 */
export function useService(id: string) {
    return useQuery({
        queryKey: serviceKeys.detail(id),
        queryFn: () => serviceService.getServiceById(id),
        enabled: !!id,
    });
}

/**
 * Hook to fetch students assigned to a service
 */
export function useServiceStudents(serviceId: string, params?: PaginationParams) {
    return useQuery({
        queryKey: serviceKeys.students(serviceId, params),
        queryFn: () => serviceService.getServiceStudents(serviceId, params),
        enabled: !!serviceId,
    });
}

/**
 * Hook to fetch services assigned to a student
 */
export function useStudentServices(studentId: string) {
    return useQuery({
        queryKey: serviceKeys.studentServices(studentId),
        queryFn: () => serviceService.getStudentServices(studentId),
        enabled: !!studentId,
    });
}

/**
 * Hook to create a new service
 */
export function useCreateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateServiceDto) => serviceService.createService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
            toast.success('Service created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create service: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing service
 */
export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateServiceDto }) =>
            serviceService.updateService(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
            queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.id) });
            toast.success('Service updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update service: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a service
 */
export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => serviceService.deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
            toast.success('Service deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete service: ${error.message}`);
        },
    });
}
