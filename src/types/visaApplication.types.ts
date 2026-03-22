import type { PaginationParams, PaginatedResponse } from './student.types';

export interface VisaApplication {
    id: string;
    studentId: string;
    visaTypeId: string;
    courseApplicationId: string;
    destinationCountry: string;
    workflowId?: string;
    currentStepId?: string;
    submissionDate?: string | null;
    decisionDate?: string | null;
    status: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    version?: number;
    notes?: Array<{
        status: string;
        stepId: string;
        remarks: string;
        timestamp: string;
        matchedSLA: boolean;
    }>;
    visaType?: {
        id: string;
        name: string;
        description?: string;
        country?: {
            id: string;
            name: string;
        };
    };
    student?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        status?: string;
        priority?: string;
    };
    workflow?: {
        id: string;
        name: string;
        description?: string;
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
    visaTypeId?: string;
    courseApplicationId?: string;
    status?: string;
}
