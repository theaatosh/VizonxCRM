import api from './api';
import type {
    Lead,
    CreateLeadDto,
    UpdateLeadDto,
    ConvertLeadDto,
    PaginationParams,
    PaginatedResponse,
} from '@/types/lead.types';

const LEADS_ENDPOINT = '/leads';

/**
 * Lead Service - Handles all lead-related API operations
 */
export const leadService = {
    /**
     * Get all leads with pagination, sorting, and search
     */
    async getLeads(params?: PaginationParams): Promise<PaginatedResponse<Lead>> {
        const response = await api.get<PaginatedResponse<Lead>>(LEADS_ENDPOINT, {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                sortBy: params?.sortBy,
                sortOrder: params?.sortOrder || 'desc',
                search: params?.search,
            },
        });
        return response.data;
    },

    /**
     * Get a single lead by ID
     */
    async getLeadById(id: string): Promise<Lead> {
        const response = await api.get<Lead>(`${LEADS_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new lead
     */
    async createLead(data: CreateLeadDto): Promise<Lead> {
        const response = await api.post<Lead>(LEADS_ENDPOINT, data);
        console.log(response)
        return response.data;
    },

    /**
     * Update an existing lead
     */
    async updateLead(id: string, data: UpdateLeadDto): Promise<Lead> {
        const response = await api.put<Lead>(`${LEADS_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a lead
     */
    async deleteLead(id: string): Promise<void> {
        await api.delete(`${LEADS_ENDPOINT}/${id}`);
    },

    /**
     * Convert a lead to a student
     */
    async convertLeadToStudent(id: string, data?: ConvertLeadDto): Promise<void> {
        await api.post(`${LEADS_ENDPOINT}/${id}/convert`, data || {});
    },
};

export default leadService;
