import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCounselorDashboard } from "@/hooks/useCounselor";
import { CounselorKpiCards } from "@/components/counselor/CounselorKpiCards";
import { CounselorStatusWidget } from "@/components/counselor/CounselorStatusWidget";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Users, List, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/lead.types";
import type { Task } from "@/types/task.types";
import type { Appointment } from "@/types/appointment.types";

const priorityColors: Record<string, string> = {
    High: "bg-destructive/10 text-destructive border-destructive/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Low: "bg-success/10 text-success border-success/20",
};

const taskStatusColors: Record<string, string> = {
    Pending: "bg-warning/10 text-warning border-warning/20",
    InProgress: "bg-info/10 text-info border-info/20",
    Completed: "bg-success/10 text-success border-success/20",
    Cancelled: "bg-muted text-muted-foreground border-muted",
};

const CounselorDashboard = () => {
    const navigate = useNavigate();
    const {
        isLoading,
        isError,
        profile,
        workload,
        assignedLeads,
        tasks,
        upcomingAppointments,
        isLoadingLeads,
        isLoadingTasks,
        isLoadingAppointments,
    } = useCounselorDashboard();

    if (isError) {
        return (
            <DashboardLayout title="Counselor Dashboard" subtitle="Error loading data">
                <div className="py-12 text-center">
                    <p className="text-destructive">
                        Failed to load your staff profile. Make sure your account has a staff profile assigned.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Dashboard" subtitle="Your counselor overview">
            {/* KPI Cards */}
            <CounselorKpiCards workload={workload} isLoading={isLoading} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Assigned Leads */}
                <Card className="shadow-card lg:col-span-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Assigned Leads
                            </span>
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/leads")}>
                                View All <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingLeads ? (
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                            </div>
                        ) : assignedLeads.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">No assigned leads</p>
                        ) : (
                            <div className="space-y-2">
                                {assignedLeads.slice(0, 6).map((lead: Lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/leads/${lead.id}`)}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {lead.firstName[0]}{lead.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {lead.firstName} {lead.lastName}
                                                </p>
                                                <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                    {lead.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn("text-[10px] ml-2 flex-shrink-0", priorityColors[lead.priority])}
                                        >
                                            {lead.priority}
                                        </Badge>
                                    </div>
                                ))}
                                {assignedLeads.length > 6 && (
                                    <p className="text-xs text-muted-foreground text-center pt-1">
                                        +{assignedLeads.length - 6} more leads
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tasks */}
                <Card className="shadow-card lg:col-span-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <List className="h-5 w-5 text-primary" />
                                My Tasks
                            </span>
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/tasks")}>
                                View All <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingTasks ? (
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                            </div>
                        ) : tasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">No tasks assigned</p>
                        ) : (
                            <div className="space-y-2">
                                {tasks.slice(0, 6).map((task: Task) => (
                                    <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">{task.title}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("text-[10px] px-1 py-0", taskStatusColors[task.status] || "")}
                                                >
                                                    {task.status}
                                                </Badge>
                                                {task.dueDate && (
                                                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                        <Clock className="h-2.5 w-2.5" />
                                                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn("text-[10px] ml-2 flex-shrink-0", priorityColors[task.priority])}
                                        >
                                            {task.priority}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Status Widget */}
                <div className="space-y-4 lg:col-span-1">
                    <CounselorStatusWidget
                        currentStatus={isLoading ? undefined : profile?.status}
                        staffProfileId={profile?.id}
                    />

                    {/* Quick stats */}
                    {workload && !isLoading && (
                        <Card className="shadow-card">
                            <CardContent className="p-4 space-y-3">
                                <p className="text-sm font-medium">Today</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-info/5 p-3 text-center">
                                        <p className="text-xl font-bold text-info">{workload.todayCalls}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">Calls</p>
                                    </div>
                                    <div className="rounded-lg bg-primary/5 p-3 text-center">
                                        <p className="text-xl font-bold text-primary">{workload.todayMeetings}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">Meetings</p>
                                    </div>
                                    <div className="rounded-lg bg-warning/5 p-3 text-center">
                                        <p className="text-xl font-bold text-warning">{workload.pendingFollowUps}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">Follow-ups</p>
                                    </div>
                                    <div className="rounded-lg bg-success/5 p-3 text-center">
                                        <p className="text-xl font-bold text-success">{workload.queueLoad}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">In Queue</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Upcoming Appointments */}
            <Card className="shadow-card mt-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Upcoming Appointments
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/appointments")}>
                            View All <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingAppointments ? (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                        </div>
                    ) : upcomingAppointments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">No upcoming appointments</p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingAppointments
                                .filter((a: Appointment) => new Date(a.scheduledAt) >= new Date())
                                .slice(0, 6)
                                .map((appt: Appointment) => (
                                    <div key={appt.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {appt.purpose || "Appointment"}
                                            </p>
                                            {appt.student && (
                                                <p className="text-xs text-muted-foreground">
                                                    {appt.student.firstName} {appt.student.lastName}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(appt.scheduledAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {appt.duration}min
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default CounselorDashboard;
