import api from './api';
import {
    Appointment,
    AppointmentsResponse,
    CreateAppointmentDto,
    UpdateAppointmentDto,
    AppointmentQueryParams
} from '@/types/appointment.types';

export const appointmentService = {
    getAll: async (params?: AppointmentQueryParams) => {
        const response = await api.get<AppointmentsResponse>('/appointments', { params });
        return response.data;
    },

    getByStaffId: async (staffId: string, params?: AppointmentQueryParams) => {
        const response = await api.get<AppointmentsResponse>(`/appointments/staff/${staffId}`, { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Appointment>(`/appointments/${id}`);
        return response.data;
    },

    create: async (data: CreateAppointmentDto) => {
        // The new endpoint /appointments/create expects a simplified payload
        // and creates a 'Booked' appointment directly.
        const response = await api.post<Appointment>('/appointments/create', data);
        return response.data;
    },

    update: async (id: string, data: UpdateAppointmentDto) => {
        // Prepare payload, handling relations only if ids are provided
        const payload: any = {
            scheduledAt: data.scheduledAt,
            duration: data.duration,
            status: data.status,
            notes: data.notes,
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
