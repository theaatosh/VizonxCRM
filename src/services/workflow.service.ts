import api from './api';
import {
    Workflow,
    WorkflowStep,
    CreateWorkflowDto,
    UpdateWorkflowDto,
    CreateStepDto,
    UpdateStepDto,
    WorkflowsResponse,
    WorkflowQueryParams,
    WorkflowVersion,
    CreateVersionDto,
    WorkflowVersionsResponse,
} from '@/types/workflow.types';

/**
 * All backend endpoints wrap responses in a standard envelope:
 *   { success, statusCode, message, code, data: <payload>, ... }
 *
 * List endpoints nest pagination inside that envelope:
 *   { ..., data: { data: T[], total, page, limit, totalPages, hasMore } }
 *
 * Every method here calls `response.data.data` to extract the actual payload.
 */
class WorkflowService {
    private readonly baseUrl = '/workflows';

    // ==================== Workflow Management ====================

    async getWorkflows(params?: WorkflowQueryParams): Promise<WorkflowsResponse> {
        const response = await api.get(this.baseUrl, { params });
        // envelope.data = PaginatedWorkflowResponse<Workflow>
        return response.data.data;
    }

    async getWorkflowById(id: string): Promise<Workflow> {
        const response = await api.get(`${this.baseUrl}/${id}`);
        return response.data.data;
    }

    async getWorkflowsByVisaType(visaTypeId: string): Promise<Workflow[]> {
        const response = await api.get(`${this.baseUrl}/by-visa-type/${visaTypeId}`);
        return response.data.data;
    }

    async createWorkflow(data: CreateWorkflowDto): Promise<Workflow> {
        const response = await api.post(this.baseUrl, data);
        return response.data.data;
    }

    async updateWorkflow(id: string, data: UpdateWorkflowDto): Promise<Workflow> {
        const response = await api.put(`${this.baseUrl}/${id}`, data);
        return response.data.data;
    }

    async deleteWorkflow(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    // ==================== Workflow Steps Management ====================

    async getWorkflowSteps(workflowId: string): Promise<WorkflowStep[]> {
        const response = await api.get(`${this.baseUrl}/${workflowId}/steps`);
        return response.data.data;
    }

    async getStepById(workflowId: string, stepId: string): Promise<WorkflowStep> {
        const response = await api.get(`${this.baseUrl}/${workflowId}/steps/${stepId}`);
        return response.data.data;
    }

    async createStep(workflowId: string, data: CreateStepDto): Promise<WorkflowStep> {
        const response = await api.post(`${this.baseUrl}/${workflowId}/steps`, data);
        return response.data.data;
    }

    async updateStep(workflowId: string, stepId: string, data: UpdateStepDto): Promise<WorkflowStep> {
        const response = await api.put(`${this.baseUrl}/${workflowId}/steps/${stepId}`, data);
        return response.data.data;
    }

    async deleteStep(workflowId: string, stepId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${workflowId}/steps/${stepId}`);
    }

    async reorderSteps(workflowId: string, steps: { id: string; order: number }[]): Promise<WorkflowStep[]> {
        const response = await api.put(`${this.baseUrl}/${workflowId}/steps/reorder`, steps);
        return response.data.data;
    }

    // ==================== Workflow Versioning ====================

    async createVersion(data: CreateVersionDto): Promise<WorkflowVersion> {
        const response = await api.post('/workflow-versions', data);
        return response.data.data;
    }

    async getVersionById(versionId: string): Promise<WorkflowVersion> {
        const response = await api.get(`/workflow-versions/${versionId}`);
        return response.data.data;
    }

    async deleteVersion(versionId: string): Promise<void> {
        await api.delete(`/workflow-versions/${versionId}`);
    }

    async getWorkflowVersions(workflowId: string, params?: WorkflowQueryParams): Promise<WorkflowVersionsResponse> {
        const response = await api.get(`/workflow-versions/workflow/${workflowId}/versions`, { params });
        // envelope.data = PaginatedWorkflowResponse<WorkflowVersion>
        return response.data.data;
    }

    async activateVersion(versionId: string): Promise<void> {
        await api.put(`/workflow-versions/${versionId}/activate`, { versionId });
    }

    async deprecateVersion(data: {
        versionId: string;
        deprecatedReason: string;
        allowMigration: boolean;
    }): Promise<void> {
        await api.put(`/workflow-versions/${data.versionId}/deprecate`, data);
    }
}

export default new WorkflowService();
