import api from './api';
import {
    Workflow,
    WorkflowStep,
    CreateWorkflowDto,
    UpdateWorkflowDto,
    CreateStepDto,
    UpdateStepDto,
    WorkflowsResponse,
    WorkflowStepsResponse,
    WorkflowQueryParams,
} from '@/types/workflow.types';

/**
 * Workflow Service - Production-grade API integration
 */
class WorkflowService {
    private readonly baseUrl = '/workflows';

    // ==================== Workflow Management ====================

    /**
     * Get all workflows with pagination and filtering
     */
    async getWorkflows(params?: WorkflowQueryParams): Promise<WorkflowsResponse> {
        const response = await api.get<WorkflowsResponse>(this.baseUrl, { params });
        return response.data;
    }

    /**
     * Get a single workflow by ID
     */
    async getWorkflowById(id: string): Promise<Workflow> {
        const response = await api.get<Workflow>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    /**
     * Get workflows filtered by visa type
     */
    async getWorkflowsByVisaType(visaTypeId: string): Promise<Workflow[]> {
        const response = await api.get<Workflow[]>(`${this.baseUrl}/by-visa-type/${visaTypeId}`);
        return response.data;
    }

    /**
     * Create a new workflow
     */
    async createWorkflow(data: CreateWorkflowDto): Promise<Workflow> {
        const response = await api.post<Workflow>(this.baseUrl, data);
        return response.data;
    }

    /**
     * Update an existing workflow
     */
    async updateWorkflow(id: string, data: UpdateWorkflowDto): Promise<Workflow> {
        const response = await api.put<Workflow>(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    /**
     * Delete a workflow
     */
    async deleteWorkflow(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    // ==================== Workflow Steps Management ====================

    /**
     * Get all steps for a workflow
     */
    async getWorkflowSteps(workflowId: string): Promise<WorkflowStep[]> {
        const response = await api.get<WorkflowStepsResponse>(`${this.baseUrl}/${workflowId}/steps`);
        return response.data.steps || response.data as any;
    }

    /**
     * Get a single step by ID
     */
    async getStepById(workflowId: string, stepId: string): Promise<WorkflowStep> {
        const response = await api.get<WorkflowStep>(`${this.baseUrl}/${workflowId}/steps/${stepId}`);
        return response.data;
    }

    /**
     * Create a new step for a workflow
     */
    async createStep(workflowId: string, data: CreateStepDto): Promise<WorkflowStep> {
        const response = await api.post<WorkflowStep>(`${this.baseUrl}/${workflowId}/steps`, data);
        return response.data;
    }

    /**
     * Update an existing step
     */
    async updateStep(workflowId: string, stepId: string, data: UpdateStepDto): Promise<WorkflowStep> {
        const response = await api.put<WorkflowStep>(`${this.baseUrl}/${workflowId}/steps/${stepId}`, data);
        return response.data;
    }

    /**
     * Delete a step from a workflow
     */
    async deleteStep(workflowId: string, stepId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${workflowId}/steps/${stepId}`);
    }

    /**
     * Reorder workflow steps
     * @param workflowId - The workflow ID
     * @param stepIds - Array of step IDs in the desired order
     */
    async reorderSteps(workflowId: string, stepIds: string[]): Promise<WorkflowStep[]> {
        const response = await api.put<WorkflowStep[]>(`${this.baseUrl}/${workflowId}/steps/reorder`, stepIds);
        return response.data;
    }
}

export default new WorkflowService();
