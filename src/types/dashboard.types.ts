import type { ActivityLog } from './log.types';

/**
 * Status count breakdown
 */
export interface StatusCount {
    status: string;
    count: number;
}

/**
 * Recent lead from API
 */
export interface RecentLead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    priority: string;
    createdAt: string;
}

/**
 * Recent student from API
 */
export interface RecentStudent {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
}

/**
 * Recent visa application from API
 */
export interface RecentVisaApplication {
    id: string;
    studentId: string;
    visaTypeId: string;
    destinationCountry: string;
    status: string;
    submissionDate: string;
    createdAt: string;
    student: {
        firstName: string;
        lastName: string;
        email: string;
    };
    visaType: {
        name: string;
    };
}

/**
 * Recent payment from API
 */
export interface RecentPayment {
    id: string;
    studentId: string;
    serviceId: string;
    totalAmount: string;
    paidAmount: string;
    remainingAmount: string;
    status: string;
    invoiceNumber: string;
    paymentDate: string;
    createdAt: string;
    student: {
        firstName: string;
        lastName: string;
    };
}

/**
 * Leads statistics
 */
export interface LeadsData {
    total: number;
    byStatus: StatusCount[];
    converted: number;
    recent: RecentLead[];
}

/**
 * Students statistics
 */
export interface StudentsData {
    total: number;
    byStatus: StatusCount[];
    recent: RecentStudent[];
}

/**
 * Visa applications statistics
 */
export interface VisaApplicationsData {
    total: number;
    active: number;
    byStatus: StatusCount[];
    recent: RecentVisaApplication[];
}

/**
 * Upcoming task
 */
export interface UpcomingTask {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
    relatedEntityType?: string;
}

/**
 * Tasks statistics
 */
export interface TasksData {
    total: number;
    overdue: number;
    byStatus: StatusCount[];
    upcoming: UpcomingTask[];
}

/**
 * Appointments statistics
 */
export interface AppointmentsData {
    total: number;
    upcoming: any[];
    byStatus: StatusCount[];
}

/**
 * Country count
 */
export interface CountryCount {
    countryId: string;
    count: number;
}

/**
 * Universities statistics
 */
export interface UniversitiesData {
    total: number;
    byCountry: CountryCount[];
}

/**
 * Courses statistics
 */
export interface CoursesData {
    total: number;
}

/**
 * Countries statistics
 */
export interface CountriesData {
    total: number;
}

/**
 * Visa types statistics
 */
export interface VisaTypesData {
    total: number;
}

/**
 * Payments statistics
 */
export interface PaymentsData {
    total: number;
    byStatus: StatusCount[];
    recent: RecentPayment[];
    revenue: {
        total: number;
        pending: number;
    };
}

/**
 * CMS statistics
 */
export interface CMSData {
    blogs: {
        total: number;
        published: number;
    };
    faqs: {
        total: number;
    };
    landingPages: {
        total: number;
        published: number;
    };
    scholarships: {
        total: number;
        published: number;
    };
}

/**
 * Templates statistics
 */
export interface TemplatesData {
    email: {
        total: number;
        active: number;
    };
    sms: {
        total: number;
        active: number;
    };
}

/**
 * Messaging statistics
 */
export interface MessagingData {
    today: {
        total: number;
        emailsSent: number;
        smsSent: number;
        failed: number;
    };
    byStatus: StatusCount[];
}

/**
 * Comprehensive dashboard overview response from API
 */
export interface DashboardOverview {
    leads: LeadsData;
    students: StudentsData;
    visaApplications: VisaApplicationsData;
    tasks: TasksData;
    appointments: AppointmentsData;
    universities: UniversitiesData;
    courses: CoursesData;
    countries: CountriesData;
    visaTypes: VisaTypesData;
    payments: PaymentsData;
    cms: CMSData;
    templates: TemplatesData;
    messaging: MessagingData;
    recentActivities: ActivityLog[];
}

/**
 * Date range parameters for statistics query
 */
export interface DateRangeParams {
    startDate: string; // Format: YYYY-MM-DD
    endDate: string;   // Format: YYYY-MM-DD
}

/**
 * Date range statistics response
 */
export interface DateRangeStats {
    period: {
        startDate: string;
        endDate: string;
    };
    leads: {
        total: number;
        converted: number;
        conversionRate: number;
    };
    students: {
        total: number;
        newEnrollments: number;
    };
    visas: {
        total: number;
        approved: number;
        approvalRate: number;
    };
    tasks: {
        total: number;
        completed: number;
        completionRate: number;
    };
    appointments: {
        total: number;
        completed: number;
    };
}
