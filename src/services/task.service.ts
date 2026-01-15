import api from './api';
import {
    Task,
    TasksResponse,
    CreateTaskDto,
    UpdateTaskDto,
    TaskStats
} from '@/types/task.types';
import { PaginationParams } from '@/types/country.types';

export const taskService = {
    getAll: async (params?: PaginationParams) => {
        const response = await api.get<TasksResponse>('/tasks', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    create: async (data: CreateTaskDto) => {
        // Prepare payload with relations
        const payload = {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            dueDate: data.dueDate,
            relatedEntityType: data.relatedEntityType,
            relatedEntityId: data.relatedEntityId,
            assignedUser: {
                connect: { id: data.assignedTo }
            }
        };
        const response = await api.post<Task>('/tasks', payload);
        return response.data;
    },

    update: async (id: string, data: UpdateTaskDto) => {
        const payload: any = {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            dueDate: data.dueDate,
            relatedEntityType: data.relatedEntityType,
            relatedEntityId: data.relatedEntityId,
        };

        if (data.assignedTo) {
            payload.assignedUser = { connect: { id: data.assignedTo } };
        }

        const response = await api.put<Task>(`/tasks/${id}`, payload);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/tasks/${id}`);
    },

    // Mock stats for now as API might not support it directly yet
    // In a real scenario we might calculate this from the list or have a dedicated endpoint
    getStats: async (): Promise<TaskStats> => {
        // Fetch all tasks to calculate stats
        // Note: In production this should be a backend endpoint
        const response = await api.get<TasksResponse>('/tasks?limit=100');
        const tasks = response.data.data;

        const today = new Date().toISOString().split('T')[0];

        return {
            totalPending: tasks.filter(t => t.status !== 'Completed').length,
            totalHighPriority: tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length,
            totalDueToday: tasks.filter(t => t.dueDate?.startsWith(today) && t.status !== 'Completed').length,
            totalCompleted: tasks.filter(t => t.status === 'Completed').length
        };
    }
};
