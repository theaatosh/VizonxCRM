import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import type { 
    PaymentFilters, 
    CreatePaymentDto, 
    UpdatePaymentDto 
} from '@/types/payment.types';
import { toast } from 'sonner';

export const usePayments = (filters?: PaymentFilters) => {
    return useQuery({
        queryKey: ['payments', filters],
        queryFn: () => paymentService.getPayments(filters),
    });
};

export const useOverduePayments = (filters?: PaymentFilters) => {
    return useQuery({
        queryKey: ['payments', 'overdue', filters],
        queryFn: () => paymentService.getOverduePayments(filters),
    });
};

export const useStudentPaymentHistory = (studentId: string, filters?: PaymentFilters) => {
    return useQuery({
        queryKey: ['payments', 'student', studentId, filters],
        queryFn: () => paymentService.getStudentPaymentHistory(studentId, filters),
        enabled: !!studentId,
    });
};

export const useStudentPaymentSummary = (studentId: string) => {
    return useQuery({
        queryKey: ['payments', 'student', studentId, 'summary'],
        queryFn: () => paymentService.getStudentPaymentSummary(studentId),
        enabled: !!studentId,
    });
};

export const usePayment = (id: string) => {
    return useQuery({
        queryKey: ['payment', id],
        queryFn: () => paymentService.getPaymentById(id),
        enabled: !!id,
    });
};

export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePaymentDto) => paymentService.createPayment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            toast.success('Payment recorded successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to record payment');
        },
    });
};

export const useUpdatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) => 
            paymentService.updatePayment(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment', data.id] });
            toast.success('Payment updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update payment');
        },
    });
};

export const useDeletePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => paymentService.deletePayment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            toast.success('Payment record deleted');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete payment');
        },
    });
};
