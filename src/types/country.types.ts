// Country Types - Based on backend API schema

// Country entity from backend
export interface Country {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// DTO for creating a country
export interface CreateCountryDto {
    name: string;
    code: string;
    isActive?: boolean;
}

// DTO for updating a country
export interface UpdateCountryDto {
    name?: string;
    code?: string;
    isActive?: boolean;
}

// Pagination parameters
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

// Paginated response from backend
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
