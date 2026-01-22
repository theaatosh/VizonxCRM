// Service Types - Based on backend API schema

// Re-export common pagination types
export type { PaginationParams, PaginatedResponse } from './student.types';

// Service entity from backend
export interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    tenantId?: string;
    createdAt: string;
    updatedAt: string;
}

// DTO for creating a service
export interface CreateServiceDto {
    name: string;
    description?: string;
    price: number;
}

// DTO for updating a service
export interface UpdateServiceDto {
    name?: string;
    description?: string;
    price?: number;
}

// DTO for assigning a single student to a service
export interface AssignStudentToServiceDto {
    studentId: string;
    notes?: string;
}

// DTO for assigning multiple students to a service
export interface AssignMultipleStudentsDto {
    studentIds: string[];
    notes?: string;
}

// Student assignment record
export interface ServiceStudent {
    id: string;
    serviceId: string;
    studentId: string;
    notes?: string;
    assignedAt: string;
    student?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}
