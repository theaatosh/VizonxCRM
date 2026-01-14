import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { universityService } from '@/services/university.service';
import type {
    University,
    CreateUniversityDto,
    UpdateUniversityDto,
    CreateCourseDto,
    UpdateCourseDto,
    PaginationParams,
} from '@/types/university.types';
import { toast } from 'sonner';
import { countryKeys } from './useCountries';

// Query keys
export const universityKeys = {
    all: ['universities'] as const,
    lists: () => [...universityKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...universityKeys.lists(), params] as const,
    details: () => [...universityKeys.all, 'detail'] as const,
    detail: (id: string) => [...universityKeys.details(), id] as const,
    courses: (universityId: string) => [...universityKeys.all, 'courses', universityId] as const,
};

/**
 * Hook to fetch paginated universities
 */
export function useUniversities(params?: PaginationParams) {
    return useQuery({
        queryKey: universityKeys.list(params),
        queryFn: () => universityService.getUniversities(params),
    });
}

/**
 * Hook to fetch a single university by ID
 */
export function useUniversity(id: string) {
    return useQuery({
        queryKey: universityKeys.detail(id),
        queryFn: () => universityService.getUniversityById(id),
        enabled: !!id,
    });
}

/**
 * Hook to fetch courses by university
 */
export function useUniversityCourses(universityId: string) {
    return useQuery({
        queryKey: universityKeys.courses(universityId),
        queryFn: () => universityService.getUniversityCourses(universityId),
        enabled: !!universityId,
    });
}

/**
 * Hook to create a new university
 */
export function useCreateUniversity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUniversityDto) => universityService.createUniversity(data),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
            // Also invalidate country universities list
            if (result.countryId) {
                queryClient.invalidateQueries({
                    queryKey: countryKeys.universities(result.countryId)
                });
            }
            toast.success('University created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create university: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing university
 */
export function useUpdateUniversity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUniversityDto }) =>
            universityService.updateUniversity(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
            queryClient.invalidateQueries({ queryKey: universityKeys.detail(variables.id) });
            toast.success('University updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update university: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a university
 */
export function useDeleteUniversity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => universityService.deleteUniversity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
            toast.success('University deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete university: ${error.message}`);
        },
    });
}

/**
 * Hook to create a course for a university
 */
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ universityId, data }: { universityId: string; data: CreateCourseDto }) =>
            universityService.createCourse(universityId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: universityKeys.courses(variables.universityId)
            });
            toast.success('Course created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create course: ${error.message}`);
        },
    });
}

/**
 * Hook to update a course
 */
export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ universityId, courseId, data }: { universityId: string; courseId: string; data: UpdateCourseDto }) =>
            universityService.updateCourse(universityId, courseId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: universityKeys.courses(variables.universityId)
            });
            toast.success('Course updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update course: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a course
 */
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ universityId, courseId }: { universityId: string; courseId: string }) =>
            universityService.deleteCourse(universityId, courseId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: universityKeys.courses(variables.universityId)
            });
            toast.success('Course deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete course: ${error.message}`);
        },
    });
}
