/**
 * Landing Page Types - Based on Swagger API Documentation
 * Endpoint: /api/v1/landing-pages
 */

export interface LandingPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    heroImage: string;
    metaTitle: string;
    metaDescription: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLandingPageDto {
    title: string;
    slug: string;
    content: string;
    heroImage: string;
    metaTitle: string;
    metaDescription: string;
}

export interface UpdateLandingPageDto {
    title?: string;
    slug?: string;
    content?: string;
    heroImage?: string;
    metaTitle?: string;
    metaDescription?: string;
}

export interface LandingPageQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

export interface LandingPagesResponse {
    data: LandingPage[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
