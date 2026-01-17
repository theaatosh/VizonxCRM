import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Mail,
    MessageSquare,
    CheckCircle,
    XCircle,
    Send
} from "lucide-react";
import type { MessagingData, TemplatesData } from "@/types/dashboard.types";

interface MessagingStatsProps {
    messaging?: MessagingData;
    templates?: TemplatesData;
    isLoading?: boolean;
}

function StatRow({
    icon: Icon,
    label,
    value,
    subValue
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    subValue?: string;
}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="text-right">
                <span className="font-semibold text-foreground">{value}</span>
                {subValue && (
                    <span className="text-xs text-muted-foreground ml-1">{subValue}</span>
                )}
            </div>
        </div>
    );
}

export function MessagingStats({ messaging, templates, isLoading = false }: MessagingStatsProps) {
    if (isLoading) {
        return (
            <Card className="shadow-card">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center py-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const todayStats = messaging?.today || { total: 0, emailsSent: 0, smsSent: 0, failed: 0 };

    return (
        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">Messaging</CardTitle>
                        <p className="text-sm text-muted-foreground">Today's activity</p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        {todayStats.total} sent
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <StatRow
                        icon={Mail}
                        label="Emails Sent"
                        value={todayStats.emailsSent}
                    />
                    <StatRow
                        icon={MessageSquare}
                        label="SMS Sent"
                        value={todayStats.smsSent}
                    />
                    <StatRow
                        icon={XCircle}
                        label="Failed"
                        value={todayStats.failed}
                    />
                    <div className="pt-2 mt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Templates</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-muted/50">
                                <span className="text-xs text-muted-foreground">Email</span>
                                <span className="text-sm font-medium">{templates?.email?.active || 0}/{templates?.email?.total || 0}</span>
                            </div>
                            <div className="flex items-center justify-between px-2 py-1.5 rounded bg-muted/50">
                                <span className="text-xs text-muted-foreground">SMS</span>
                                <span className="text-sm font-medium">{templates?.sms?.active || 0}/{templates?.sms?.total || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
