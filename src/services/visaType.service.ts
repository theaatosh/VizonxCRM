import api from './api';
import {
    VisaType,
    CreateVisaTypeDto,
    UpdateVisaTypeDto,
    VisaTypesResponse,
    VisaTypeQueryParams,
} from '@/types/visaType.types';

/**
 * Visa Type Service - Production-grade API integration
 */
class VisaTypeService {
    private readonly baseUrl = '/visa-types';

    /**
     * Get all visa types with pagination and filtering
     */
    async getVisaTypes(params?: VisaTypeQueryParams): Promise<VisaTypesResponse> {
        const response = await api.get<VisaTypesResponse>(this.baseUrl, { params });
        return response.data;
    }

    /**
     * Get a single visa type by ID (includes workflows)
     */
    async getVisaTypeById(id: string): Promise<VisaType> {
        const response = await api.get<VisaType>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    /**
     * Get visa types filtered by country
     */
    async getVisaTypesByCountry(countryId: string): Promise<VisaType[]> {
        const response = await api.get<VisaType[]>(`${this.baseUrl}/by-country/${countryId}`);
        return response.data;
    }

    /**
     * Create a new visa type
     */
    async createVisaType(data: CreateVisaTypeDto): Promise<VisaType> {
        const response = await api.post<VisaType>(this.baseUrl, data);
        return response.data;
    }

    /**
     * Update an existing visa type
     */
    async updateVisaType(id: string, data: UpdateVisaTypeDto): Promise<VisaType> {
        const response = await api.put<VisaType>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    /**
     * Delete a visa type
     */
    async deleteVisaType(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }
}

export default new VisaTypeService();
