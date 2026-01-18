import api from './api';
import {
    LandingPage,
    CreateLandingPageDto,
    UpdateLandingPageDto,
    LandingPagesResponse,
    LandingPageQueryParams,
} from '@/types/landingPage.types';

/**
 * Landing Page Service - Production-grade API integration
 * Base URL: /api/v1/landing-pages
 */
class LandingPageService {
    private readonly baseUrl = '/landing-pages';

    /**
     * Get all landing pages with pagination and filtering
     */
    async getLandingPages(params?: LandingPageQueryParams): Promise<LandingPagesResponse> {
        const response = await api.get<LandingPagesResponse>(this.baseUrl, { params });
        return response.data;
    }

    /**
     * Get a single landing page by ID
     */
    async getLandingPageById(id: string): Promise<LandingPage> {
        const response = await api.get<LandingPage>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    /**
     * Create a new landing page
     */
    async createLandingPage(data: CreateLandingPageDto): Promise<LandingPage> {
        const response = await api.post<LandingPage>(this.baseUrl, data);
        return response.data;
    }

    /**
     * Update an existing landing page
     */
    async updateLandingPage(id: string, data: UpdateLandingPageDto): Promise<LandingPage> {
        const response = await api.put<LandingPage>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    /**
     * Delete a landing page
     */
    async deleteLandingPage(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }
}

export default new LandingPageService();
