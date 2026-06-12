import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import visaApplicationService from '@/services/visaApplication.service';
import visaDocumentService from '@/services/visaDocument.service';
import { fileService } from '@/services/file.service';
import type { 
    CreateVisaApplicationDto, 
    UpdateVisaApplicationDto,
    VisaApplication,
    VisaApplicationQueryParams,
    VisaDocument,
    CreateVisaDocumentDto,
    UpdateVisaDocumentDto
} from '@/types/visaApplication.types';
import type { PaginatedResponse } from '@/types/student.types';
import { toast } from 'sonner';

export const visaApplicationKeys = {
    all: ['visa-applications'] as const,
    lists: () => [...visaApplicationKeys.all, 'list'] as const,
    list: (params?: VisaApplicationQueryParams) => [...visaApplicationKeys.lists(), params] as const,
    details: () => [...visaApplicationKeys.all, 'detail'] as const,
    detail: (id: string) => [...visaApplicationKeys.details(), id] as const,
    byStudent: (studentId: string) => [...visaApplicationKeys.all, 'student', studentId] as const,
};

/**
 * Hook to fetch paginated visa applications
 */
export function useVisaApplications(params?: VisaApplicationQueryParams) {
    return useQuery<PaginatedResponse<VisaApplication>>({
        queryKey: visaApplicationKeys.list(params),
        queryFn: () => visaApplicationService.getVisaApplications(params) as Promise<PaginatedResponse<VisaApplication>>,
    });
}

/**
 * Hook to fetch visa application stats
 */
export function useVisaStats() {
    return useQuery({
        queryKey: ['visa-applications', 'stats'],
        queryFn: () => visaApplicationService.getVisaStats(),
    });
}

/**
 * Hook to fetch visa applications for a specific student
 */
export function useStudentVisaApplications(
    studentId: string, 
    params?: Omit<VisaApplicationQueryParams, 'studentId'>,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: visaApplicationKeys.byStudent(studentId),
        queryFn: () => visaApplicationService.getVisaApplications({ ...params, studentId }),
        enabled: (options?.enabled !== false) && !!studentId,
    });
}

/**
 * Hook to fetch a single visa application by ID
 */
export function useVisaApplication(id: string) {
    return useQuery({
        queryKey: visaApplicationKeys.detail(id),
        queryFn: () => visaApplicationService.getVisaApplicationById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new visa application
 */
export function useCreateVisaApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVisaApplicationDto) => visaApplicationService.createVisaApplication(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa application created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to create visa application: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing visa application
 */
export function useUpdateVisaApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVisaApplicationDto }) =>
            visaApplicationService.updateVisaApplication(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.detail(variables.id) });
            toast.success('Visa application updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update visa application: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a visa application
 */
export function useDeleteVisaApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => visaApplicationService.deleteVisaApplication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa application deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to delete visa application: ${error.message}`);
        },
    });
}

/**
 * Hook to advance the step of a visa application
 */
export function useAdvanceVisaStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { notes: string } }) =>
            visaApplicationService.advanceVisaStep(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa application step advanced successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to advance visa step: ${error.message}`);
        },
    });
}

/**
 * Hook to fetch visa documents
 */
export function useVisaDocuments(params?: { visaApplicationId?: string; studentId?: string; workflowId?: string }) {
    return useQuery({
        queryKey: ['visa-documents', params],
        queryFn: () => visaDocumentService.getVisaDocuments(params),
        enabled: !!(params?.visaApplicationId || params?.studentId || params?.workflowId),
    });
}

/**
 * Hook to create a new visa document
 */
export function useCreateVisaDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVisaDocumentDto) => visaDocumentService.createVisaDocument(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa document linked successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to link visa document: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing visa document
 */
export function useUpdateVisaDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVisaDocumentDto }) =>
            visaDocumentService.updateVisaDocument(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa document updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update visa document: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a visa document
 */
export function useDeleteVisaDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => visaDocumentService.deleteVisaDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa document removed successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to remove visa document: ${error.message}`);
        },
    });
}

/**
 * Hook to upload and create a visa document
 */
export function useUploadVisaDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ 
            visaApplicationId, 
            studentId, // Added studentId
            file, 
            documentType, 
            workflowId 
        }: { 
            visaApplicationId: string; 
            studentId: string; // Added studentId
            file: File; 
            documentType: string;
            workflowId?: string;
        }) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'Other'); // Changed from 'Visa' to 'Other'
            formData.append('studentId', studentId); // Added studentId
            formData.append('visaApplicationId', visaApplicationId);

            const uploadResponse = await fileService.uploadFile(formData);

            return visaDocumentService.createVisaDocument({
                visaApplicationId,
                documentType,
                filePath: uploadResponse.filePath,
                workflowId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visaApplicationKeys.all });
            toast.success('Visa document uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to upload visa document: ${error.message}`);
        },
    });
}

