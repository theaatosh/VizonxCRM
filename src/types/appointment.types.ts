import { PaginationParams, PaginatedResponse } from './country.types';

export enum AppointmentStatus {
    SCHEDULED = 'Scheduled',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
    PENDING = 'Pending',
    BOOKED = 'Booked'
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
    notes?: string | null;
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
