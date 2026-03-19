import api from './api';
import type { Test, CreateTestDto, UpdateTestDto, PaginationParams } from '@/types/test.types';
import type { PaginatedResponse } from '@/types/service.types';

const TESTS_ENDPOINT = '/tests';

/**
 * Test API - Handles all test-related API operations
 */
export const testService = {
    /**
     * Get all tests with pagination
     */
    async getTests(params?: PaginationParams): Promise<PaginatedResponse<Test>> {
        const response = await api.get<PaginatedResponse<Test>>(TESTS_ENDPOINT, {
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
     * Get a single test by ID
     */
    async getTestById(id: string): Promise<Test> {
        const response = await api.get<Test>(`${TESTS_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new test
     */
    async createTest(data: CreateTestDto): Promise<Test> {
        const response = await api.post<Test>(TESTS_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing test
     */
    async updateTest(id: string, data: UpdateTestDto): Promise<Test> {
        const response = await api.put<Test>(`${TESTS_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a test
     */
    async deleteTest(id: string): Promise<void> {
        await api.delete(`${TESTS_ENDPOINT}/${id}`);
    },

    /**
     * Assign a test to a student
     */
    async assignStudent(testId: string, studentId: string): Promise<void> {
        await api.post(`${TESTS_ENDPOINT}/${testId}/assign`, { studentId });
    },
};

export default testService;
