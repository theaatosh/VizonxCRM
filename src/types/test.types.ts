import type { PaginationParams } from './service.types';

export interface Test {
    id: string;
    name: string;
    type: string;
    description: string;
    studentCapacity: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTestDto {
    name: string;
    type: string;
    description: string;
    studentCapacity: number;
}

export interface UpdateTestDto {
    name?: string;
    type?: string;
    description?: string;
    studentCapacity?: number;
}

export type { PaginationParams };
