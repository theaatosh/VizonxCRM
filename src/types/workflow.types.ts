// Workflow entity - matches actual API response
export interface Workflow {
    id: string;
    tenantId: string;
    visaTypeId: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    visaType?: {
        id: string;
        tenantId: string;
        countryId: string;
        name: string;
        description: string;
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
    _count?: {
        steps: number;
    };
    steps?: WorkflowStep[];
}

// Workflow Step entity
export interface WorkflowStep {
    id: string;
    workflowId: string;
    versionId?: string;
    tenantId?: string;
    name: string;
    description: string;
    stepOrder: number;
    requiresDocument: boolean;
    isActive: boolean;
    expectedDurationDays: number;
    createdAt?: string;
    updatedAt?: string;
}

// Workflow Version entity
export interface WorkflowVersion {
    id: string;
    workflowId: string;
    versionNumber: number;
    status: 'Draft' | 'Active' | 'Deprecated';
    description: string;
    steps: WorkflowStep[];
    applicationCount: number;
    createdBy?: string | null;
    createdAt: string;
    updatedAt: string;
    deprecatedAt?: string | null;
    deprecatedReason?: string | null;
}

// DTOs for creating workflows
export interface CreateWorkflowDto {
    name: string;
    description: string;
    visaTypeId: string;
    isActive: boolean;
}

// DTOs for updating workflows
export interface UpdateWorkflowDto {
    name?: string;
    description?: string;
    visaTypeId?: string;
    isActive?: boolean;
}

// DTOs for creating steps
export interface CreateStepDto {
    name: string;
    description: string;
    stepOrder: number;
    requiresDocument: boolean;
    isActive: boolean;
    expectedDurationDays: number;
}

// DTOs for versioning
export interface CreateVersionDto {
    workflowId: string;
    description: string;
    steps: Partial<WorkflowStep>[];
}

// DTOs for updating steps
export interface UpdateStepDto {
    name?: string;
    description?: string;
    stepOrder?: number;
    requiresDocument?: boolean;
    isActive?: boolean;
    expectedDurationDays?: number;
}

export interface MigrateUserDto {
    oldVersionId: string;
    newVersionId: string;
}

// Response types - matches actual API response
export interface WorkflowsResponse {
    data: Workflow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface WorkflowVersionsResponse {
    data: WorkflowVersion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

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
}

