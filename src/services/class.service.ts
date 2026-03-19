import api from './api';
import type {
    Class,
    CreateClassDto,
    UpdateClassDto,
    PaginationParams,
} from '@/types/class.types';
import type { PaginatedResponse } from '@/types/service.types';

const CLASSES_ENDPOINT = '/classes';

/**
 * Class API - Handles all class-related API operations
 */
export const classService = {
    /**
     * Get all classes with pagination
     */
    async getClasses(params?: PaginationParams): Promise<PaginatedResponse<Class>> {
        const response = await api.get<PaginatedResponse<Class>>(CLASSES_ENDPOINT, {
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
     * Get a single class by ID
     */
    async getClassById(id: string): Promise<Class> {
        const response = await api.get<Class>(`${CLASSES_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new class
     */
    async createClass(data: CreateClassDto): Promise<Class> {
        const response = await api.post<Class>(CLASSES_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing class
     */
    async updateClass(id: string, data: UpdateClassDto): Promise<Class> {
        const response = await api.put<Class>(`${CLASSES_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a class
     */
    async deleteClass(id: string): Promise<void> {
        await api.delete(`${CLASSES_ENDPOINT}/${id}`);
    },

    /**
     * Enroll a student in a class
     */
    async enrollStudent(classId: string, studentId: string): Promise<void> {
        await api.post(`${CLASSES_ENDPOINT}/${classId}/enroll`, { studentId });
    },

    /**
     * Unenroll a student from a class
     */
    async unenrollStudent(classId: string, studentId: string): Promise<void> {
        await api.delete(`${CLASSES_ENDPOINT}/${classId}/students/${studentId}`);
    },

    /**
     * Get students enrolled in a class
     */
    async getClassStudents(classId: string, params?: PaginationParams): Promise<PaginatedResponse<any>> {
        const response = await api.get<PaginatedResponse<any>>(`${CLASSES_ENDPOINT}/${classId}/students`, {
            params,
        });
        return response.data;
    },

    /**
     * Get booking requests for a class
     */
    async getClassBookingRequests(classId: string, params?: PaginationParams): Promise<PaginatedResponse<any>> {
        const response = await api.get<PaginatedResponse<any>>(`${CLASSES_ENDPOINT}/${classId}/booking-requests`, {
            params,
        });
        return response.data;
    },
};

export default classService;
