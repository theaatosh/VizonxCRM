// University & Course Types - Based on backend API schema

import type { PaginationParams, PaginatedResponse } from './country.types';

// University entity from backend
export interface University {
    id: string;
    name: string;
    countryId: string;
    country?: {
        id: string;
        name: string;
        code: string;
    };
    description?: string;
    website?: string;
    ranking?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Course entity from backend
export interface Course {
    id: string;
    universityId: string;
    name: string;
    description?: string;
    duration?: string;
    tuitionFee?: number;
    currency?: string;
    level?: string;
    department?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// DTO for creating a university
export interface CreateUniversityDto {
    name: string;
    countryId: string;
    description?: string;
    website?: string;
    ranking?: number;
    isActive?: boolean;
}

// DTO for updating a university
export interface UpdateUniversityDto {
    name?: string;
    countryId?: string;
    description?: string;
    website?: string;
    ranking?: number;
    isActive?: boolean;
}

// DTO for creating a course
export interface CreateCourseDto {
    name: string;
    description?: string;
    duration?: string;
    tuitionFee?: number;
    currency?: string;
    level?: string;
    department?: string;
    isActive?: boolean;
}

// DTO for updating a course
export interface UpdateCourseDto {
    name?: string;
    description?: string;
    duration?: string;
    tuitionFee?: number;
    currency?: string;
    level?: string;
    department?: string;
    isActive?: boolean;
}

// Re-export for convenience
export type { PaginationParams, PaginatedResponse };
