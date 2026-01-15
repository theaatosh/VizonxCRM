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
    createdAt: string;
    updatedAt: string;
    _count?: {
        courses: number;
    };
}

// Course entity from backend - matches actual API response
export interface Course {
    id: string;
    universityId: string;
    name: string;
    fees: number | string;  // Decimal from backend
    duration?: string;
    requirements?: string;
    intakePeriods?: string;
    deadlines?: string;
    createdAt: string;
    updatedAt: string;
}

// DTO for creating a university
export interface CreateUniversityDto {
    name: string;
    countryId: string;
    description?: string;
}

// DTO for updating a university
export interface UpdateUniversityDto {
    name?: string;
    countryId?: string;
    description?: string;
}

// DTO for creating a course - matches actual API requirements
export interface CreateCourseDto {
    name: string;
    fees: number;  // Required field
    duration?: string;
    requirements?: string;
    intakePeriods?: string;
    deadlines?: string;
}

// DTO for updating a course
export interface UpdateCourseDto {
    name?: string;
    fees?: number;
    duration?: string;
    requirements?: string;
    intakePeriods?: string;
    deadlines?: string;
}

// Re-export for convenience
export type { PaginationParams, PaginatedResponse };
