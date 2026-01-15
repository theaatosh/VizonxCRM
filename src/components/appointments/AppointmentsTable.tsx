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
    Trash2,
    Calendar,
    User,
    UserCog
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/types/appointment.types';
import { AppointmentFormDialog } from './AppointmentFormDialog';
import { useDeleteAppointment } from '@/hooks/useAppointments';

interface AppointmentsTableProps {
    appointments: Appointment[];
    isLoading: boolean;
}

export function AppointmentsTable({ appointments, isLoading }: AppointmentsTableProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const deleteAppointment = useDeleteAppointment();

    const handleEdit = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setEditDialogOpen(true);
    };

    const handleDelete = async (appointment: Appointment) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            await deleteAppointment.mutateAsync(appointment.id);
        }
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
                            <TableHead className="w-[180px]">Date & Time</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
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
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
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
                                            <div className="text-xs text-muted-foreground pl-5.5">
                                                {format(new Date(apt.scheduledAt), 'h:mm a')}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                                {apt.student.firstName[0]}{apt.student.lastName[0]}
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
                                    <TableCell>
                                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                                            {apt.outcomeNotes || '-'}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(apt)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(apt)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
        </>
    );
}
