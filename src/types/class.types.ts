import type { PaginationParams } from './service.types';

export interface ClassSchedule {
    days: string[];
    time: string;
}

export interface Class {
    id: string;
    level: string;
    schedule: ClassSchedule;
    courseId?: string | null;
    instructorId: string;
    instructorName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateClassDto {
    level: string;
    schedule: ClassSchedule;
    courseId?: string | null;
    instructorId: string;
}

export interface UpdateClassDto {
    level?: string;
    schedule?: Partial<ClassSchedule>;
    courseId?: string | null;
    instructorId?: string;
}

export type { PaginationParams };
