import api from './api';
import type { 
    VisaApplication, 
    CreateVisaApplicationDto, 
    UpdateVisaApplicationDto,
    VisaApplicationQueryParams
} from '@/types/visaApplication.types';
import type { PaginatedResponse } from '@/types/student.types';

const VISA_APPLICATIONS_ENDPOINT = '/visa-applications';

export const visaApplicationService = {
    /**
     * Get all visa applications with pagination and filters
     */
    async getVisaApplications(params?: VisaApplicationQueryParams): Promise<PaginatedResponse<VisaApplication>> {
        const response = await api.get<PaginatedResponse<VisaApplication>>(VISA_APPLICATIONS_ENDPOINT, {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                sortBy: params?.sortBy,
                sortOrder: params?.sortOrder || 'desc',
                search: params?.search,
                studentId: params?.studentId,
            },
        });
        return response.data;
    },

    /**
     * Get a single visa application by ID
     */
    async getVisaApplicationById(id: string): Promise<VisaApplication> {
        const response = await api.get<VisaApplication>(`${VISA_APPLICATIONS_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new visa application
     */
    async createVisaApplication(data: CreateVisaApplicationDto): Promise<VisaApplication> {
        const response = await api.post<VisaApplication>(VISA_APPLICATIONS_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing visa application
     */
    async updateVisaApplication(id: string, data: UpdateVisaApplicationDto): Promise<VisaApplication> {
        const response = await api.put<VisaApplication>(`${VISA_APPLICATIONS_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a visa application
     */
    async deleteVisaApplication(id: string): Promise<void> {
        await api.delete(`${VISA_APPLICATIONS_ENDPOINT}/${id}`);
    },

    /**
     * Get visa applications for a specific student
     */
    async getStudentVisaApplications(studentId: string): Promise<VisaApplication[]> {
        const response = await api.get<VisaApplication[]>(`${VISA_APPLICATIONS_ENDPOINT}/student/${studentId}`);
        return response.data;
    },
};

export default visaApplicationService;
