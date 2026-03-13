import { useState } from 'react';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
    MoreHorizontal,
    Edit,
    Calendar,
    UserCog,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Eye,
    CheckCircle, 
    XCircle, 
    UserX, 
    CheckSquare,
    Ban
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/types/appointment.types';
import { AppointmentFormDialog } from './AppointmentFormDialog';
import { AppointmentActionModal, ActionType } from './AppointmentActionModal';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import { 
    useUpdateAppointment,
    useApproveAppointment,
    useRejectAppointment,
    useCompleteAppointment,
    useNoShowAppointment,
    useCancelAppointment
} from '@/hooks/useAppointments';

interface AppointmentsTableProps {
    appointments: Appointment[];
    isLoading: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (field: string) => void;
}

export function AppointmentsTable({
    appointments,
    isLoading,
    sortBy,
    sortOrder,
    onSort
}: AppointmentsTableProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ActionType>(null);
    const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const noShowAppointment = useNoShowAppointment();

    const handleActionClick = (id: string, action: ActionType) => {
        setSelectedAptId(id);
        setSelectedAction(action);
        setActionModalOpen(true);
    };

    const handleDetailClick = (id: string) => {
        setSelectedAptId(id);
        setDetailModalOpen(true);
    };

    const handleEdit = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setEditDialogOpen(true);
    };

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED:
                return "bg-primary/10 text-primary border-primary/20";
            case AppointmentStatus.COMPLETED:
                return "bg-green-500/10 text-green-700 border-green-500/20";
            case AppointmentStatus.CANCELLED:
                return "bg-destructive/10 text-destructive border-destructive/20";
            case AppointmentStatus.PENDING:
                return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
            case AppointmentStatus.BOOKED:
                return "bg-blue-500/10 text-blue-700 border-blue-500/20";
            case AppointmentStatus.NO_SHOW:
                return "bg-orange-500/10 text-orange-700 border-orange-500/20";
            case AppointmentStatus.REJECTED:
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <>
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead
                                className="w-[180px] cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => onSort?.('scheduledAt')}
                            >
                                <div className="flex items-center gap-2">
                                    Date & Time
                                    {sortBy === 'scheduledAt' ? (
                                        sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                                    ) : (
                                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => onSort?.('studentId')}
                            >
                                <div className="flex items-center gap-2">
                                    Student
                                    {sortBy === 'studentId' ? (
                                        sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                                    ) : (
                                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => onSort?.('staffId')}
                            >
                                <div className="flex items-center gap-2">
                                    Assigned Counselor
                                    {sortBy === 'staffId' ? (
                                        sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                                    ) : (
                                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => onSort?.('status')}
                            >
                                <div className="flex items-center gap-2">
                                    Status
                                    {sortBy === 'status' ? (
                                        sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                                    ) : (
                                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : appointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No appointments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments.map((apt) => (
                                <TableRow key={apt.id} className="group hover:bg-muted/50">
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                {format(new Date(apt.scheduledAt), 'MMM d, yyyy')}
                                            </div>
                                            <div className="text-xs text-muted-foreground pl-[22px]">
                                                {format(new Date(apt.scheduledAt), 'h:mm a')}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                                {apt.student.firstName?.[0] || apt.student.lastName?.[0] || 'S'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {apt.student.firstName} {apt.student.lastName}
                                                </p>
                                                {apt.student.phone && (
                                                    <p className="text-xs text-muted-foreground">{apt.student.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <UserCog className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{apt.staff.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(apt.status)}>
                                            {apt.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => handleDetailClick(apt.id)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {apt.status !== AppointmentStatus.REJECTED && 
                                             apt.status !== AppointmentStatus.CANCELLED && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                    {apt.status === AppointmentStatus.PENDING && (
                                                        <>
                                                            <DropdownMenuItem 
                                                                className="text-green-600 focus:text-green-600"
                                                                onClick={() => handleActionClick(apt.id, 'approve')}
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleActionClick(apt.id, 'reject')}
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Reject
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                    {apt.status === AppointmentStatus.BOOKED && (
                                                        <>
                                                            <DropdownMenuItem 
                                                                className="text-green-600 focus:text-green-600"
                                                                onClick={() => handleActionClick(apt.id, 'complete')}
                                                            >
                                                                <CheckSquare className="mr-2 h-4 w-4" />
                                                                Complete
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-orange-600 focus:text-orange-600"
                                                                onClick={() => noShowAppointment.mutateAsync(apt.id)}
                                                            >
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                No-show
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleActionClick(apt.id, 'cancel')}
                                                            >
                                                                <Ban className="mr-2 h-4 w-4" />
                                                                Cancel
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}

                                                    <DropdownMenuItem onClick={() => handleEdit(apt)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AppointmentFormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                appointment={selectedAppointment}
            />

            <AppointmentActionModal
                open={actionModalOpen}
                onOpenChange={setActionModalOpen}
                actionType={selectedAction}
                appointmentId={selectedAptId}
            />

            <AppointmentDetailModal
                id={selectedAptId}
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
            />
        </>
    );
}
