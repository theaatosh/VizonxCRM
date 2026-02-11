// Lead Types - Based on backend API schema

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'NotInterested' | 'NotReachable';
export type LeadPriority = 'High' | 'Medium' | 'Low';

// Lead entity from backend
export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    academicBackground?: string;
    studyInterests?: string;
    status: LeadStatus;
    priority: LeadPriority;
    source?: string;
    assignedUserId?: string;
    assignedUser?: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

// DTO for creating a lead
export interface CreateLeadDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    academicBackground?: string;
    studyInterests?: string;
    priority?: LeadPriority;
    source?: string;
    assignedUserId?: string;
}

// DTO for updating a lead
export interface UpdateLeadDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    academicBackground?: string;
    studyInterests?: string;
    status?: LeadStatus;
    priority?: LeadPriority;
    assignedUserId?: string;
}

// DTO for converting lead to student
export interface ConvertLeadDto {
    academicRecords?: Record<string, unknown>;
    testScores?: Record<string, unknown>;
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
