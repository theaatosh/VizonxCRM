import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApplicationService } from '@/services/course-application.service';
import type { 
    CourseApplicationFilters,
    ApplicationStatus
} from '@/types/course-application.types';
import { toast } from 'sonner';

export const useCourseApplications = (filters?: CourseApplicationFilters) => {
    return useQuery({
        queryKey: ['course-applications', filters],
        queryFn: () => courseApplicationService.getApplications(filters),
    });
};

export const useStudentCourseApplications = (studentId: string, filters?: Omit<CourseApplicationFilters, 'studentId'>) => {
    return useQuery({
        queryKey: ['course-applications', 'student', studentId, filters],
        queryFn: () => courseApplicationService.getApplicationsByStudent(studentId, filters),
        enabled: !!studentId,
    });
};

export const useCourseApplicationDetail = (id: string) => {
    return useQuery({
        queryKey: ['course-application', id],
        queryFn: () => courseApplicationService.getApplicationById(id),
        enabled: !!id,
    });
};

export const useDeleteCourseApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => courseApplicationService.deleteApplication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-applications'] });
            toast.success('Application deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete application');
        },
    });
};

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, rejectionReason }: { id: string; status: ApplicationStatus; rejectionReason?: string }) => 
            courseApplicationService.updateApplicationStatus(id, status, rejectionReason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-applications'] });
            queryClient.invalidateQueries({ queryKey: ['course-application'] });
            toast.success('Application status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update application status');
        },
    });
};
