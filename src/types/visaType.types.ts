// Visa Type entity
export interface VisaType {
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
    _count?: {
        workflows: number;
        applications: number;
    };
}

// DTOs for creating visa types
export interface CreateVisaTypeDto {
    countryId: string;
    name: string;
    description: string;
    isActive: boolean;
}

// DTOs for updating visa types
export interface UpdateVisaTypeDto {
    countryId?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
}

// Response types - matches actual API response
export interface VisaTypesResponse {
    data: VisaType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Query parameters
export interface VisaTypeQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
