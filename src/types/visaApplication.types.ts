import type { PaginationParams, PaginatedResponse } from './student.types';

export interface VisaApplication {
    id: string;
    studentId: string;
    visaTypeId: string;
    courseApplicationId: string;
    destinationCountry: string;
    status: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    visaType?: {
        id: string;
        name: string;
    };
}

export interface CreateVisaApplicationDto {
    studentId: string;
    visaTypeId: string;
    courseApplicationId: string;
    destinationCountry: string;
}

export interface UpdateVisaApplicationDto {
    visaTypeId?: string;
    courseApplicationId?: string;
    destinationCountry?: string;
    status?: string;
}

export interface VisaApplicationQueryParams extends PaginationParams {
    studentId?: string;
}
