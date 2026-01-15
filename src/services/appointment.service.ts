import api from './api';
import {
    Appointment,
    AppointmentsResponse,
    CreateAppointmentDto,
    UpdateAppointmentDto
} from '@/types/appointment.types';
import { PaginationParams } from '@/types/country.types';

export const appointmentService = {
    getAll: async (params?: PaginationParams) => {
        const response = await api.get<AppointmentsResponse>('/appointments', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Appointment>(`/appointments/${id}`);
        return response.data;
    },

    create: async (data: CreateAppointmentDto) => {
        // The API expects 'connect' objects for relations
        const payload = {
            scheduledAt: data.scheduledAt,
            status: data.status,
            outcomeNotes: data.outcomeNotes,
            student: {
                connect: { id: data.studentId }
            },
            staff: {
                connect: { id: data.staffId }
            }
        };
        const response = await api.post<Appointment>('/appointments', payload);
        return response.data;
    },

    update: async (id: string, data: UpdateAppointmentDto) => {
        // Prepare payload, handling relations only if ids are provided
        const payload: any = {
            scheduledAt: data.scheduledAt,
            status: data.status,
            outcomeNotes: data.outcomeNotes,
        };

        if (data.studentId) {
            payload.student = { connect: { id: data.studentId } };
        }
        if (data.staffId) {
            payload.staff = { connect: { id: data.staffId } };
        }

        const response = await api.put<Appointment>(`/appointments/${id}`, payload);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/appointments/${id}`);
    }
};
