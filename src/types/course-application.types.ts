import type { PaginatedResponse } from './student.types';

export type ApplicationStatus = 
    | 'Draft' 
    | 'Submitted' 
    | 'UnderReview' 
    | 'Shortlisted' 
    | 'OfferReceived' 
    | 'Accepted' 
    | 'Rejected' 
    | 'Withdrawn';

export interface CourseApplication {
    id: string;
    studentId: string;
    courseId: string;
    universityId?: string;
    status: ApplicationStatus;
    applicationDate?: string | null;
    submissionDate?: string | null;
    offerReceivedDate?: string | null;
    offerExpiryDate?: string | null;
    decisionDate?: string | null;
    intakePeriod?: string;
    applicationFee?: string | null;
    rejectionReason?: string | null;
    notes?: {
        text?: string;
        counselorNote?: string;
    };
    createdAt: string;
    updatedAt: string;
    student?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    course?: {
        id: string;
        name: string;
        duration?: string;
        fees?: string;
    };
    university?: {
        id: string;
        name: string;
        country?: {
            name: string;
            code: string;
        };
    };
}

export interface CourseApplicationFilters {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    courseId?: string;
    studentId?: string;
}

export type { PaginatedResponse };
