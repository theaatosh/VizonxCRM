import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User, Video } from "lucide-react";
import type { UpcomingAppointment } from "@/types/dashboard.types";

interface UpcomingAppointmentsProps {
    appointments?: UpcomingAppointment[];
    isLoading?: boolean;
}

function formatDateTime(dateString: string): { date: string; time: string } {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
}

function AppointmentSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>
            ))}
        </div>
    );
}

export function UpcomingAppointments({ appointments, isLoading = false }: UpcomingAppointmentsProps) {
    if (isLoading) {
        return (
            <Card className="shadow-card">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </CardHeader>
                <CardContent>
                    <AppointmentSkeleton />
                </CardContent>
            </Card>
        );
    }

    const hasAppointments = appointments && appointments.length > 0;

    return (
        <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
                        <p className="text-sm text-muted-foreground">Scheduled meetings</p>
                    </div>
                    <Badge variant="outline" className="font-normal cursor-pointer hover:bg-muted">
                        View All
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {hasAppointments ? (
                    appointments.slice(0, 5).map((appointment) => {
                        const { date, time } = formatDateTime(appointment.scheduledAt);
                        return (
                            <div
                                key={appointment.id}
                                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                        {appointment.student.firstName[0]}{appointment.student.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">
                                        {appointment.student.firstName} {appointment.student.lastName}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {time}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge
                                        variant="outline"
                                        className="bg-primary/10 text-primary border-primary/20 text-xs"
                                    >
                                        {appointment.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {appointment.staff.name.split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        <Video className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No upcoming appointments</p>
                        <p className="text-sm mt-1">Schedule your first meeting</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
