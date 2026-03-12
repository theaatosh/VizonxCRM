import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment.service';
import { AppointmentQueryParams, CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment.types';
import { useToast } from '@/hooks/use-toast';

export const useAppointments = (params?: AppointmentQueryParams) => {
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

export const useApproveAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, staffNotes }: { id: string; staffNotes?: string }) =>
            appointmentService.approve(id, staffNotes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment approved successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to approve appointment",
                variant: "destructive",
            });
        },
    });
};
export const useRejectAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason?: string }) =>
            appointmentService.reject(id, rejectionReason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment rejected successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to reject appointment",
                variant: "destructive",
            });
        },
    });
};

export const useCompleteAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, outcomeNotes }: { id: string; outcomeNotes?: string }) =>
            appointmentService.complete(id, outcomeNotes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment marked as completed",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to complete appointment",
                variant: "destructive",
            });
        },
    });
};

export const useNoShowAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => appointmentService.noShow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment marked as no-show",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to mark as no-show",
                variant: "destructive",
            });
        },
    });
};

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, cancellationReason }: { id: string; cancellationReason: string }) =>
            appointmentService.cancel(id, cancellationReason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast({
                title: "Success",
                description: "Appointment cancelled successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to cancel appointment",
                variant: "destructive",
            });
        },
    });
};

export const useBookedSlots = (data: { staffId: string; from: string; to: string }) => {
    return useQuery({
        queryKey: ['booked-slots', data],
        queryFn: () => appointmentService.getBookedSlots(data),
        enabled: !!data.staffId && !!data.from && !!data.to,
    });
};
