import type { PaginationParams } from './service.types';

export interface ClassSchedule {
    day: string;
    startTime: string;
    endTime: string;
}

export interface Class {
    id: string;
    name: string;
    description?: string;
    studentCapacity: number;
    schedule: ClassSchedule[];
    courseId?: string | null;
    instructor?: {
        id: string;
        name: string;
        email: string;
    };
    instructorId: string;
    instructorName?: string;
    createdAt: string;
    updatedAt: string;
    level?: string;
    _count?: {
        enrollments: number;
        bookingRequests: number;
    };
}

export interface CreateClassDto {
    name: string;
    description?: string;
    studentCapacity: number;
    schedule: ClassSchedule[];
    instructorId: string;
}

export interface UpdateClassDto {
    name?: string;
    description?: string;
    studentCapacity?: number;
    schedule?: ClassSchedule[];
    instructorId?: string;
}

export type { PaginationParams };
