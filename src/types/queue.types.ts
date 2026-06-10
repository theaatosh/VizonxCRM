import type { StaffType, StaffStatus } from './staff.types';

export type QueueItemStatus = 'Waiting' | 'Assigned' | 'InProgress' | 'Completed' | 'Skipped' | 'Reassigned';
export type QueueType = 'NewLead' | 'RevisitLead' | 'ManualAssignment';
export type QueuePriority = 'High' | 'Medium' | 'Low';

export interface Queue {
    id: string;
    tenantId: string;
    type: QueueType;
    name: string;
    description: string | null;
    isActive: boolean;
    autoAssign: boolean;
    createdAt: string;
    updatedAt: string;
    counts?: {
        waiting: number;
        assigned: number;
        inProgress: number;
        completed: number;
    };
}

export interface QueueItem {
    id: string;
    tenantId: string;
    queueId: string;
    leadId: string;
    assignedTo: string | null;
    status: QueueItemStatus;
    priority: QueuePriority;
    enteredAt: string;
    assignedAt: string | null;
    completedAt: string | null;
    notes: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    queue?: Queue;
    lead?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        status: string;
        priority?: string;
    };
    assignedStaff?: {
        id: string;
        staffType: StaffType;
        status: StaffStatus;
        user?: {
            id: string;
            name: string;
            email: string;
        };
    };
}

export interface QueueAnalytics {
    totalItems: number;
    waiting: number;
    assigned: number;
    inProgress: number;
    completed: number;
    skipped: number;
    queues: {
        queueId: string;
        queueName: string;
        queueType: QueueType;
        totalItems: number;
        waiting: number;
        assigned: number;
        inProgress: number;
        completed: number;
        skipped: number;
        avgWaitTimeHours: number;
        avgProcessingTimeHours: number;
    }[];
    recentAssignments: AssignmentHistoryItem[];
}

export interface QueueQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    status?: string;
    assignedTo?: string;
    leadId?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AssignmentHistoryItem {
    id: string;
    tenantId: string;
    leadId: string;
    fromStaffId: string | null;
    toStaffId: string;
    reason: AssignmentReason;
    previousReason: string | null;
    reassignmentNote: string | null;
    assignedBy: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    lead?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    fromStaff?: {
        id: string;
        staffType: StaffType;
        status: StaffStatus;
        user?: { id: string; name: string; email: string };
    };
    toStaff?: {
        id: string;
        staffType: StaffType;
        status: StaffStatus;
        user?: { id: string; name: string; email: string };
    };
}

export type AssignmentReason = 'InitialAssignment' | 'AutomaticAssignment' | 'ManualAssignment' | 'Reassignment' | 'RevisitAssignment';

