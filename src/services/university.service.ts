import api from './api';
import type {
    University,
    Course,
    CreateUniversityDto,
    UpdateUniversityDto,
    CreateCourseDto,
    UpdateCourseDto,
    PaginationParams,
    PaginatedResponse,
} from '@/types/university.types';

const UNIVERSITIES_ENDPOINT = '/universities';

/**
 * University Service - Handles all university and course-related API operations
 */
export const universityService = {
    /**
     * Get all universities with pagination, sorting, and search
     */
    async getUniversities(params?: PaginationParams): Promise<PaginatedResponse<University>> {
        const response = await api.get<PaginatedResponse<University>>(UNIVERSITIES_ENDPOINT, {
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
     * Get a single university by ID
     */
    async getUniversityById(id: string): Promise<University> {
        const response = await api.get<University>(`${UNIVERSITIES_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new university
     */
    async createUniversity(data: CreateUniversityDto): Promise<University> {
        const response = await api.post<University>(UNIVERSITIES_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing university
     */
    async updateUniversity(id: string, data: UpdateUniversityDto): Promise<University> {
        const response = await api.put<University>(`${UNIVERSITIES_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a university
     */
    async deleteUniversity(id: string): Promise<void> {
        await api.delete(`${UNIVERSITIES_ENDPOINT}/${id}`);
    },

    /**
     * Get courses by university
     */
    async getUniversityCourses(universityId: string): Promise<Course[]> {
        const response = await api.get<Course[]>(`${UNIVERSITIES_ENDPOINT}/${universityId}/courses`);
        return response.data;
    },

    /**
     * Create a course for a university
     */
    async createCourse(universityId: string, data: CreateCourseDto): Promise<Course> {
        const response = await api.post<Course>(`${UNIVERSITIES_ENDPOINT}/${universityId}/courses`, data);
        return response.data;
    },

    /**
     * Update a course
     */
    async updateCourse(universityId: string, courseId: string, data: UpdateCourseDto): Promise<Course> {
        const response = await api.put<Course>(`${UNIVERSITIES_ENDPOINT}/${universityId}/courses/${courseId}`, data);
        return response.data;
    },

    /**
     * Delete a course
     */
    async deleteCourse(universityId: string, courseId: string): Promise<void> {
        await api.delete(`${UNIVERSITIES_ENDPOINT}/${universityId}/courses/${courseId}`);
    },
};

export default universityService;
