import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { PaginationParams, PaginatedResponse } from '@/types/country.types';

export interface User {
    id: string;
    name: string;
    email: string;
    roleId?: string;
    status?: string;
}

export const useUsers = (params?: PaginationParams) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: async () => {
            const response = await api.get<PaginatedResponse<User>>('/users', { params });
            return response.data;
        },
    });
};
