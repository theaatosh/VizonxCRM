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
    versions: () => [...workflowKeys.all, 'versions'] as const,
    version: (id: string) => [...workflowKeys.versions(), id] as const,
    byWorkflow: (workflowId: string) => [...workflowKeys.versions(), 'workflow', workflowId] as const,
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
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
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
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
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
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
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
        mutationFn: ({ workflowId, steps }: { workflowId: string; steps: { id: string; order: number }[] }) =>
            workflowService.reorderSteps(workflowId, steps),
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

/**
 * Create a new workflow version
 */
export const useCreateVersion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: workflowService.createVersion.bind(workflowService),
        onSuccess: (_, variables) => {
            // Invalidate both the version list and the workflow detail so the step
            // editor picks up the newly published version immediately.
            queryClient.invalidateQueries({ queryKey: workflowKeys.byWorkflow(variables.workflowId) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(variables.workflowId) });
            toast.success('New workflow version created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create new version');
        },
    });
};

/**
 * Fetch a single workflow version by ID
 */
export const useWorkflowVersion = (versionId: string) => {
    return useQuery({
        queryKey: workflowKeys.version(versionId),
        queryFn: () => workflowService.getVersionById(versionId),
        enabled: !!versionId,
    });
};

/**
 * Fetch all versions for a workflow
 */
export const useWorkflowVersions = (workflowId: string, params?: WorkflowQueryParams) => {
    return useQuery({
        queryKey: [...workflowKeys.byWorkflow(workflowId), params],
        queryFn: () => workflowService.getWorkflowVersions(workflowId, params),
        enabled: !!workflowId,
    });
};

/**
 * Activate a workflow version
 */
export const useActivateVersion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (versionId: string) => workflowService.activateVersion(versionId),
        onSuccess: () => {
            // Invalidate both version caches AND the workflow list so cards reflect the new currentVersionId
            queryClient.invalidateQueries({ queryKey: workflowKeys.versions() });
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
            toast.success("Version activated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to activate version");
        },
    });
};

/**
 * Activate a workflow (set isActive = true)
 */
export const useActivateWorkflow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => workflowService.activateWorkflow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
            toast.success('Workflow activated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to activate workflow');
        },
    });
};

/**
 * Deactivate a workflow (set isActive = false)
 */
export const useDeactivateWorkflow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => workflowService.deactivateWorkflow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
            toast.success('Workflow deactivated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to deactivate workflow');
        },
    });
};

/**
 * Deprecate a workflow version
 */
export const useDeprecateVersion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { versionId: string; deprecatedReason: string; allowMigration: boolean }) =>
            workflowService.deprecateVersion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.versions() });
            queryClient.invalidateQueries({ queryKey: workflowKeys.all });
            toast.success("Version deprecated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to deprecate version");
        },
    });
};
