import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import landingPageService from '@/services/landingPage.service';
import {
    LandingPage,
    CreateLandingPageDto,
    UpdateLandingPageDto,
    LandingPageQueryParams,
    LandingPagesResponse,
} from '@/types/landingPage.types';
import { toast } from 'sonner';

/**
 * Query key factory for Landing Page-related queries
 */
const landingPageKeys = {
    all: ['landingPages'] as const,
    lists: () => [...landingPageKeys.all, 'list'] as const,
    list: (params?: LandingPageQueryParams) => [...landingPageKeys.lists(), params] as const,
    details: () => [...landingPageKeys.all, 'detail'] as const,
    detail: (id: string) => [...landingPageKeys.details(), id] as const,
};

/**
 * Hook to fetch landing pages with pagination and filtering
 */
export function useLandingPages(params?: LandingPageQueryParams) {
    return useQuery<LandingPagesResponse>({
        queryKey: landingPageKeys.list(params),
        queryFn: () => landingPageService.getLandingPages(params),
    });
}

/**
 * Hook to fetch a single landing page by ID
 */
export function useLandingPageById(id: string) {
    return useQuery<LandingPage>({
        queryKey: landingPageKeys.detail(id),
        queryFn: () => landingPageService.getLandingPageById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new landing page
 */
export function useCreateLandingPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLandingPageDto) => landingPageService.createLandingPage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.all });
            toast.success('Landing page created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create landing page');
        },
    });
}

/**
 * Hook to update an existing landing page
 */
export function useUpdateLandingPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLandingPageDto }) =>
            landingPageService.updateLandingPage(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.all });
            toast.success('Landing page updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update landing page');
        },
    });
}

/**
 * Hook to delete a landing page
 */
export function useDeleteLandingPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => landingPageService.deleteLandingPage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.all });
            toast.success('Landing page deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete landing page');
        },
    });
}
