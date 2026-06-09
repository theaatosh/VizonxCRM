import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateCounselorStatus } from "@/hooks/useCounselor";
import type { StaffStatus } from "@/types/staff.types";

interface StatusOption {
    value: StaffStatus;
    label: string;
    icon: string;
    color: string;
    bgColor: string;
}

const statusOptions: StatusOption[] = [
    {
        value: 'Available',
        label: 'Available',
        icon: '●',
        color: 'text-success',
        bgColor: 'bg-success/10 hover:bg-success/20 border-success/30',
    },
    {
        value: 'Busy',
        label: 'Busy',
        icon: '●',
        color: 'text-warning',
        bgColor: 'bg-warning/10 hover:bg-warning/20 border-warning/30',
    },
    {
        value: 'OnLeave',
        label: 'On Leave',
        icon: '●',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/50 hover:bg-muted border-border',
    },
    {
        value: 'Offline',
        label: 'Offline',
        icon: '●',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10 hover:bg-destructive/20 border-destructive/30',
    },
];

interface CounselorStatusWidgetProps {
    currentStatus?: StaffStatus;
    staffProfileId?: string;
}

export function CounselorStatusWidget({ currentStatus = 'Available', staffProfileId }: CounselorStatusWidgetProps) {
    const updateStatus = useUpdateCounselorStatus();

    const handleStatusChange = (status: StaffStatus) => {
        if (staffProfileId) {
            updateStatus.mutate({ staffProfileId, status });
        }
    };

    return (
        <Card className="shadow-card">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Your Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((option) => {
                        const isActive = currentStatus === option.value;
                        return (
                            <Button
                                key={option.value}
                                variant="outline"
                                className={cn(
                                    "flex items-center gap-2 justify-center h-auto py-3 transition-all",
                                    isActive
                                        ? `${option.bgColor} ${option.color} border-2`
                                        : "border-border text-muted-foreground hover:text-foreground",
                                )}
                                onClick={() => handleStatusChange(option.value)}
                                disabled={updateStatus.isPending || isActive || !staffProfileId}
                            >
                                <span className={cn("text-lg", option.color)}>{option.icon}</span>
                                <span className="text-sm font-medium">{option.label}</span>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
