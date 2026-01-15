import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useCreateAppointment, useUpdateAppointment } from '@/hooks/useAppointments';
import { useStudents } from '@/hooks/useStudents';
import { useUsers } from '@/hooks/useUsers';
import { Appointment, AppointmentStatus } from '@/types/appointment.types';

const appointmentFormSchema = z.object({
    scheduledDate: z.date({
        required_error: "A date is required",
    }),
    scheduledTime: z.string().min(1, "Time is required"),
    studentId: z.string().min(1, "Student is required"),
    staffId: z.string().min(1, "Staff is required"),
    status: z.nativeEnum(AppointmentStatus).optional(),
    outcomeNotes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment?: Appointment | null;
}

export function AppointmentFormDialog({
    open,
    onOpenChange,
    appointment
}: AppointmentFormDialogProps) {
    const isEditing = !!appointment;

    // Hooks
    const createAppointment = useCreateAppointment();
    const updateAppointment = useUpdateAppointment();

    // Fetch data for selects - getting all (limit 100 for now)
    const { data: studentsData } = useStudents({ limit: 100 });
    const { data: usersData } = useUsers({ limit: 100 });

    const students = studentsData?.data || [];
    const staffMembers = usersData?.data || [];

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            scheduledDate: new Date(),
            scheduledTime: '09:00',
            studentId: '',
            staffId: '',
            status: AppointmentStatus.SCHEDULED,
            outcomeNotes: '',
        },
    });

    // Reset when opening/closing or changing appointment
    useEffect(() => {
        if (open) {
            if (appointment) {
                const date = new Date(appointment.scheduledAt);
                const timeStr = format(date, 'HH:mm');

                form.reset({
                    scheduledDate: date,
                    scheduledTime: timeStr,
                    studentId: appointment.studentId,
                    staffId: appointment.staffId,
                    status: appointment.status,
                    outcomeNotes: appointment.outcomeNotes || '',
                });
            } else {
                form.reset({
                    scheduledDate: new Date(),
                    scheduledTime: '09:00',
                    studentId: '',
                    staffId: '',
                    status: AppointmentStatus.SCHEDULED,
                    outcomeNotes: '',
                });
            }
        }
    }, [open, appointment, form]);

    const onSubmit = async (values: AppointmentFormValues) => {
        try {
            // Combine date and time
            const dateTime = new Date(values.scheduledDate);
            const [hours, minutes] = values.scheduledTime.split(':').map(Number);
            dateTime.setHours(hours, minutes, 0, 0);

            const payload = {
                scheduledAt: dateTime.toISOString(),
                studentId: values.studentId,
                staffId: values.staffId,
                status: values.status,
                outcomeNotes: values.outcomeNotes || undefined,
            };

            if (isEditing && appointment) {
                await updateAppointment.mutateAsync({
                    id: appointment.id,
                    data: payload
                });
            } else {
                await createAppointment.mutateAsync(payload);
            }
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    const isLoading = createAppointment.isPending || updateAppointment.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update appointment details.'
                            : 'Schedule a new appointment.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="scheduledDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scheduledTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Student Selection */}
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Student</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? students.find(
                                                            (student) => student.id === field.value
                                                        )?.firstName + ' ' +
                                                        students.find(
                                                            (student) => student.id === field.value
                                                        )?.lastName
                                                        : "Select student"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search student..." />
                                                <CommandEmpty>No student found.</CommandEmpty>
                                                <CommandGroup className="max-h-[300px] overflow-auto">
                                                    {students.map((student) => (
                                                        <CommandItem
                                                            value={student.firstName + ' ' + student.lastName}
                                                            key={student.id}
                                                            onSelect={() => {
                                                                form.setValue("studentId", student.id);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    student.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {student.firstName} {student.lastName}
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                {student.email}
                                                            </span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Staff Selection */}
                        <FormField
                            control={form.control}
                            name="staffId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Staff</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? staffMembers.find(
                                                            (user) => user.id === field.value
                                                        )?.name
                                                        : "Select staff"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search staff..." />
                                                <CommandEmpty>No staff found.</CommandEmpty>
                                                <CommandGroup className="max-h-[300px] overflow-auto">
                                                    {staffMembers.map((user) => (
                                                        <CommandItem
                                                            value={user.name}
                                                            key={user.id}
                                                            onSelect={() => {
                                                                form.setValue("staffId", user.id);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    user.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {user.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status (Only show if editing) */}
                        {isEditing && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={AppointmentStatus.SCHEDULED}>Scheduled</SelectItem>
                                                <SelectItem value={AppointmentStatus.COMPLETED}>Completed</SelectItem>
                                                <SelectItem value={AppointmentStatus.CANCELLED}>Cancelled</SelectItem>
                                                <SelectItem value={AppointmentStatus.PENDING}>Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Outcome Notes */}
                        <FormField
                            control={form.control}
                            name="outcomeNotes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes / Outcome</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Meeting notes or outcome..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Appointment'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
