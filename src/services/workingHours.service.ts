import api from './api';

export interface WorkingHour {
    id?: string;
    tenantId?: string;
    dayOfWeek: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateWorkingHourDto {
    dayOfWeek: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
}

export interface UpdateWorkingHourDto {
    dayOfWeek?: string;
    isOpen?: boolean;
    openTime?: string;
    closeTime?: string;
    isActive?: boolean;
}

const workingHoursService = {
    getAllWorkingHours: async () => {
        const response = await api.get<WorkingHour[]>('/working-hours');
        return response.data;
    },

    createWorkingHour: async (data: CreateWorkingHourDto) => {
        const response = await api.post<WorkingHour>('/working-hours', data);
        return response.data;
    },

    updateWorkingHour: async (id: string, data: UpdateWorkingHourDto) => {
        const response = await api.put<WorkingHour>(`/working-hours/${id}`, data);
        return response.data;
    },

    deleteWorkingHour: async (id: string) => {
        const response = await api.delete(`/working-hours/${id}`);
        return response.data;
    }
};

export default workingHoursService;
