import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { PaginationParams } from '@/types/country.types';
import { CreateTaskDto, UpdateTaskDto } from '@/types/task.types';
import { useToast } from '@/hooks/use-toast';

export const useTasks = (params?: PaginationParams) => {
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: () => taskService.getAll(params),
    });
};

export const useOverdueTasks = (params?: PaginationParams) => {
    return useQuery({
        queryKey: ['overdue-tasks', params],
        queryFn: () => taskService.getOverdueTasks(params),
    });
};

export const useTaskStats = () => {
    return useQuery({
        queryKey: ['task-stats'],
        queryFn: () => taskService.getStats(),
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreateTaskDto) => taskService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task-stats'] });
            toast({
                title: "Success",
                description: "Task created successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create task",
                variant: "destructive",
            });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
            taskService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task-stats'] });
            toast({
                title: "Success",
                description: "Task updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update task",
                variant: "destructive",
            });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => taskService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task-stats'] });
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete task",
                variant: "destructive",
            });
        },
    });
};
