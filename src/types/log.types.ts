import type { PaginationParams, PaginatedResponse } from './student.types';
export type { PaginationParams, PaginatedResponse };

export type LogAction =
    | 'Created'
    | 'Updated'
    | 'Deleted'
    | 'StatusChanged'
    | 'Assigned'
    | 'Completed'
    | 'Cancelled'
    | 'Login'
    | 'Logout'
    | 'AccessDenied';

export interface ActivityLog {
    id: string;
    tenantId: string;
    userId: string;
    entityType: string;
    entityId: string;
    action: LogAction;
    changes?: {
        before?: Record<string, any>;
        after?: Record<string, any>;
    };
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
        [key: string]: any;
    };
    timestamp: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role?: string;
    };
}

export interface ActivityStats {
    totalLogs: number;
    actionCounts: Record<LogAction, number>;
    entityTypeCounts: Record<string, number>;
    recentActivityCount: number;
}

export interface LogQueryParams extends PaginationParams {
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    fromDate?: string;
    toDate?: string;
}
