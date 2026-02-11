import api from './api';
import {
    EmailTemplate,
    CreateEmailTemplateDto,
    UpdateEmailTemplateDto,
    EmailTemplatesResponse,
    EmailTemplateQueryParams,
    EmailPreviewRequest,
    EmailPreviewResponse,
    SmsTemplate,
    CreateSmsTemplateDto,
    UpdateSmsTemplateDto,
    SmsTemplatesResponse,
    SmsTemplateQueryParams,
    SmsPreviewRequest,
    SmsPreviewResponse,
    ActivateTemplateDto,
} from '@/types/messaging.types';

/**
 * Messaging Service - Production-grade API integration
 * Base URLs: /api/v1/templates/email, /api/v1/templates/sms
 */
class MessagingService {
    private readonly emailBaseUrl = '/templates/email';
    private readonly smsBaseUrl = '/templates/sms';

    // ================== Email Templates ==================

    /**
     * Get all email templates with pagination and filtering
     */
    async getEmailTemplates(params?: EmailTemplateQueryParams): Promise<EmailTemplatesResponse> {
        const response = await api.get<EmailTemplatesResponse>(this.emailBaseUrl, { params });
        return response.data;
    }

    /**
     * Get a single email template by ID
     */
    async getEmailTemplateById(id: string): Promise<EmailTemplate> {
        const response = await api.get<EmailTemplate>(`${this.emailBaseUrl}/${id}`);
        return response.data;
    }

    /**
     * Create a new email template
     */
    async createEmailTemplate(data: CreateEmailTemplateDto): Promise<EmailTemplate> {
        const response = await api.post<EmailTemplate>(this.emailBaseUrl, data);
        return response.data;
    }

    /**
     * Update an existing email template
     */
    async updateEmailTemplate(id: string, data: UpdateEmailTemplateDto): Promise<EmailTemplate> {
        const response = await api.put<EmailTemplate>(`${this.emailBaseUrl}/${id}`, data);
        return response.data;
    }

    /**
     * Activate or deactivate an email template
     */
    async activateEmailTemplate(id: string, active: boolean): Promise<EmailTemplate> {
        const response = await api.patch<EmailTemplate>(`${this.emailBaseUrl}/${id}/activate`, { active });
        return response.data;
    }

    /**
     * Preview email template with sample data
     */
    async previewEmailTemplate(id: string, sampleData: Record<string, string>): Promise<EmailPreviewResponse> {
        const response = await api.post<EmailPreviewResponse>(`${this.emailBaseUrl}/${id}/preview`, { sampleData });
        return response.data;
    }

    /**
     * Delete an email template
     */
    async deleteEmailTemplate(id: string): Promise<void> {
        await api.delete(`${this.emailBaseUrl}/${id}`);
    }

    // ================== SMS Templates ==================

    /**
     * Get all SMS templates with pagination and filtering
     */
    async getSmsTemplates(params?: SmsTemplateQueryParams): Promise<SmsTemplatesResponse> {
        const response = await api.get<SmsTemplatesResponse>(this.smsBaseUrl, { params });
        return response.data;
    }

    /**
     * Get a single SMS template by ID
     */
    async getSmsTemplateById(id: string): Promise<SmsTemplate> {
        const response = await api.get<SmsTemplate>(`${this.smsBaseUrl}/${id}`);
        return response.data;
    }

    /**
     * Create a new SMS template
     */
    async createSmsTemplate(data: CreateSmsTemplateDto): Promise<SmsTemplate> {
        const response = await api.post<SmsTemplate>(this.smsBaseUrl, data);
        return response.data;
    }

    /**
     * Update an existing SMS template
     */
    async updateSmsTemplate(id: string, data: UpdateSmsTemplateDto): Promise<SmsTemplate> {
        const response = await api.put<SmsTemplate>(`${this.smsBaseUrl}/${id}`, data);
        return response.data;
    }

    /**
     * Activate or deactivate an SMS template
     */
    async activateSmsTemplate(id: string, active: boolean): Promise<SmsTemplate> {
        const response = await api.patch<SmsTemplate>(`${this.smsBaseUrl}/${id}/activate`, { active });
        return response.data;
    }

    /**
     * Preview SMS template with sample data
     */
    async previewSmsTemplate(id: string, sampleData: Record<string, string>): Promise<SmsPreviewResponse> {
        const response = await api.post<SmsPreviewResponse>(`${this.smsBaseUrl}/${id}/preview`, { sampleData });
        return response.data;
    }

    /**
     * Delete an SMS template
     */
    async deleteSmsTemplate(id: string): Promise<void> {
        await api.delete(`${this.smsBaseUrl}/${id}`);
    }
}

export default new MessagingService();
