import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: "primary" | "success" | "warning" | "info" | "destructive";
    isLoading?: boolean;
}

const iconColorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = "primary",
    isLoading = false
}: StatCardProps) {
    if (isLoading) {
        return (
            <Card className="shadow-card">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        iconColorClasses[iconColor]
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground">{title}</p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground/70">{subtitle}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
