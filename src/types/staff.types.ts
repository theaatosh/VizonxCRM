export type StaffType = 'Counselor' | 'AdmissionOfficer' | 'VisaOfficer' | 'DocumentationOfficer' | 'FinanceOfficer' | 'Other';
export type StaffStatus = 'Available' | 'Busy' | 'OnLeave' | 'Offline';

export interface StaffProfile {
    id: string;
    tenantId: string;
    userId: string;
    staffType: StaffType;
    status: StaffStatus;
    maxWorkload: number;
    department: string | null;
    joinedAt: string | null;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
    };
}

export interface StaffWorkload {
    staffId: string;
    userId: string;
    name: string;
    email: string;
    staffType: StaffType;
    status: StaffStatus;
    activeLeads: number;
    openTasks: number;
    pendingFollowUps: number;
    todayCalls: number;
    todayMeetings: number;
    queueLoad: number;
    currentWorkload: number;
    maxWorkload: number;
    workloadPercentage: number;
}

export interface CreateStaffDto {
    userId: string;
    staffType: StaffType;
    status?: StaffStatus;
    maxWorkload?: number;
    department?: string;
    joinedAt?: string;
}

export interface UpdateStaffDto {
    staffType?: StaffType;
    status?: StaffStatus;
    maxWorkload?: number;
    department?: string;
    joinedAt?: string;
}

export interface StaffStats {
    totalStaff: number;
    byType: { type: StaffType; count: number }[];
    byStatus: { status: StaffStatus; count: number }[];
    avgWorkload: number;
    overloaded: number;
    available: number;
}

export interface StaffQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    staffType?: string;
    status?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
