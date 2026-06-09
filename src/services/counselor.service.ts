import api from './api';
import type {
    CounselorDashboard,
    CounselorMonitoringItem,
} from '@/types/counselor.types';
import type { StaffProfile } from '@/types/staff.types';

const COUNSELOR_ENDPOINT = '/staff/counselor';

export const counselorService = {
    async getDashboard(staffId?: string): Promise<CounselorDashboard> {
        const params = staffId ? { staffId } : {};
        const response = await api.get<CounselorDashboard>(`${COUNSELOR_ENDPOINT}/dashboard`, { params });
        return response.data;
    },

    async updateStatus(staffProfileId: string, status: StaffProfile['status']): Promise<void> {
        await api.patch(`/staff/profiles/${staffProfileId}/status`, { status });
    },
};

export default counselorService;
