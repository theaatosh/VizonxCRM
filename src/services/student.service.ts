import api from './api';
import type {
    Student,
    CreateStudentDto,
    UpdateStudentDto,
    StudentDocument,
    UploadDocumentDto,
    PaginationParams,
    PaginatedResponse,
} from '@/types/student.types';

const STUDENTS_ENDPOINT = '/students';

/**
 * Student (Applicant) Service - Handles all student-related API operations
 */
export const studentService = {
    /**
     * Get all students with pagination, sorting, and search
     */
    async getStudents(params?: PaginationParams): Promise<PaginatedResponse<Student>> {
        const response = await api.get<PaginatedResponse<Student>>(STUDENTS_ENDPOINT, {
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
     * Get a single student by ID
     */
    async getStudentById(id: string): Promise<Student> {
        const response = await api.get<Student>(`${STUDENTS_ENDPOINT}/${id}`);
        return response.data;
    },

    /**
     * Create a new student
     */
    async createStudent(data: CreateStudentDto): Promise<Student> {
        const response = await api.post<Student>(STUDENTS_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing student
     */
    async updateStudent(id: string, data: UpdateStudentDto): Promise<Student> {
        const response = await api.put<Student>(`${STUDENTS_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a student
     */
    async deleteStudent(id: string): Promise<void> {
        await api.delete(`${STUDENTS_ENDPOINT}/${id}`);
    },

    /**
     * Get student documents
     */
    async getStudentDocuments(studentId: string): Promise<StudentDocument[]> {
        const response = await api.get<StudentDocument[]>(`${STUDENTS_ENDPOINT}/${studentId}/documents`);
        return response.data;
    },

    /**
     * Upload a document for a student
     */
    async uploadDocument(studentId: string, data: UploadDocumentDto): Promise<StudentDocument> {
        const response = await api.post<StudentDocument>(`${STUDENTS_ENDPOINT}/${studentId}/documents`, data);
        return response.data;
    },
};

export default studentService;
