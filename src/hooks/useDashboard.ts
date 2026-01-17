import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import type { DateRangeParams } from '@/types/dashboard.types';

// Query keys for caching and invalidation
export const dashboardKeys = {
    all: ['dashboard'] as const,
    overview: () => [...dashboardKeys.all, 'overview'] as const,
    dateRange: (params: DateRangeParams) => [...dashboardKeys.all, 'dateRange', params] as const,
};

/**
 * Hook to fetch comprehensive dashboard overview
 * Includes leads, students, visas, tasks, appointments, and trends
 */
export function useDashboardOverview() {
    return useQuery({
        queryKey: dashboardKeys.overview(),
        queryFn: () => dashboardService.getDashboardOverview(),
        staleTime: 1000 * 60 * 5, // 5 minutes - dashboard data can be slightly stale
        refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
    });
}

/**
 * Hook to fetch statistics for a specific date range
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @param enabled - Whether the query should run
 */
export function useDashboardStatsByDateRange(
    startDate: string,
    endDate: string,
    enabled: boolean = true
) {
    return useQuery({
        queryKey: dashboardKeys.dateRange({ startDate, endDate }),
        queryFn: () => dashboardService.getStatsByDateRange({ startDate, endDate }),
        enabled: enabled && !!startDate && !!endDate,
        staleTime: 1000 * 60 * 10, // 10 minutes for historical data
    });
}
