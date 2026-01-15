// Scholarship entity - matches actual API response
export interface Scholarship {
    id: string;
    tenantId: string;
    title: string;
    slug: string;
    description: string;
    eligibility: string;
    amount: string;
    currency: string;
    deadline: string;
    applicationUrl?: string;
    universityName?: string;
    countryName?: string;
    status: 'Draft' | 'Published';
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

// DTOs for creating scholarships
export interface CreateScholarshipDto {
    title: string;
    slug: string;
    description: string;
    eligibility: string;
    amount: number;
    currency?: string;
    deadline: string;
    applicationUrl?: string;
    universityName?: string;
    countryName?: string;
}

// DTOs for updating scholarships
export interface UpdateScholarshipDto {
    title?: string;
    description?: string;
    eligibility?: string;
    amount?: number;
    currency?: string;
    deadline?: string;
    applicationUrl?: string;
    universityName?: string;
    countryName?: string;
}

// Response types - matches actual API response with meta
export interface ScholarshipsResponse {
    data: Scholarship[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Query parameters
export interface ScholarshipQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
