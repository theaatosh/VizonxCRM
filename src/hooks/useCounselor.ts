import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staff.service';
import { leadService } from '@/services/lead.service';
import { taskService } from '@/services/task.service';
import { appointmentService } from '@/services/appointment.service';
import authService from '@/services/auth.service';
import { toast } from 'sonner';

export const counselorKeys = {
    all: ['counselor'] as const,
    monitoring: () => [...counselorKeys.all, 'monitoring'] as const,
    profile: (userId: string) => [...counselorKeys.all, 'profile', userId] as const,
    leads: (userId: string) => [...counselorKeys.all, 'leads', userId] as const,
    tasks: (userId: string) => [...counselorKeys.all, 'tasks', userId] as const,
    appointments: (userId: string) => [...counselorKeys.all, 'appointments', userId] as const,
};

export function useCounselorMonitoring() {
    return useQuery({
        queryKey: counselorKeys.monitoring(),
        queryFn: () => staffService.getWorkload(),
        refetchInterval: 30000,
    });
}

/**
 * Composed counselor dashboard — does NOT use the /staff/counselor/dashboard endpoint.
 * Instead composes from individual working APIs.
 */
export function useCounselorDashboard() {
    const currentUser = authService.getUser();
    const userId = currentUser?.id ?? '';

    // 1. Staff profile (needed for status widget and staffId for workload)
    const profileQuery = useQuery({
        queryKey: counselorKeys.profile(userId),
        queryFn: () => staffService.getByUserId(userId),
        enabled: !!userId,
    });
    const staffId = profileQuery.data?.id;

    // 2. Workload (depends on staffId from profile)
    const workloadQuery = useQuery({
        queryKey: ['staff', 'workload', staffId],
        queryFn: () => staffService.getWorkload(staffId),
        enabled: !!staffId,
    });
    const workload = workloadQuery.data?.[0];

    // 3. Assigned leads
    const leadsQuery = useQuery({
        queryKey: counselorKeys.leads(userId),
        queryFn: () => leadService.getAssignedLeads(userId, 20),
        enabled: !!userId,
    });

    // 4. My tasks (uses JWT current user server-side)
    const tasksQuery = useQuery({
        queryKey: counselorKeys.tasks(userId),
        queryFn: () => taskService.getMyTasks({ limit: 20, sortBy: 'dueDate', sortOrder: 'asc' }),
        enabled: !!userId,
    });

    // 5. Upcoming appointments (needs staff profile ID, not user ID)
    const appointmentsQuery = useQuery({
        queryKey: counselorKeys.appointments(staffId),
        queryFn: () => appointmentService.getByStaffId(staffId!, { limit: 10 } as any),
        enabled: !!staffId,
    });

    const isLoading = profileQuery.isLoading;
    const isError = profileQuery.isError;

    return {
        isLoading,
        isError,
        profile: profileQuery.data,
        workload,
        assignedLeads: leadsQuery.data?.data ?? [],
        tasks: tasksQuery.data?.data ?? [],
        upcomingAppointments: appointmentsQuery.data?.data ?? [],
        isLoadingLeads: leadsQuery.isLoading,
        isLoadingTasks: tasksQuery.isLoading,
        isLoadingAppointments: appointmentsQuery.isLoading,
    };
}

export function useUpdateCounselorStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ staffProfileId, status }: { staffProfileId: string; status: 'Available' | 'Busy' | 'OnLeave' | 'Offline' }) =>
            staffService.updateStatus(staffProfileId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: counselorKeys.all });
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            toast.success('Status updated');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update status: ${error.message}`);
        },
    });
}
