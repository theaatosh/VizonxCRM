import api from './api';
import {
    Faq,
    CreateFaqDto,
    UpdateFaqDto,
    FaqsResponse,
    FaqQueryParams,
    GroupedFaqsResponse,
} from '@/types/faq.types';

/**
 * FAQ Service - Production-grade API integration
 * Base URL: /api/v1/faqs
 */
class FaqService {
    private readonly baseUrl = '/faqs';

    /**
     * Get all FAQs with pagination and filtering
     */
    async getFaqs(params?: FaqQueryParams): Promise<FaqsResponse> {
        const response = await api.get<FaqsResponse>(this.baseUrl, { params });
        return response.data;
    }

    /**
     * Get FAQs grouped by category
     */
    async getGroupedFaqs(): Promise<GroupedFaqsResponse> {
        const response = await api.get<GroupedFaqsResponse>(`${this.baseUrl}/grouped`);
        return response.data;
    }

    /**
     * Get a single FAQ by ID
     */
    async getFaqById(id: string): Promise<Faq> {
        const response = await api.get<Faq>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    /**
     * Create a new FAQ
     */
    async createFaq(data: CreateFaqDto): Promise<Faq> {
        const response = await api.post<Faq>(this.baseUrl, data);
        return response.data;
    }

    /**
     * Update an existing FAQ
     */
    async updateFaq(id: string, data: UpdateFaqDto): Promise<Faq> {
        const response = await api.put<Faq>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    /**
     * Delete a FAQ
     */
    async deleteFaq(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }
}

export default new FaqService();
