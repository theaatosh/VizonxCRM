import { PaginationParams, PaginatedResponse } from './country.types';

export enum AppointmentStatus {
    SCHEDULED = 'Scheduled',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
    PENDING = 'Pending',
    BOOKED = 'Booked',
    NO_SHOW = 'No-Show',
    REJECTED = 'Rejected'
}

export interface Appointment {
    id: string;
    tenantId: string;
    studentId: string;
    staffId: string;
    scheduledAt: string;
    duration: number;
    endTime: string;
    timezone: string;
    status: AppointmentStatus;
    purpose?: string | null;
    note?: string | null;
    notes?: string | null;
    staffNotes?: string | null;
    requestedBy: 'Student' | 'Staff';
    requestedAt: string;
    approvedAt?: string | null;
    approvedBy?: string | null;
    rejectedAt?: string | null;
    rejectedBy?: string | null;
    rejectionReason?: string | null;
    cancelledAt?: string | null;
    cancelledBy?: string | null;
    cancellationReason?: string | null;
    completedAt?: string | null;
    outcomeNotes?: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
    reminder24hSent: boolean;
    reminder1hSent: boolean;

    // Relations
    student: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    };
    staff: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateAppointmentDto {
    scheduledAt: string;
    studentId: string;
    duration: number;
    staffId?: string; // Optional if backend handles assignment from token
    purpose?: string;
    notes?: string;
    staffNotes?: string;
}

export interface UpdateAppointmentDto {
    scheduledAt?: string;
    duration?: number;
    studentId?: string;
    staffId?: string;
    status?: AppointmentStatus;
    notes?: string;
}

export type AppointmentsResponse = PaginatedResponse<Appointment>;

export interface AppointmentQueryParams extends PaginationParams {
    from?: string;
    to?: string;
    date?: string;
    staffId?: string;
    studentId?: string;
}
