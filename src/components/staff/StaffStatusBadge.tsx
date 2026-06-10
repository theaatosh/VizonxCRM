import { Badge } from "@/components/ui/badge";
import type { StaffStatus } from "@/types/staff.types";
import { cn } from "@/lib/utils";

const statusColors: Record<StaffStatus, string> = {
    Available: "bg-success/10 text-success border-success/20",
    Busy: "bg-warning/10 text-warning border-warning/20",
    OnLeave: "bg-muted text-muted-foreground border-muted",
    Offline: "bg-destructive/10 text-destructive border-destructive/20",
};

interface StaffStatusBadgeProps {
    status: StaffStatus;
    className?: string;
}

export function StaffStatusBadge({ status, className }: StaffStatusBadgeProps) {
    return (
        <Badge variant="outline" className={cn(statusColors[status], className)}>
            {status}
        </Badge>
    );
}
