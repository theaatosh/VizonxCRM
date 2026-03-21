import api from './api';
import type { 
    CourseApplication, 
    CourseApplicationFilters, 
    PaginatedResponse,
    ApplicationStatus
} from '@/types/course-application.types';

const APPLICATIONS_ENDPOINT = '/course-applications';

export const courseApplicationService = {
    async getApplications(params?: CourseApplicationFilters): Promise<PaginatedResponse<CourseApplication>> {
        const response = await api.get<PaginatedResponse<CourseApplication>>(APPLICATIONS_ENDPOINT, { params });
        return response.data;
    },

    async getApplicationsByStudent(studentId: string, params?: Omit<CourseApplicationFilters, 'studentId'>): Promise<PaginatedResponse<CourseApplication>> {
        const response = await api.get<PaginatedResponse<CourseApplication>>(`${APPLICATIONS_ENDPOINT}/students/${studentId}`, { params });
        return response.data;
    },

    async getApplicationById(id: string): Promise<CourseApplication> {
        const response = await api.get<CourseApplication>(`${APPLICATIONS_ENDPOINT}/${id}`);
        return response.data;
    },

    async deleteApplication(id: string): Promise<void> {
        await api.delete(`${APPLICATIONS_ENDPOINT}/${id}`);
    },

    async updateApplicationStatus(id: string, status: ApplicationStatus, rejectionReason?: string): Promise<CourseApplication> {
        const response = await api.patch<CourseApplication>(`${APPLICATIONS_ENDPOINT}/${id}/status`, {
            status,
            rejectionReason,
        });
        return response.data;
    },
};
