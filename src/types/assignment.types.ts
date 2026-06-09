import type { AssignmentReason, AssignmentHistoryItem } from './queue.types';

export type { AssignmentReason, AssignmentHistoryItem };

export interface CreateAssignmentDto {
    queueId: string;
    leadId: string;
    staffProfileId: string;
    note?: string;
}

export interface ReassignDto {
    toStaffProfileId: string;
    reason: string;
}
