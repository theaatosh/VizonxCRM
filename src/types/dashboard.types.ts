// Dashboard Types - Based on actual backend API response

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
    status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
    priority: 'High' | 'Medium' | 'Low';
    createdAt: string;
    source?: string;
    assignedUser?: {
        id: string;
        name: string;
    };
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
    recent: any[];
}

/**
 * Upcoming task
 */
export interface UpcomingTask {
    id: string;
    title: string;
    description?: string;
    status: 'Pending' | 'InProgress' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    assignedTo?: {
        id: string;
        name: string;
    };
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
 * Upcoming appointment
 */
export interface UpcomingAppointment {
    id: string;
    tenantId: string;
    studentId: string;
    staffId: string;
    scheduledAt: string;
    status: string;
    outcomeNotes?: string;
    createdAt: string;
    updatedAt: string;
    student: {
        firstName: string;
        lastName: string;
        email: string;
    };
    staff: {
        name: string;
        email: string;
    };
}

/**
 * Appointments statistics
 */
export interface AppointmentsData {
    total: number;
    upcoming: UpcomingAppointment[];
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
    recent: any[];
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
    recentActivities: any[];
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

/**
 * Chart data point for pie charts
 */
export interface ChartDataPoint {
    name: string;
    value: number;
    color: string;
}
