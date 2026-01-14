// Student (Applicant) Types - Based on backend API schema

export type StudentStatus = 'Prospective' | 'Enrolled' | 'Alumni';
export type StudentPriority = 'High' | 'Medium' | 'Low';

// Student entity from backend
export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    leadId?: string;
    academicRecords?: Record<string, unknown>;
    testScores?: Record<string, unknown>;
    status: StudentStatus;
    priority: StudentPriority;
    createdAt: string;
    updatedAt: string;
}

// DTO for creating a student
export interface CreateStudentDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    leadId?: string;
    academicRecords?: Record<string, unknown>;
    testScores?: Record<string, unknown>;
    priority?: StudentPriority;
}

// DTO for updating a student
export interface UpdateStudentDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    academicRecords?: Record<string, unknown>;
    testScores?: Record<string, unknown>;
    status?: StudentStatus;
    priority?: StudentPriority;
}

// DTO for uploading documents
export interface UploadDocumentDto {
    documentType: 'Passport' | 'Transcript' | 'VisaForm' | 'Photo' | 'Certificate' | 'Other';
    filePath: string;
}

// Student document from backend
export interface StudentDocument {
    id: string;
    documentType: string;
    filePath: string;
    uploadedAt: string;
}

// Pagination parameters
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

// Paginated response from backend
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
