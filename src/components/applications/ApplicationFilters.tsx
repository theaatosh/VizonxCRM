import { useState, useEffect } from 'react';
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import type { CourseApplicationFilters, ApplicationStatus } from '@/types/course-application.types';

interface ApplicationFiltersProps {
    filters: CourseApplicationFilters;
    onFiltersChange: (filters: CourseApplicationFilters) => void;
}

const statusOptions: ApplicationStatus[] = [
    'Draft', 
    'Submitted', 
    'UnderReview', 
    'Shortlisted', 
    'OfferReceived', 
    'Accepted', 
    'Rejected', 
    'Withdrawn'
];

export function ApplicationFilters({ filters, onFiltersChange }: ApplicationFiltersProps) {
    const [localFilters, setLocalFilters] = useState<CourseApplicationFilters>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleApply = () => {
        onFiltersChange(localFilters);
    };

    const handleReset = () => {
        const resetFilters: CourseApplicationFilters = {
            page: 1,
            limit: 10,
        };
        setLocalFilters(resetFilters);
        onFiltersChange(resetFilters);
    };

    const updateFilter = (key: keyof CourseApplicationFilters, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? undefined : value
        }));
    };

    const hasActiveFilters = Object.keys(localFilters).some(key => 
        key !== 'page' && key !== 'limit' && localFilters[key as keyof CourseApplicationFilters] !== undefined
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 rounded-xl gap-2 border-dashed relative">
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4 rounded-xl shadow-xl" align="end">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Filter Applications</h4>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleReset}
                            className="h-8 text-xs text-muted-foreground hover:text-primary"
                        >
                            Reset
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Status</Label>
                            <Select 
                                value={localFilters.status || 'all'} 
                                onValueChange={(v) => updateFilter('status', v)}
                            >
                                <SelectTrigger className="h-9 rounded-lg">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statusOptions.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status.replace(/([A-Z])/g, ' $1').trim()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button 
                        className="w-full h-9 rounded-lg mt-2 shadow-md shadow-primary/20"
                        onClick={handleApply}
                    >
                        Apply Filters
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
