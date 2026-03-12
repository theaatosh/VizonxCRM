import { useQuery } from '@tanstack/react-query';
import workingHoursService from '@/services/workingHours.service';

export const useWorkingHours = () => {
    return useQuery({
        queryKey: ['working-hours'],
        queryFn: workingHoursService.getAllWorkingHours,
    });
};
