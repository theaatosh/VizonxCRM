import type { PaginationParams } from './service.types';

export interface Test {
    id: string;
    name: string;
    type: string;
    description: string;
    studentCapacity: number;
    reservationDurationMinutes?: number;
    scheduledDate?: string;
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
    scheduledDate: string;
    reservationDurationMinutes: number;
}

export interface UpdateTestDto {
    name?: string;
    type?: string;
    description?: string;
    studentCapacity?: number;
    serviceId?: string;
    scheduledDate?: string;
    reservationDurationMinutes?: number;
}

export type { PaginationParams };
