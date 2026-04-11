import api from './api';
import type { 
    VisaDocument, 
    CreateVisaDocumentDto, 
    UpdateVisaDocumentDto 
} from '@/types/visaApplication.types';

const VISA_DOCUMENTS_ENDPOINT = '/visa-documents';

export const visaDocumentService = {
    /**
     * Get visa documents with filters
     */
    async getVisaDocuments(params?: { 
        visaApplicationId?: string; 
        studentId?: string; 
        workflowId?: string 
    }): Promise<VisaDocument[]> {
        const response = await api.get<VisaDocument[]>(VISA_DOCUMENTS_ENDPOINT, { params });
        return response.data;
    },

    /**
     * Create a new visa document
     */
    async createVisaDocument(data: CreateVisaDocumentDto): Promise<VisaDocument> {
        const response = await api.post<VisaDocument>(VISA_DOCUMENTS_ENDPOINT, data);
        return response.data;
    },

    /**
     * Update an existing visa document
     */
    async updateVisaDocument(id: string, data: UpdateVisaDocumentDto): Promise<VisaDocument> {
        const response = await api.patch<VisaDocument>(`${VISA_DOCUMENTS_ENDPOINT}/${id}`, data);
        return response.data;
    },

    /**
     * Delete a visa document
     */
    async deleteVisaDocument(id: string): Promise<void> {
        await api.delete(`${VISA_DOCUMENTS_ENDPOINT}/${id}`);
    },
};

export default visaDocumentService;
