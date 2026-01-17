import api from './api';
import type {
    DashboardOverview,
    DateRangeParams,
    DateRangeStats,
} from '@/types/dashboard.types';

const DASHBOARD_ENDPOINT = '/dashboard';

/**
 * Dashboard Service - Handles all dashboard-related API operations
 */
export const dashboardService = {
    /**
     * Get comprehensive dashboard overview
     * Returns aggregated statistics for leads, students, visas, tasks, appointments, and more
     */
    async getDashboardOverview(): Promise<DashboardOverview> {
        const response = await api.get<DashboardOverview>(`${DASHBOARD_ENDPOINT}/overview`);
        return response.data;
    },

    /**
     * Get statistics for a specific date range
     * @param params - Start and end dates for the statistics query
     */
    async getStatsByDateRange(params: DateRangeParams): Promise<DateRangeStats> {
        const response = await api.get<DateRangeStats>(`${DASHBOARD_ENDPOINT}/stats/date-range`, {
            params: {
                startDate: params.startDate,
                endDate: params.endDate,
            },
        });
        return response.data;
    },
};

export default dashboardService;
