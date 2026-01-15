import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import workflowService from '@/services/workflow.service';
import {
    CreateWorkflowDto,
    UpdateWorkflowDto,
    CreateStepDto,
    UpdateStepDto,
    WorkflowQueryParams,
} from '@/types/workflow.types';
import { toast } from 'sonner';

// Query keys
export const workflowKeys = {
    all: ['workflows'] as const,
    lists: () => [...workflowKeys.all, 'list'] as const,
    list: (params?: WorkflowQueryParams) => [...workflowKeys.lists(), params] as const,
    details: () => [...workflowKeys.all, 'detail'] as const,
    detail: (id: string) => [...workflowKeys.details(), id] as const,
    steps: (workflowId: string) => [...workflowKeys.detail(workflowId), 'steps'] as const,
    byVisaType: (visaTypeId: string) => [...workflowKeys.all, 'visa-type', visaTypeId] as const,
};

// ==================== Query Hooks ====================

/**
 * Fetch all workflows with pagination
 */
export const useWorkflows = (params?: WorkflowQueryParams) => {
    return useQuery({
        queryKey: workflowKeys.list(params),
        queryFn: () => workflowService.getWorkflows(params),
    });
};

/**
 * Fetch a single workflow by ID
 */
export const useWorkflow = (id: string) => {
    return useQuery({
        queryKey: workflowKeys.detail(id),
        queryFn: () => workflowService.getWorkflowById(id),
        enabled: !!id,
    });
};

/**
 * Fetch workflows by visa type
 */
export const useWorkflowsByVisaType = (visaTypeId: string) => {
    return useQuery({
        queryKey: workflowKeys.byVisaType(visaTypeId),
        queryFn: () => workflowService.getWorkflowsByVisaType(visaTypeId),
        enabled: !!visaTypeId,
    });
};

/**
 * Fetch all steps for a workflow
 */
export const useWorkflowSteps = (workflowId: string) => {
    return useQuery({
        queryKey: workflowKeys.steps(workflowId),
        queryFn: () => workflowService.getWorkflowSteps(workflowId),
        enabled: !!workflowId,
    });
};

// ==================== Mutation Hooks ====================

/**
 * Create a new workflow
 */
export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateWorkflowDto) => workflowService.createWorkflow(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
            toast.success('Workflow created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create workflow');
        },
    });
};

/**
 * Update an existing workflow
 */
export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowDto }) =>
            workflowService.updateWorkflow(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.id) });
            toast.success('Workflow updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update workflow');
        },
    });
};

/**
 * Delete a workflow
 */
export const useDeleteWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => workflowService.deleteWorkflow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
            toast.success('Workflow deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete workflow');
        },
    });
};

/**
 * Create a new step
 */
export const useCreateStep = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workflowId, data }: { workflowId: string; data: CreateStepDto }) =>
            workflowService.createStep(workflowId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.steps(variables.workflowId) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.workflowId) });
            toast.success('Step created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create step');
        },
    });
};

/**
 * Update an existing step
 */
export const useUpdateStep = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workflowId, stepId, data }: { workflowId: string; stepId: string; data: UpdateStepDto }) =>
            workflowService.updateStep(workflowId, stepId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.steps(variables.workflowId) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.workflowId) });
            toast.success('Step updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update step');
        },
    });
};

/**
 * Delete a step
 */
export const useDeleteStep = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workflowId, stepId }: { workflowId: string; stepId: string }) =>
            workflowService.deleteStep(workflowId, stepId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.steps(variables.workflowId) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.workflowId) });
            toast.success('Step deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete step');
        },
    });
};

/**
 * Reorder workflow steps
 */
export const useReorderSteps = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workflowId, stepIds }: { workflowId: string; stepIds: string[] }) =>
            workflowService.reorderSteps(workflowId, stepIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.steps(variables.workflowId) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.workflowId) });
            toast.success('Steps reordered successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to reorder steps');
        },
    });
};
