import { useState, useEffect } from 'react';
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import type { PaymentFilters as PaymentFiltersType, PaymentStatus, PaymentType, PaymentMethod } from '@/types/payment.types';
import { useServices } from '@/hooks/useServices';
import { useStudents } from '@/hooks/useStudents';

interface PaymentFiltersProps {
    filters: PaymentFiltersType;
    onFiltersChange: (filters: PaymentFiltersType) => void;
}

export function PaymentFilters({ filters, onFiltersChange }: PaymentFiltersProps) {
    const [localFilters, setLocalFilters] = useState<PaymentFiltersType>(filters);
    const { data: servicesData } = useServices({ limit: 100 });
    const { data: studentsData } = useStudents({ limit: 100 });

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleApply = () => {
        onFiltersChange(localFilters);
    };

    const handleReset = () => {
        const resetFilters: PaymentFiltersType = {
            page: 1,
            limit: 10,
            search: filters.search, // Keep search
        };
        setLocalFilters(resetFilters);
        onFiltersChange(resetFilters);
    };

    const updateFilter = (key: keyof PaymentFiltersType, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? undefined : value
        }));
    };

    const hasActiveFilters = Object.keys(localFilters).some(key => 
        key !== 'page' && key !== 'limit' && key !== 'search' && localFilters[key as keyof PaymentFiltersType] !== undefined
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
            <PopoverContent className="w-[320px] p-4 rounded-xl shadow-xl" align="end">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">Filter Payments</h4>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleReset}
                            className="h-8 text-xs text-muted-foreground hover:text-primary"
                        >
                            Reset All
                        </Button>
                    </div>

                    <div className="grid gap-3">
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
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                    <SelectItem value="Refunded">Refunded</SelectItem>
                                    <SelectItem value="PartiallyPaid">Partially Paid</SelectItem>
                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Service</Label>
                            <Select 
                                value={localFilters.serviceId || 'all'} 
                                onValueChange={(v) => updateFilter('serviceId', v)}
                            >
                                <SelectTrigger className="h-9 rounded-lg">
                                    <SelectValue placeholder="All Services" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Services</SelectItem>
                                    {servicesData?.data.map(service => (
                                        <SelectItem key={service.id} value={service.id}>
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Payment Type</Label>
                            <Select 
                                value={localFilters.paymentType || 'all'} 
                                onValueChange={(v) => updateFilter('paymentType', v)}
                            >
                                <SelectTrigger className="h-9 rounded-lg">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Full">Full</SelectItem>
                                    <SelectItem value="Advance">Advance</SelectItem>
                                    <SelectItem value="Partial">Partial</SelectItem>
                                    <SelectItem value="Balance">Balance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Due Date Range</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input 
                                    type="date" 
                                    className="h-9 text-xs rounded-lg"
                                    value={localFilters.dueDateFrom || ''}
                                    onChange={(e) => updateFilter('dueDateFrom', e.target.value)}
                                />
                                <Input 
                                    type="date" 
                                    className="h-9 text-xs rounded-lg"
                                    value={localFilters.dueDateTo || ''}
                                    onChange={(e) => updateFilter('dueDateTo', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Invoice Number</Label>
                            <Input 
                                placeholder="INV-2024..." 
                                className="h-9 rounded-lg text-sm"
                                value={localFilters.invoiceNumber || ''}
                                onChange={(e) => updateFilter('invoiceNumber', e.target.value)}
                            />
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
