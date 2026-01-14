import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { countryService } from '@/services/country.service';
import type {
    Country,
    CreateCountryDto,
    UpdateCountryDto,
    PaginationParams,
} from '@/types/country.types';
import { toast } from 'sonner';

// Query keys
export const countryKeys = {
    all: ['countries'] as const,
    lists: () => [...countryKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...countryKeys.lists(), params] as const,
    active: () => [...countryKeys.all, 'active'] as const,
    details: () => [...countryKeys.all, 'detail'] as const,
    detail: (id: string) => [...countryKeys.details(), id] as const,
    universities: (countryId: string, params?: PaginationParams) =>
        [...countryKeys.all, 'universities', countryId, params] as const,
    visaTypes: (countryId: string) =>
        [...countryKeys.all, 'visa-types', countryId] as const,
};

/**
 * Hook to fetch paginated countries
 */
export function useCountries(params?: PaginationParams) {
    return useQuery({
        queryKey: countryKeys.list(params),
        queryFn: () => countryService.getCountries(params),
    });
}

/**
 * Hook to fetch active countries
 */
export function useActiveCountries() {
    return useQuery({
        queryKey: countryKeys.active(),
        queryFn: () => countryService.getActiveCountries(),
    });
}

/**
 * Hook to fetch a single country by ID
 */
export function useCountry(id: string) {
    return useQuery({
        queryKey: countryKeys.detail(id),
        queryFn: () => countryService.getCountryById(id),
        enabled: !!id,
    });
}

/**
 * Hook to fetch universities by country
 */
export function useCountryUniversities(countryId: string, params?: PaginationParams) {
    return useQuery({
        queryKey: countryKeys.universities(countryId, params),
        queryFn: () => countryService.getCountryUniversities(countryId, params),
        enabled: !!countryId,
    });
}

/**
 * Hook to fetch visa types by country
 */
export function useCountryVisaTypes(countryId: string) {
    return useQuery({
        queryKey: countryKeys.visaTypes(countryId),
        queryFn: () => countryService.getCountryVisaTypes(countryId),
        enabled: !!countryId,
    });
}

/**
 * Hook to create a new country
 */
export function useCreateCountry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCountryDto) => countryService.createCountry(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: countryKeys.active() });
            toast.success('Country created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create country: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing country
 */
export function useUpdateCountry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCountryDto }) =>
            countryService.updateCountry(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: countryKeys.active() });
            queryClient.invalidateQueries({ queryKey: countryKeys.detail(variables.id) });
            toast.success('Country updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update country: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a country
 */
export function useDeleteCountry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => countryService.deleteCountry(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: countryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: countryKeys.active() });
            toast.success('Country deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete country: ${error.message}`);
        },
    });
}
