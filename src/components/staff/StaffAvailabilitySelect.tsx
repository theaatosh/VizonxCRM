import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { StaffStatus } from "@/types/staff.types";
import { cn } from "@/lib/utils";

interface StaffStatusSelectProps {
    value: StaffStatus;
    onChange: (value: StaffStatus) => void;
    disabled?: boolean;
}

const statusOptions: { value: StaffStatus; label: string; color: string }[] = [
    { value: 'Available', label: 'Available', color: 'text-success' },
    { value: 'Busy', label: 'Busy', color: 'text-warning' },
    { value: 'OnLeave', label: 'On Leave', color: 'text-muted-foreground' },
    { value: 'Offline', label: 'Offline', color: 'text-destructive' },
];

export function StaffStatusSelect({ value, onChange, disabled }: StaffStatusSelectProps) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v as StaffStatus)} disabled={disabled}>
            <SelectTrigger className="w-[140px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <span className={cn("flex items-center gap-2", option.color)}>
                            <span className={cn(
                                "h-2 w-2 rounded-full inline-block",
                                option.value === 'Available' && "bg-success",
                                option.value === 'Busy' && "bg-warning",
                                option.value === 'OnLeave' && "bg-muted-foreground",
                                option.value === 'Offline' && "bg-destructive",
                            )} />
                            {option.label}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
