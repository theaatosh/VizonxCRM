// Workflow entity - matches actual API response
export interface Workflow {
    id: string;
    tenantId: string;
    visaTypeId: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    currentVersionId?: string | null;
    currentVersion?: WorkflowVersion | null;
    visaType?: {
        id: string;
        tenantId: string;
        countryId: string;
        name: string;
        description?: string | null;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        country?: {
            id: string;
            tenantId: string;
            name: string;
            code: string;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
        };
    };
    // _count is present on list responses only (steps = from currentVersion, versions = total)
    _count?: {
        steps: number;
        versions?: number;
    };
    steps?: WorkflowStep[];
}

// Workflow Step entity — matches VisaWorkflowVersionStep from backend
export interface WorkflowStep {
    id: string;
    workflowId?: string; // not returned by API; only present on locally-constructed draft steps
    versionId?: string;
    tenantId?: string;
    name: string;
    description?: string | null;
    stepOrder: number;
    requiresDocument: boolean;
    isActive: boolean;
    expectedDurationDays?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export type WorkflowVersionStatus = 'Draft' | 'Active' | 'Deprecated' | 'Archived';

// Workflow Version entity — matches formatVersionResponse in workflow-versioning.service.ts
export interface WorkflowVersion {
    id: string;
    tenantId?: string;
    workflowId: string;
    versionNumber: number;
    status: WorkflowVersionStatus;
    description?: string | null;
    steps?: WorkflowStep[];
    applicationCount?: number;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    deprecatedAt?: string | null;
    deprecatedReason?: string | null;
}

// DTOs for creating workflows
export interface CreateWorkflowDto {
    name: string;
    description?: string;
    visaTypeId: string;
    isActive?: boolean;
}

// DTOs for updating workflows
export interface UpdateWorkflowDto {
    name?: string;
    description?: string | null;
    visaTypeId?: string;
    isActive?: boolean;
}

// DTOs for creating steps — matches CreateWorkflowStepDto
export interface CreateStepDto {
    name: string;
    description?: string;
    stepOrder: number;
    requiresDocument?: boolean;
    isActive?: boolean;
    expectedDurationDays?: number;
}

// DTOs for updating steps — matches UpdateWorkflowStepDto (PartialType of CreateWorkflowStepDto)
export interface UpdateStepDto {
    name?: string;
    description?: string | null;
    stepOrder?: number;
    requiresDocument?: boolean;
    isActive?: boolean;
    expectedDurationDays?: number | null;
}

// DTOs for creating a new version — matches CreateWorkflowVersionDto
export interface CreateVersionDto {
    workflowId: string;
    description?: string;
    steps: Array<{
        name: string;
        description?: string;
        stepOrder: number;
        requiresDocument?: boolean;
        isActive?: boolean;
        expectedDurationDays?: number;
    }>;
}

// Paginated list response — matches PaginatedWorkflowResponse from backend
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

// Response types returned by the service layer (after unwrapping envelope)
export type WorkflowsResponse = PaginatedResponse<Workflow>;
export type WorkflowVersionsResponse = PaginatedResponse<WorkflowVersion>;

// Kept for compatibility; steps are returned directly from the step endpoints
export interface WorkflowStepsResponse {
    steps: WorkflowStep[];
}

// Query parameters
export interface WorkflowQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
}
