import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCounselorMonitoring } from "@/hooks/useCounselor";
import { StaffStatusBadge } from "@/components/staff/StaffStatusBadge";
import {
    Users,
    List,
    CheckSquare,
    Phone,
    Activity,
    Gauge,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Search,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaffWorkload } from "@/types/staff.types";

const REFRESH_SECONDS = 30;

const getWorkloadIndicator = (item: StaffWorkload) => {
    if (item.status === "Offline" || item.status === "OnLeave") {
        return { dot: "bg-muted-foreground", bar: "", label: item.status === "Offline" ? "Offline" : "On Leave", badge: "bg-muted text-muted-foreground border-muted" };
    }
    if (item.workloadPercentage >= 80) {
        return { dot: "bg-destructive", bar: "[&>div]:bg-destructive", label: "Overloaded", badge: "bg-destructive/10 text-destructive border-destructive/20" };
    }
    if (item.workloadPercentage >= 50) {
        return { dot: "bg-warning", bar: "[&>div]:bg-warning", label: "Busy", badge: "bg-warning/10 text-warning border-warning/20" };
    }
    return { dot: "bg-success", bar: "[&>div]:bg-success", label: "Free", badge: "bg-success/10 text-success border-success/20" };
};

const CounselorMonitoring = () => {
    const { data: workloadList, isLoading, isError, refetch, isRefetching } = useCounselorMonitoring();
    const [search, setSearch] = useState("");
    const [countdown, setCountdown] = useState(REFRESH_SECONDS);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    return REFRESH_SECONDS;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleRefresh = () => {
        refetch();
        setCountdown(REFRESH_SECONDS);
    };

    const allCounselors = workloadList || [];
    const counselors = search
        ? allCounselors.filter(
              (c) =>
                  c.name.toLowerCase().includes(search.toLowerCase()) ||
                  c.staffType.toLowerCase().includes(search.toLowerCase())
          )
        : allCounselors;

    const freeCounselors = allCounselors.filter(
        (c) => c.workloadPercentage < 50 && c.status === "Available"
    );
    const busyCounselors = allCounselors.filter(
        (c) => c.workloadPercentage >= 50 && c.workloadPercentage < 80 && c.status !== "Offline"
    );
    const overloadedCounselors = allCounselors.filter(
        (c) => c.workloadPercentage >= 80 || c.status === "Offline" || c.status === "OnLeave"
    );

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <DashboardLayout
            title="Counselor Monitoring"
            subtitle="Real-time workload and availability"
            action={
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                        Refreshes in {countdown}s
                    </span>
                    <div className="h-1 w-16 rounded-full bg-muted overflow-hidden hidden sm:block">
                        <div
                            className="h-full bg-primary transition-all duration-1000"
                            style={{ width: `${(countdown / REFRESH_SECONDS) * 100}%` }}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefetching}>
                        <RefreshCw className={cn("h-4 w-4 mr-2", isRefetching && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            }
        >
            {/* Summary cards */}
            <div className="grid gap-4 md:gap-6 grid-cols-3 mb-6">
                <Card className="shadow-card border-success/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{freeCounselors.length}</p>
                                <p className="text-xs text-muted-foreground">Free (&lt;50%)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-card border-warning/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{busyCounselors.length}</p>
                                <p className="text-xs text-muted-foreground">Busy (50–79%)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-card border-destructive/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{overloadedCounselors.length}</p>
                                <p className="text-xs text-muted-foreground">Overloaded / Away</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search counselors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {isError && (
                <div className="py-8 text-center">
                    <p className="text-destructive">Failed to load monitoring data.</p>
                    <Button variant="outline" className="mt-4" onClick={handleRefresh}>Retry</Button>
                </div>
            )}

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="shadow-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, j) => <Skeleton key={j} className="h-3 w-full" />)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : counselors.length === 0 ? (
                <div className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-1">
                        {search ? "No results found" : "No counselors found"}
                    </h3>
                    <p className="text-muted-foreground">
                        {search ? "Try a different search term." : "No counselor data available."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {counselors.map((counselor) => {
                        const indicator = getWorkloadIndicator(counselor);
                        const isOfflineOrLeave = counselor.status === "Offline" || counselor.status === "OnLeave";
                        return (
                            <Card
                                key={counselor.staffId}
                                className={cn(
                                    "shadow-card transition-all",
                                    counselor.workloadPercentage >= 80 && !isOfflineOrLeave && "border-destructive/30",
                                    isOfflineOrLeave && "opacity-70"
                                )}
                            >
                                <CardContent className="p-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${counselor.name}`}
                                                    />
                                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                                        {getInitials(counselor.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                                                    indicator.dot
                                                )} />
                                            </div>
                                            <div>
                                                <p className="font-medium leading-tight">{counselor.name}</p>
                                                <p className="text-xs text-muted-foreground">{counselor.staffType}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn("text-[10px]", indicator.badge)}>
                                            {indicator.label}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <StaffStatusBadge status={counselor.status as any} />
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Users className="h-3.5 w-3.5" />
                                                Leads
                                            </span>
                                            <span className="font-semibold">{counselor.activeLeads}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <List className="h-3.5 w-3.5" />
                                                Queue
                                            </span>
                                            <span className="font-semibold">{counselor.queueLoad}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <CheckSquare className="h-3.5 w-3.5" />
                                                Tasks
                                            </span>
                                            <span className="font-semibold">{counselor.openTasks}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Phone className="h-3.5 w-3.5" />
                                                Follow-ups
                                            </span>
                                            <span className="font-semibold">{counselor.pendingFollowUps}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Activity className="h-3.5 w-3.5" />
                                                Calls today
                                            </span>
                                            <span className="font-semibold">{counselor.todayCalls}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Meetings
                                            </span>
                                            <span className="font-semibold">{counselor.todayMeetings}</span>
                                        </div>
                                    </div>

                                    {/* Workload bar */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Gauge className="h-3.5 w-3.5" />
                                                Workload
                                            </span>
                                            <span className={cn(
                                                "text-xs font-semibold",
                                                counselor.workloadPercentage >= 80 ? "text-destructive" :
                                                counselor.workloadPercentage >= 50 ? "text-warning" : "text-success"
                                            )}>
                                                {counselor.workloadPercentage}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={counselor.workloadPercentage}
                                            className={cn("h-2", indicator.bar)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
};

export default CounselorMonitoring;
