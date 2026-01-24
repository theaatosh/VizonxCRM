import { PaginationParams, PaginatedResponse } from './country.types';

export enum TaskStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    IN_PROGRESS = 'inProgress' // Adding In Progress as a common status, though API returned Pending/Completed
}

export enum TaskPriority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low'
}

export enum RelatedEntityType {
    STUDENT = 'Student',
    LEAD = 'Lead'
    // Add others if discovered
}

export interface Task {
    id: string;
    tenantId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignedTo: string; // User ID
    relatedEntityType: RelatedEntityType;
    relatedEntityId: string;
    createdAt: string;
    updatedAt: string;

    // Relations
    assignedUser: {
        id: string;
        name: string;
        email: string;
    };
    // The API might not return the related entity details directly in the task object
    // depending on the 'include' params, but usually we just handle the ID.
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedTo: string;
    relatedEntityType: RelatedEntityType;
    relatedEntityId: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedTo?: string;
    relatedEntityType?: RelatedEntityType;
    relatedEntityId?: string;
}

export type TasksResponse = PaginatedResponse<Task>;

export interface TaskStats {
    totalPending: number;
    totalHighPriority: number;
    totalDueToday: number;
    totalCompleted: number;
}
