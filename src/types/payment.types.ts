export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded' | 'PartiallyPaid' | 'Overdue';
export type PaymentType = 'Full' | 'Advance' | 'Partial' | 'Balance';
export type PaymentMethod = 'Cash' | 'BankTransfer' | 'Card' | 'Cheque' | 'Online' | 'Other';

export interface Payment {
    id: string;
    studentId: string;
    serviceId?: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    currency: string;
    invoiceNumber: string;
    paymentCycle: number;
    transactionReference?: string;
    notes?: string;
    paymentDate: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    student?: {
        id: string;
        firstName: string;
        lastName: string;
        name?: string;
    };
    service?: {
        id: string;
        name: string;
    };
}

export interface CreatePaymentDto {
    studentId: string;
    serviceId?: string;
    totalAmount: number;
    paidAmount: number;
    paymentType?: PaymentType;
    paymentMethod: PaymentMethod;
    currency?: string;
    transactionReference?: string;
    notes?: string;
    paymentDate?: string;
    dueDate?: string;
}

export interface UpdatePaymentDto {
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    paymentType?: PaymentType;
    paidAmount?: number;
    remainingAmount?: number;
    totalAmount?: number;
    invoiceNumber?: string;
    transactionReference?: string;
    notes?: string;
    paymentDate?: string;
    dueDate?: string;
    currency?: string;
}

export interface PaymentSummary {
    totalPaid: number;
    totalPending: number;
    remainingBalance: number;
    history: Payment[];
}

export interface PaymentFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    studentId?: string;
    serviceId?: string;
    status?: PaymentStatus;
    paymentType?: PaymentType;
    paymentMethod?: PaymentMethod;
    dueDateFrom?: string;
    dueDateTo?: string;
    invoiceNumber?: string;
}

export interface PaymentStatisticsFilters {
    fromDate?: string;
    toDate?: string;
    comparisonFromDate?: string;
    comparisonToDate?: string;
    status?: string | PaymentStatus;
    paymentMethod?: string | PaymentMethod;
    studentId?: string;
    serviceId?: string;
}

export interface PaymentMetrics {
    totalRevenue: number;
    revenueChange: number;
    collectionRate: number;
    totalInvoicedAmount: number;
    totalPendingAmount: number;
    totalOverdueAmount: number;
    averagePaymentAmount: number;
    medianPaymentAmount: number;
    largestPaymentAmount: number;
    averageDaysToComplete: number;
    uniqueCustomerCount: number;
    averagePaymentPerCustomer: number;
}

export interface StatusBreakdown {
    status: PaymentStatus;
    count: number;
    totalAmount: number;
    percentage: number;
}

export interface MethodBreakdown {
    paymentMethod: PaymentMethod;
    count: number;
    totalAmount: number;
    percentage: number;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    paymentCount: number;
}

export interface PaymentStatisticsResponse {
    metrics: PaymentMetrics;
    statusBreakdown: StatusBreakdown[];
    methodBreakdown: MethodBreakdown[];
    dailyRevenue: DailyRevenue[];
    appliedFilters: any;
}

export interface PaymentCycleSummary {
    cycleNumber: number;
    totalPaid: number;
    remainingAmount: number;
    status: PaymentStatus;
}
