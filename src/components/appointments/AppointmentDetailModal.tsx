
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAppointment } from '@/hooks/useAppointments';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, Calendar, Clock, User, UserCog, FileText, History } from 'lucide-react';
import { AppointmentStatus } from '@/types/appointment.types';

interface AppointmentDetailModalProps {
    id: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AppointmentDetailModal = ({ id, open, onOpenChange }: AppointmentDetailModalProps) => {
    const { data: appointment, isLoading } = useAppointment(id || '');

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED: return "bg-primary/10 text-primary border-primary/20";
            case AppointmentStatus.COMPLETED: return "bg-green-500/10 text-green-700 border-green-500/20";
            case AppointmentStatus.CANCELLED: return "bg-destructive/10 text-destructive border-destructive/20";
            case AppointmentStatus.PENDING: return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
            case AppointmentStatus.BOOKED: return "bg-blue-500/10 text-blue-700 border-blue-500/20";
            case AppointmentStatus.NO_SHOW: return "bg-orange-500/10 text-orange-700 border-orange-500/20";
            case AppointmentStatus.REJECTED: return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const InfoRow = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => {
        if (value === null || value === undefined || value === '') return null;
        return (
            <div className="flex flex-col gap-1 py-1.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    {Icon && <Icon className="h-3 w-3" />}
                    {label}
                </span>
                <span className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</span>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 border-b">
                    <DialogTitle className="flex justify-between items-center pr-4">
                        <span>Appointment Details</span>
                        {appointment && (
                            <Badge variant="outline" className={getStatusColor(appointment.status)}>
                                {appointment.status}
                            </Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 w-full overflow-y-scroll">
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : appointment ? (
                            <div className="space-y-6">
                                {/* Schedule section */}
                                <section>
                                    <h3 className="text-sm font-bold flex items-center gap-2 mb-2 text-primary">
                                        <Calendar className="h-4 w-4" />
                                        Scheduling Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-4 border rounded-lg p-4 bg-muted/30">
                                        <InfoRow
                                            label="Scheduled At"
                                            value={format(new Date(appointment.scheduledAt), 'PPP p')}
                                        />
                                        <InfoRow
                                            label="End Time"
                                            value={format(new Date(appointment.endTime), 'p')}
                                        />
                                        <InfoRow
                                            label="Duration"
                                            value={`${appointment.duration} minutes`}
                                        />
                                        <InfoRow label="Requested By" value={appointment.requestedBy} />
                                        <InfoRow label="Requested At"
                                            value={format(new Date(appointment.requestedAt), 'PPP p')}
                                        />
                                        <InfoRow label="Assigned Counselor" value={appointment.staff.name} />
                                        <InfoRow label="Timezone" value={appointment.timezone} />
                                    </div>
                                </section>

                                <Separator />

                                {/* Participants */}
                                <section>
                                    <h3 className="text-sm font-bold flex items-center gap-2 mb-2 text-primary">
                                        <UserCog className="h-4 w-4" />
                                        Participants
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="border rounded-lg p-4 bg-muted/30">
                                            <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                                                <User className="h-3 w-3" /> STUDENT
                                            </p>
                                            <div className="grid grid-cols-2 gap-x-4">
                                                <InfoRow label="First Name" value={appointment.student.firstName} />
                                                <InfoRow label="Last Name" value={appointment.student.lastName} />
                                                <div className="col-span-2">
                                                    <InfoRow label="Email" value={appointment.student.email} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4 bg-muted/30">
                                            <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                                                <UserCog className="h-3 w-3" /> ASSIGNED COUNSELOR
                                            </p>
                                            <div className="grid grid-cols-2 gap-x-4">
                                                <InfoRow label="Counselor Name" value={appointment.staff.name} />
                                                <div className="col-span-2">
                                                    <InfoRow label="Email" value={appointment.staff.email} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator />

                                {/* Notes */}
                                <section>
                                    <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-primary">
                                        <FileText className="h-4 w-4" />
                                        Notes & Feedback
                                    </h3>
                                    <div className="space-y-4">
                                    {appointment.purpose && (
                                        <div className="bg-muted/30 rounded-lg p-3">
                                            <InfoRow label="Purpose of Visit" value={appointment.purpose} />
                                        </div>
                                    )}

                                    {appointment.note && (
                                        <div className="border-l-4 border-blue-400 pl-4 py-1">
                                            <InfoRow label="Initial Note (Student)" value={appointment.note} />
                                        </div>
                                    )}

                                    {appointment.notes && (
                                        <div className="border-l-4 border-primary pl-4 py-1">
                                            <InfoRow label="Internal Admin Notes" value={appointment.notes} />
                                        </div>
                                    )}

                                    {appointment.staffNotes && (
                                        <div className="border-l-4 border-green-500 pl-4 py-1">
                                            <InfoRow label="Staff Notes" value={appointment.staffNotes} />
                                        </div>
                                    )}

                                    {appointment.outcomeNotes && (
                                        <div className="border-l-4 border-amber-500 pl-4 py-1">
                                            <InfoRow label="Outcome & Results" value={appointment.outcomeNotes} />
                                        </div>
                                    )}

                                    {appointment.rejectionReason && (
                                        <div className="border-l-4 border-destructive pl-4 py-1 bg-destructive/5">
                                            <InfoRow label="Reason for Rejection" value={appointment.rejectionReason} />
                                        </div>
                                    )}

                                    {appointment.cancellationReason && (
                                        <div className="border-l-4 border-red-400 pl-4 py-1 bg-red-50">
                                            <InfoRow label="Reason for Cancellation" value={appointment.cancellationReason} />
                                        </div>
                                    )}
                                </div>
                            </section>

                                {(appointment.approvedAt || appointment.rejectedAt || appointment.cancelledAt || appointment.completedAt) && (
                                    <>
                                        <Separator />
                                        {/* History/Actions Log */}
                                        <section>
                                            <h3 className="text-sm font-bold flex items-center gap-2 mb-2 text-primary">
                                                <History className="h-4 w-4" />
                                                Action History
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {appointment.approvedAt && (
                                                    <div className="border rounded-lg p-3 bg-green-50/50 border-green-100">
                                                        <InfoRow
                                                            label="Approved At"
                                                            value={format(new Date(appointment.approvedAt), 'PPP p')}
                                                        />
                                                    </div>
                                                )}
                                                {appointment.rejectedAt && (
                                                    <div className="border rounded-lg p-3 bg-red-50/50 border-red-100">
                                                        <InfoRow
                                                            label="Rejected At"
                                                            value={format(new Date(appointment.rejectedAt), 'PPP p')}
                                                        />
                                                        <InfoRow label="Rejection Reason" value={appointment.rejectionReason} />
                                                    </div>
                                                )}
                                                {appointment.cancelledAt && (
                                                    <div className="border rounded-lg p-3 bg-red-50/50 border-red-100">
                                                        <InfoRow
                                                            label="Cancelled At"
                                                            value={format(new Date(appointment.cancelledAt), 'PPP p')}
                                                        />
                                                        <InfoRow label="Cancellation Reason" value={appointment.cancellationReason} />
                                                    </div>
                                                )}
                                                {appointment.completedAt && (
                                                    <div className="border rounded-lg p-3 bg-blue-50/50 border-blue-100">
                                                        <InfoRow
                                                            label="Completed At"
                                                            value={format(new Date(appointment.completedAt), 'PPP p')}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </> 
                                )}

                                <Separator />

                               
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                Appointment not found.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
