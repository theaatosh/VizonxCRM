import api from './api';
import type { 
    Payment, 
    CreatePaymentDto, 
    UpdatePaymentDto, 
    PaymentFilters, 
    PaymentSummary 
} from '@/types/payment.types';
import type { PaginatedResponse } from '@/types/student.types';

const PAYMENTS_ENDPOINT = '/payments';

export const paymentService = {
    async getPayments(params?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
        const response = await api.get<PaginatedResponse<Payment>>(PAYMENTS_ENDPOINT, { params });
        return response.data;
    },

    async getOverduePayments(params?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
        const response = await api.get<PaginatedResponse<Payment>>(`${PAYMENTS_ENDPOINT}/overdue`, { params });
        return response.data;
    },

    async getStudentPaymentHistory(studentId: string, params?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
        const response = await api.get<PaginatedResponse<Payment>>(`${PAYMENTS_ENDPOINT}/student/${studentId}`, { params });
        return response.data;
    },

    async getStudentPaymentSummary(studentId: string): Promise<PaymentSummary> {
        const response = await api.get<PaymentSummary>(`${PAYMENTS_ENDPOINT}/student/${studentId}/summary`);
        return response.data;
    },

    async getPaymentById(id: string): Promise<Payment> {
        const response = await api.get<Payment>(`${PAYMENTS_ENDPOINT}/${id}`);
        return response.data;
    },

    async createPayment(data: CreatePaymentDto): Promise<Payment> {
        const response = await api.post<Payment>(PAYMENTS_ENDPOINT, data);
        return response.data;
    },

    async updatePayment(id: string, data: UpdatePaymentDto): Promise<Payment> {
        const response = await api.put<Payment>(`${PAYMENTS_ENDPOINT}/${id}`, data);
        return response.data;
    },

    async deletePayment(id: string): Promise<void> {
        await api.delete(`${PAYMENTS_ENDPOINT}/${id}`);
    },
};
