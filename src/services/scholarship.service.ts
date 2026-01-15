import api from './api';
import {
    Scholarship,
    CreateScholarshipDto,
    UpdateScholarshipDto,
    ScholarshipsResponse,
    ScholarshipQueryParams,
} from '@/types/scholarship.types';

/**
 * Scholarship Service - Production-grade API integration
 */
class ScholarshipService {
    private readonly baseUrl = '/scholarships';

    /**
     * Get all scholarships with pagination and filtering
     */
    async getScholarships(params?: ScholarshipQueryParams): Promise<ScholarshipsResponse> {
        const response = await api.get<ScholarshipsResponse>(this.baseUrl, { params });
        return response.data;
    }

    /**
     * Get active scholarships (published and not past deadline)
     */
    async getActiveScholarships(): Promise<Scholarship[]> {
        const response = await api.get<Scholarship[]>(`${this.baseUrl}/active`);
        return response.data;
    }

    /**
     * Get a single scholarship by ID
     */
    async getScholarshipById(id: string): Promise<Scholarship> {
        const response = await api.get<Scholarship>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    /**
     * Get public scholarship by slug
     */
    async getScholarshipBySlug(slug: string): Promise<Scholarship> {
        const response = await api.get<Scholarship>(`${this.baseUrl}/public/slug/${slug}`);
        return response.data;
    }

    /**
     * Create a new scholarship
     */
    async createScholarship(data: CreateScholarshipDto): Promise<Scholarship> {
        const response = await api.post<Scholarship>(this.baseUrl, data);
        return response.data;
    }

    /**
     * Update an existing scholarship
     */
    async updateScholarship(id: string, data: UpdateScholarshipDto): Promise<Scholarship> {
        const response = await api.put<Scholarship>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    /**
     * Publish or unpublish a scholarship
     */
    async togglePublish(id: string, isPublished: boolean): Promise<Scholarship> {
        const response = await api.patch<Scholarship>(`${this.baseUrl}/${id}/publish`, { isPublished });
        return response.data;
    }

    /**
     * Delete a scholarship (soft delete)
     */
    async deleteScholarship(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }
}

export default new ScholarshipService();
