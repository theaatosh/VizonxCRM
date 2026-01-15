import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment.service';
import { PaginationParams } from '@/types/country.types';
import { CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment.types';
import { useToast } from '@/hooks/use-toast';

export const useAppointments = (params?: PaginationParams) => {
    return useQuery({
        queryKey: ['appointments', params],
        queryFn: () => appointmentService.getAll(params),
    });
};

export const useAppointment = (id: string) => {
    return useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentService.getById(id),
        enabled: !!id,
    });
};

export const useCreateAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreateAppointmentDto) => appointmentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment created successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create appointment",
                variant: "destructive",
            });
        },
    });
};

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentDto }) =>
            appointmentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update appointment",
                variant: "destructive",
            });
        },
    });
};

export const useDeleteAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => appointmentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment deleted successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete appointment",
                variant: "destructive",
            });
        },
    });
};
