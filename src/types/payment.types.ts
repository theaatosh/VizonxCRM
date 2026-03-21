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
    remainingAmount?: number;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
    status?: PaymentStatus;
    currency?: string;
    invoiceNumber?: string;
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
