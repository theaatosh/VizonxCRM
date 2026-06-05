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
        steps?: Array<{
            id: string;
            name: string;
            description?: string;
            stepOrder: number;
        }>;
    };
    workflowProgress?: {
        totalSteps: number;
        currentStepIndex: number;
        percentageComplete: number;
    };
    documents?: Array<{
        id: string;
        documentType: string;
        filePath: string;
        uploadedAt: string;
    }>;
    currentStep?: {
        id: string;
        name: string;
        description?: string;
    } | null;
    nextStep?: {
        id: string;
        name: string;
        description?: string;
    } | null;
}

export interface CreateVisaApplicationDto {
    studentId: string;
    visaTypeId: string;
    courseApplicationId: string;
    destinationCountry: string;
    workflowId?: string;
    workflowVersionId?: string;
}

export interface UpdateVisaApplicationDto {
    visaTypeId?: string;
    courseApplicationId?: string;
    destinationCountry?: string;
    status?: string;
    currentStepId?: string;
    submissionDate?: string | null;
    decisionDate?: string | null;
}

export interface VisaApplicationQueryParams extends PaginationParams {
    studentId?: string;
    visaTypeId?: string;
    courseApplicationId?: string;
    status?: string;
}

export interface VisaDocument {
    id: string;
    visaApplicationId: string;
    studentDocumentId?: string | null;
    documentType: string;
    filePath: string;
    workflowId?: string | null;
    uploadedAt: string;
    studentDocument?: {
        id: string;
        documentType: string;
        filePath: string;
    } | null;
}

export interface CreateVisaDocumentDto {
    visaApplicationId: string;
    studentDocumentId?: string;
    documentType?: string;
    filePath?: string;
    workflowId?: string;
}

export interface UpdateVisaDocumentDto {
    visaApplicationId?: string;
    studentDocumentId?: string;
    documentType?: string;
    filePath?: string;
    workflowId?: string;
}
