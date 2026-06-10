import api from './api';
import type {
    StaffProfile,
    StaffWorkload,
    StaffStats,
    StaffQueryParams,
    CreateStaffDto,
    UpdateStaffDto,
    PaginatedResponse,
} from '@/types/staff.types';

const STAFF_ENDPOINT = '/staff';

export const staffService = {
    async getAll(params?: StaffQueryParams): Promise<PaginatedResponse<StaffProfile>> {
        const response = await api.get<PaginatedResponse<StaffProfile>>(`${STAFF_ENDPOINT}/profiles`, { params });
        return response.data;
    },

    async getById(id: string): Promise<StaffProfile> {
        const response = await api.get<StaffProfile>(`${STAFF_ENDPOINT}/profiles/${id}`);
        return response.data;
    },

    async getByUserId(userId: string): Promise<StaffProfile> {
        const response = await api.get<StaffProfile>(`${STAFF_ENDPOINT}/profiles/by-user/${userId}`);
        return response.data;
    },

    async create(data: CreateStaffDto): Promise<StaffProfile> {
        const response = await api.post<StaffProfile>(`${STAFF_ENDPOINT}/profiles`, data);
        return response.data;
    },

    async update(id: string, data: UpdateStaffDto): Promise<StaffProfile> {
        const response = await api.put<StaffProfile>(`${STAFF_ENDPOINT}/profiles/${id}`, data);
        return response.data;
    },

    async updateStatus(id: string, status: StaffProfile['status']): Promise<StaffProfile> {
        const response = await api.patch<StaffProfile>(`${STAFF_ENDPOINT}/profiles/${id}/status`, { status });
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${STAFF_ENDPOINT}/profiles/${id}`);
    },

    async getWorkload(staffId?: string): Promise<StaffWorkload[]> {
        const params = staffId ? { staffId } : {};
        const response = await api.get<StaffWorkload[]>(`${STAFF_ENDPOINT}/workload`, { params });
        return response.data;
    },

    async getAvailable(): Promise<StaffWorkload[]> {
        const response = await api.get<StaffWorkload[]>(`${STAFF_ENDPOINT}/available`);
        return response.data;
    },

    async getStats(): Promise<StaffStats> {
        const response = await api.get<StaffStats>(`${STAFF_ENDPOINT}/stats`);
        return response.data;
    },
};

export default staffService;
