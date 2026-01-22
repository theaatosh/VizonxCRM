import api from './api';
import type {
    Service,
    CreateServiceDto,
    UpdateServiceDto,
    AssignStudentToServiceDto,
    AssignMultipleStudentsDto,
    ServiceStudent,
    PaginationParams,
    PaginatedResponse,
} from '@/types/service.types';

const SERVICES_ENDPOINT = '/services';

/**
 * Service API - Handles all service-related API operations
 */
export const serviceService = {
    /**
     * Get all services with pagination, sorting, and search
     */
    async getServices(params?: PaginationParams): Promise<PaginatedResponse<Service>> {
        const response = await api.get<PaginatedResponse<Service>>(SERVICES_ENDPOINT, {
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
     * Get a single service by ID
     */
    async getServiceById(id: string): Promise<Service> {
        const response = await api.get<Service>(`${SERVICES_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new service
     */
    async createService(data: CreateServiceDto): Promise<Service> {
        const response = await api.post<Service>(SERVICES_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing service
     */
    async updateService(id: string, data: UpdateServiceDto): Promise<Service> {
        const response = await api.put<Service>(`${SERVICES_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a service
     */
    async deleteService(id: string): Promise<void> {
        await api.delete(`${SERVICES_ENDPOINT}/${id}`);
    },

    /**
     * Get students assigned to a service
     */
    async getServiceStudents(
        serviceId: string,
        params?: PaginationParams
    ): Promise<PaginatedResponse<ServiceStudent>> {
        const response = await api.get<PaginatedResponse<ServiceStudent>>(
            `${SERVICES_ENDPOINT}/${serviceId}/students`,
            {
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    sortBy: params?.sortBy,
                    sortOrder: params?.sortOrder || 'desc',
                    search: params?.search,
                },
            }
        );
        return response.data;
    },

    /**
     * Assign a single student to a service
     */
    async assignStudentToService(
        serviceId: string,
        data: AssignStudentToServiceDto
    ): Promise<ServiceStudent> {
        const response = await api.post<ServiceStudent>(
            `${SERVICES_ENDPOINT}/${serviceId}/students`,
            data
        );
        return response.data;
    },

    /**
     * Assign multiple students to a service
     */
    async assignMultipleStudents(
        serviceId: string,
        data: AssignMultipleStudentsDto
    ): Promise<{ assigned: number; skipped: number }> {
        const response = await api.post<{ assigned: number; skipped: number }>(
            `${SERVICES_ENDPOINT}/${serviceId}/students/bulk`,
            data
        );
        return response.data;
    },

    /**
     * Unassign a student from a service
     */
    async unassignStudentFromService(serviceId: string, studentId: string): Promise<void> {
        await api.delete(`${SERVICES_ENDPOINT}/${serviceId}/students/${studentId}`);
    },

    /**
     * Get all services assigned to a student
     */
    async getStudentServices(studentId: string): Promise<Service[]> {
        const response = await api.get<Service[]>(
            `${SERVICES_ENDPOINT}/students/${studentId}/services`
        );
        return response.data;
    },
};

export default serviceService;
