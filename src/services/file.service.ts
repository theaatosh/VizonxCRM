import api from './api';

export interface FileUploadResponse {
    message: string;
    filePath: string;
    fileName: string;
}

export const fileService = {
    /**
     * Upload a file to the server
     */
    async uploadFile(formData: FormData): Promise<FileUploadResponse> {
        const response = await api.post<FileUploadResponse>('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default fileService;
