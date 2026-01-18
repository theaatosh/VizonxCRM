import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import faqService from '@/services/faq.service';
import {
    Faq,
    CreateFaqDto,
    UpdateFaqDto,
    FaqQueryParams,
    FaqsResponse,
    GroupedFaqsResponse,
} from '@/types/faq.types';
import { toast } from 'sonner';

/**
 * Query key factory for FAQ-related queries
 */
const faqKeys = {
    all: ['faqs'] as const,
    lists: () => [...faqKeys.all, 'list'] as const,
    list: (params?: FaqQueryParams) => [...faqKeys.lists(), params] as const,
    grouped: () => [...faqKeys.all, 'grouped'] as const,
    details: () => [...faqKeys.all, 'detail'] as const,
    detail: (id: string) => [...faqKeys.details(), id] as const,
};

/**
 * Hook to fetch FAQs with pagination and filtering
 */
export function useFaqs(params?: FaqQueryParams) {
    return useQuery<FaqsResponse>({
        queryKey: faqKeys.list(params),
        queryFn: () => faqService.getFaqs(params),
    });
}

/**
 * Hook to fetch FAQs grouped by category
 */
export function useGroupedFaqs() {
    return useQuery<GroupedFaqsResponse>({
        queryKey: faqKeys.grouped(),
        queryFn: () => faqService.getGroupedFaqs(),
    });
}

/**
 * Hook to fetch a single FAQ by ID
 */
export function useFaqById(id: string) {
    return useQuery<Faq>({
        queryKey: faqKeys.detail(id),
        queryFn: () => faqService.getFaqById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new FAQ
 */
export function useCreateFaq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFaqDto) => faqService.createFaq(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: faqKeys.all });
            toast.success('FAQ created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create FAQ');
        },
    });
}

/**
 * Hook to update an existing FAQ
 */
export function useUpdateFaq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateFaqDto }) =>
            faqService.updateFaq(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: faqKeys.all });
            toast.success('FAQ updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update FAQ');
        },
    });
}

/**
 * Hook to delete a FAQ
 */
export function useDeleteFaq() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => faqService.deleteFaq(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: faqKeys.all });
            toast.success('FAQ deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete FAQ');
        },
    });
}
