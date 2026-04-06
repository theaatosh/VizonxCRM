import api from './api';
import type { 
    Payment, 
    CreatePaymentDto, 
    UpdatePaymentDto, 
    PaymentFilters, 
    PaymentSummary,
    PaymentStatisticsFilters,
    PaymentStatisticsResponse,
    PaymentCycleSummary
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

    async getPendingPayments(studentId: string, serviceId?: string): Promise<Payment[]> {
        const url = serviceId ? `${PAYMENTS_ENDPOINT}/pending/${studentId}/${serviceId}` : `${PAYMENTS_ENDPOINT}/pending/${studentId}`;
        const response = await api.get<Payment[]>(url);
        return response.data;
    },

    async getPaymentCycles(studentId: string, serviceId?: string): Promise<PaymentCycleSummary> {
        const url = serviceId ? `${PAYMENTS_ENDPOINT}/cycles/${studentId}/${serviceId}` : `${PAYMENTS_ENDPOINT}/cycles/${studentId}`;
        const response = await api.get<PaymentCycleSummary>(url);
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

    async getPaymentSummary(params?: PaymentStatisticsFilters): Promise<PaymentStatisticsResponse> {
        const response = await api.get<PaymentStatisticsResponse>(`${PAYMENTS_ENDPOINT}/statistics/summary`, { params });
        return response.data;
    },
};
