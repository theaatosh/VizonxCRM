import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/services/student.service';
import { fileService } from '@/services/file.service';
import type {
    Student,
    CreateStudentDto,
    UpdateStudentDto,
    PaginationParams,
} from '@/types/student.types';
import { toast } from 'sonner';

// Query keys
export const studentKeys = {
    all: ['students'] as const,
    lists: () => [...studentKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...studentKeys.lists(), params] as const,
    details: () => [...studentKeys.all, 'detail'] as const,
    detail: (id: string) => [...studentKeys.details(), id] as const,
    documents: (id: string) => [...studentKeys.all, 'documents', id] as const,
};

/**
 * Hook to fetch paginated students
 */
export function useStudents(params?: PaginationParams) {
    return useQuery({
        queryKey: studentKeys.list(params),
        queryFn: () => studentService.getStudents(params),
    });
}

/**
 * Hook to fetch a single student by ID
 */
export function useStudent(id: string) {
    return useQuery({
        queryKey: studentKeys.detail(id),
        queryFn: () => studentService.getStudentById(id),
        enabled: !!id,
    });
}

/**
 * Hook to fetch student documents
 */
export function useStudentDocuments(id: string) {
    return useQuery({
        queryKey: studentKeys.documents(id),
        queryFn: () => studentService.getStudentDocuments(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new student
 */
export function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStudentDto) => studentService.createStudent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
            toast.success('Applicant created successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to create applicant: ${error.message}`);
        },
    });
}

/**
 * Hook to update an existing student
 */
export function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) =>
            studentService.updateStudent(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
            toast.success('Applicant updated successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to update applicant: ${error.message}`);
        },
    });
}

/**
 * Hook to delete a student
 */
export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => studentService.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
            toast.success('Applicant deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete applicant: ${error.message}`);
        },
    });
}

/**
 * Hook to assign a counselor to a student
 */
export function useAssignCounselor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentId, counselorId }: { studentId: string; counselorId: string }) =>
            studentService.assignCounselor(studentId, counselorId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.studentId) });
            toast.success('Counselor assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to assign counselor: ${error.message}`);
        },
    });
}

/**
 * Hook to upload a document (Two-step process)
 */
export function useUploadStudentDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ 
            studentId, 
            file, 
            documentType, 
            category 
        }: { 
            studentId: string; 
            file: File; 
            documentType: string;
            category: string;
        }) => {
            // Step 1: Upload the physical file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', category);
            formData.append('studentId', studentId);

            const uploadResponse = await fileService.uploadFile(formData);

            // Step 2: Attach the document record to the student
            return studentService.uploadDocument(studentId, {
                documentType: documentType as any,
                filePath: uploadResponse.filePath,
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.studentId) });
            queryClient.invalidateQueries({ queryKey: studentKeys.documents(variables.studentId) });
            toast.success('Document uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to upload document: ${error.message}`);
        },
    });
}
