import api from './api';
import type {
    Country,
    CreateCountryDto,
    UpdateCountryDto,
    PaginationParams,
    PaginatedResponse,
} from '@/types/country.types';
import type { University } from '@/types/university.types';

const COUNTRIES_ENDPOINT = '/countries';

/**
 * Country Service - Handles all country-related API operations
 */
export const countryService = {
    /**
     * Get all countries with pagination, sorting, and search
     */
    async getCountries(params?: PaginationParams): Promise<PaginatedResponse<Country>> {
        const response = await api.get<PaginatedResponse<Country>>(COUNTRIES_ENDPOINT, {
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
     * Get all active countries (no pagination)
     */
    async getActiveCountries(): Promise<Country[]> {
        const response = await api.get<Country[]>(`${COUNTRIES_ENDPOINT}/active`);
        return response.data;
    },

    /**
     * Get a single country by ID
     */
    async getCountryById(id: string): Promise<Country> {
        const response = await api.get<Country>(`${COUNTRIES_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new country
     */
    async createCountry(data: CreateCountryDto): Promise<Country> {
        const response = await api.post<Country>(COUNTRIES_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing country
     */
    async updateCountry(id: string, data: UpdateCountryDto): Promise<Country> {
        const response = await api.put<Country>(`${COUNTRIES_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a country
     */
    async deleteCountry(id: string): Promise<void> {
        await api.delete(`${COUNTRIES_ENDPOINT}/${id}`);
    },

    /**
     * Get universities by country
     */
    async getCountryUniversities(countryId: string, params?: PaginationParams): Promise<PaginatedResponse<University>> {
        const response = await api.get<PaginatedResponse<University>>(`${COUNTRIES_ENDPOINT}/${countryId}/universities`, {
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
     * Get visa types by country
     */
    async getCountryVisaTypes(countryId: string): Promise<unknown[]> {
        const response = await api.get<unknown[]>(`${COUNTRIES_ENDPOINT}/${countryId}/visa-types`);
        return response.data;
    },
};

export default countryService;
