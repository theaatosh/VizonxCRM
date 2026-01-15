import { PaginationParams, PaginatedResponse } from './country.types';

export enum AppointmentStatus {
    SCHEDULED = 'Scheduled',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
    PENDING = 'Pending'
}

export interface Appointment {
    id: string;
    tenantId: string;
    studentId: string;
    staffId: string;
    scheduledAt: string;
    status: AppointmentStatus;
    outcomeNotes?: string | null;
    createdAt: string;
    updatedAt: string;

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
        roleId?: string;
    };
}

export interface CreateAppointmentDto {
    scheduledAt: string;
    studentId: string;
    staffId: string;
    status?: AppointmentStatus;
    outcomeNotes?: string;
}

export interface UpdateAppointmentDto {
    scheduledAt?: string;
    studentId?: string; // Though usually we don't change the student, API might allow it
    staffId?: string;
    status?: AppointmentStatus;
    outcomeNotes?: string;
}

export type AppointmentsResponse = PaginatedResponse<Appointment>;
