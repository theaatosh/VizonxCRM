import type { PaginationParams } from './service.types';

export interface Test {
    id: string;
    name: string;
    type: string;
    description: string;
    studentCapacity: number;
    reservationDurationMinutes?: number;
    serviceId: string;
    createdAt: string;
    updatedAt: string;
    service?: {
        id: string;
        name: string;
    };
    assignments?: any[];
    _count?: {
        assignments: number;
        bookingRequests?: number;
    };
}

export interface CreateTestDto {
    name: string;
    type: string;
    description: string;
    studentCapacity: number;
    serviceId: string;
}

export interface UpdateTestDto {
    name?: string;
    type?: string;
    description?: string;
    studentCapacity?: number;
    serviceId?: string;
}

export type { PaginationParams };
