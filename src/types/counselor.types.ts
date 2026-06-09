import type { StaffProfile, StaffWorkload } from './staff.types';

export interface CounselorDashboard {
    profile: StaffProfile;
    workload: StaffWorkload;
    assignedLeads: CounselorLead[];
    tasks: CounselorTask[];
    followUps: CounselorFollowUp[];
    upcomingAppointments: CounselorAppointment[];
    recentActivities: CounselorActivity[];
}

export interface CounselorLead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    priority: string;
    assignedAt: string;
    isRevisit: boolean;
}

export interface CounselorTask {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    status: string;
    priority: string;
}

export interface CounselorFollowUp {
    id: string;
    leadId: string;
    leadName: string;
    type: string;
    dueDate: string;
    status: string;
}

export interface CounselorAppointment {
    id: string;
    title: string;
    leadName: string;
    leadId: string;
    scheduledAt: string;
    status: string;
    duration: number;
}

export interface CounselorActivity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    leadName?: string;
}

export interface CounselorStatusUpdate {
    status: 'Available' | 'Busy' | 'OnLeave' | 'Offline';
}

export interface CounselorMonitoringItem {
    staffId: string;
    userId: string;
    name: string;
    email: string;
    staffType: string;
    status: string;
    activeLeads: number;
    queueLoad: number;
    pendingTasks: number;
    followUps: number;
    workloadPercentage: number;
    lastActivity?: string;
}
