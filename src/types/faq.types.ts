/**
 * FAQ Types - Based on Swagger API Documentation
 * Endpoint: /api/v1/faqs
 */

export interface Faq {
    id: string;
    category: string;
    question: string;
    answer: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFaqDto {
    category: string;
    question: string;
    answer: string;
    sortOrder: number;
    isActive: boolean;
}

export interface UpdateFaqDto {
    category?: string;
    question?: string;
    answer?: string;
    sortOrder?: number;
    isActive?: boolean;
}

export interface FaqQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    category?: string;
}

export interface FaqsResponse {
    data: Faq[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface GroupedFaq {
    category: string;
    faqs: Faq[];
}

export interface GroupedFaqsResponse {
    data: GroupedFaq[];
}
