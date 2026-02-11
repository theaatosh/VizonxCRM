/**
 * Messaging Types - Based on CMS_MESSAGING_API_GUIDE.md
 * Endpoints: /api/v1/templates/email, /api/v1/templates/sms
 */

// Event types for automated messaging
export type EventType =
    | 'LeadCreated'
    | 'LeadAssigned'
    | 'LeadConverted'
    | 'StudentCreated'
    | 'AppointmentScheduled'
    | 'AppointmentReminder'
    | 'TaskAssigned'
    | 'TaskDueReminder'
    | 'VisaWorkflowStepChanged'
    | 'DocumentRequested'
    | 'DocumentUploaded'
    | 'PaymentReceived'
    | 'PaymentDue'
    | 'PasswordReset'
    | 'WelcomeEmail'
    | 'Custom';

// Email Template Types
export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    variables: string[];
    eventType: EventType;
    description?: string;
    active: boolean;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmailTemplateDto {
    name: string;
    subject: string;
    body: string;
    variables: string[];
    eventType: EventType;
    description?: string;
}

export interface UpdateEmailTemplateDto {
    name?: string;
    subject?: string;
    body?: string;
    variables?: string[];
    eventType?: EventType;
    description?: string;
}

export interface EmailTemplateQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface EmailTemplatesResponse {
    data: EmailTemplate[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface EmailPreviewRequest {
    sampleData: Record<string, string>;
}

export interface EmailPreviewResponse {
    subject: string;
    body: string;
    originalSubject: string;
    originalBody: string;
    sampleData: Record<string, string>;
}

// SMS Template Types
export interface SmsTemplate {
    id: string;
    name: string;
    body: string;
    variables: string[];
    eventType: EventType;
    description?: string;
    active: boolean;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSmsTemplateDto {
    name: string;
    body: string;
    variables: string[];
    eventType: EventType;
    description?: string;
}

export interface UpdateSmsTemplateDto {
    name?: string;
    body?: string;
    variables?: string[];
    eventType?: EventType;
    description?: string;
}

export interface SmsTemplateQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface SmsTemplatesResponse {
    data: SmsTemplate[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SmsPreviewRequest {
    sampleData: Record<string, string>;
}

export interface SmsPreviewResponse {
    body: string;
    originalBody: string;
    sampleData: Record<string, string>;
    characterCount: number;
}

// Activate/Deactivate Request
export interface ActivateTemplateDto {
    active: boolean;
}
