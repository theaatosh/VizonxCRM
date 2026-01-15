import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import visaTypeService from '@/services/visaType.service';
import {
    CreateVisaTypeDto,
    UpdateVisaTypeDto,
    VisaTypeQueryParams,
} from '@/types/visaType.types';
import { toast } from 'sonner';

// Query keys
export const visaTypeKeys = {
    all: ['visaTypes'] as const,
    lists: () => [...visaTypeKeys.all, 'list'] as const,
    list: (params?: VisaTypeQueryParams) => [...visaTypeKeys.lists(), params] as const,
    details: () => [...visaTypeKeys.all, 'detail'] as const,
    detail: (id: string) => [...visaTypeKeys.details(), id] as const,
    byCountry: (countryId: string) => [...visaTypeKeys.all, 'country', countryId] as const,
};

// ==================== Query Hooks ====================

/**
 * Fetch all visa types with pagination
 */
export const useVisaTypes = (params?: VisaTypeQueryParams) => {
    return useQuery({
        queryKey: visaTypeKeys.list(params),
        queryFn: () => visaTypeService.getVisaTypes(params),
    });
};

/**
 * Fetch a single visa type by ID
 */
export const useVisaType = (id: string) => {
    return useQuery({
        queryKey: visaTypeKeys.detail(id),
        queryFn: () => visaTypeService.getVisaTypeById(id),
        enabled: !!id,
    });
};

/**
 * Fetch visa types by country
 */
export const useVisaTypesByCountry = (countryId: string) => {
    return useQuery({
        queryKey: visaTypeKeys.byCountry(countryId),
        queryFn: () => visaTypeService.getVisaTypesByCountry(countryId),
        enabled: !!countryId,
    });
};

// ==================== Mutation Hooks ====================

/**
 * Create a new visa type
 */
export const useCreateVisaType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVisaTypeDto) => visaTypeService.createVisaType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaTypeKeys.lists() });
            toast.success('Visa type created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create visa type');
        },
    });
};

/**
 * Update an existing visa type
 */
export const useUpdateVisaType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVisaTypeDto }) =>
            visaTypeService.updateVisaType(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: visaTypeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: visaTypeKeys.detail(variables.id) });
            toast.success('Visa type updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update visa type');
        },
    });
};

/**
 * Delete a visa type
 */
export const useDeleteVisaType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => visaTypeService.deleteVisaType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaTypeKeys.lists() });
            toast.success('Visa type deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete visa type');
        },
    });
};
