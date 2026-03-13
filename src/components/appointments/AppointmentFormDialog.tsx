import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, startOfDay, endOfDay } from 'date-fns';
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
import authService from '@/services/auth.service';
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
import { useCreateAppointment, useUpdateAppointment, useBookedSlots } from '@/hooks/useAppointments';
import { useStudents } from '@/hooks/useStudents';
import { useUsers } from '@/hooks/useUsers';
import { useWorkingHours } from '@/hooks/useWorkingHours';
import { Appointment, AppointmentStatus } from '@/types/appointment.types';

// Helper to convert UTC HH:mm to local HH:mm
const utcToLocal = (utcTime: string) => {
    if (!utcTime) return "09:00";
    const [hours, minutes] = utcTime.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    const localHours = date.getHours().toString().padStart(2, '0');
    const localMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${localHours}:${localMinutes}`;
};

// Helper to generate time slots (30 min intervals)
const generateTimeSlots = (start: string, end: string) => {
    const slots = [];
    let current = new Date(`2000-01-01T${start}:00`);
    const final = new Date(`2000-01-01T${end}:00`);

    while (current <= final) {
        slots.push(format(current, 'HH:mm'));
        current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
};

const appointmentFormSchema = z.object({
    scheduledDate: z.date({
        required_error: "A date is required",
    }),
    scheduledTime: z.string().min(1, "Time is required"),
    duration: z.string().min(1, "Duration is required"),
    studentId: z.string().min(1, "Student is required"),
    staffId: z.string().min(1, "Staff is required"),
    status: z.nativeEnum(AppointmentStatus).optional(),
    notes: z.string().optional(),
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

    const currentUser = authService.getUser();
    const currentUserId = currentUser?.id;
    const currentUserRole = (currentUser as any)?.role || (currentUser as any)?.roleName;
    const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'SUPER_ADMIN';

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            scheduledDate: undefined as any as Date,
            scheduledTime: '09:00',
            duration: '60',
            studentId: '',
            staffId: isAdmin ? '' : (currentUserId || ''),
            status: AppointmentStatus.BOOKED,
            notes: '',
        },
    });

    const selectedStaffId = form.watch('staffId');
    const selectedDate = form.watch('scheduledDate');
    const selectedDuration = form.watch('duration');

    // Fetch working hours
    const { data: workingHours } = useWorkingHours();

    // Fetch booked slots for the selected date
    const from = selectedDate ? new Date(new Date(selectedDate).setHours(0, 0, 0, 0)).toISOString() : "";
    const to = selectedDate ? new Date(new Date(selectedDate).setHours(23, 59, 59, 999)).toISOString() : "";

    const { data: bookedSlotsData, isLoading: isBookedSlotsLoading } = useBookedSlots({
        staffId: selectedStaffId,
        from,
        to
    });
    const bookedSlots = bookedSlotsData?.data || [];

    // Filter available time slots based on working hours and existing bookings for the selected day
    const getTimeOptions = () => {
        if (!workingHours || !selectedDate) return generateTimeSlots("09:00", "17:00");

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[selectedDate.getDay()];
        const workingDay = workingHours.find(wh => wh.dayOfWeek === dayName);

        if (!workingDay || !workingDay.isOpen) return [];

        const localOpen = utcToLocal(workingDay.openTime);
        const localClose = utcToLocal(workingDay.closeTime);

        let slots = generateTimeSlots(localOpen, localClose);

        // Filter out slots that overlap with existing bookings for this staff member
        const dayBookings = bookedSlots.filter(slot => {
            // If editing, don't block the current appointment's own time slot
            if (isEditing && appointment && slot.id === appointment.id) return false;

            const slotDate = new Date(slot.scheduledAt);
            return slotDate.getFullYear() === selectedDate.getFullYear() &&
                   slotDate.getMonth() === selectedDate.getMonth() &&
                   slotDate.getDate() === selectedDate.getDate();
        });

        if (dayBookings.length > 0) {
            slots = slots.filter(timeStr => {
                const [h, m] = timeStr.split(':').map(Number);
                const slotStart = new Date(selectedDate);
                slotStart.setHours(h, m, 0, 0);
                
                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotEnd.getMinutes() + parseInt(selectedDuration || '30'));

                // Overlap: (StartA < EndB) && (EndA > StartB)
                return !dayBookings.some(booking => {
                    const bookingStart = new Date(booking.scheduledAt);
                    const bookingEnd = new Date(booking.endTime);
                    return slotStart < bookingEnd && slotEnd > bookingStart;
                });
            });
        }

        return slots;
    };

    const timeOptions = getTimeOptions();

    // Reset scheduledTime when staff or date changes if the current time becomes invalid
    useEffect(() => {
        if (selectedDate && selectedStaffId) {
            const currentSelectedTime = form.getValues('scheduledTime');
            if (currentSelectedTime && !timeOptions.includes(currentSelectedTime)) {
                // If the current time is no longer available, reset it
                // But only if we have options to select from
                if (timeOptions.length > 0) {
                   // form.setValue('scheduledTime', ''); // Keep it or clear it? Better clear to force re-selection
                }
            }
        }
    }, [selectedDate, selectedStaffId, timeOptions, form]);

    // Reset when opening/closing or changing appointment
    useEffect(() => {
        if (open) {
            if (appointment) {
                const date = new Date(appointment.scheduledAt);
                const timeStr = format(date, 'HH:mm');

                form.reset({
                    scheduledDate: date,
                    scheduledTime: timeStr,
                    duration: appointment.duration?.toString() || '60',
                    studentId: appointment.studentId,
                    staffId: appointment.staffId,
                    status: appointment.status,
                    notes: appointment.notes || '',
                });
            } else {
                form.reset({
                    scheduledDate: undefined as any as Date,
                    scheduledTime: '09:00',
                    duration: '60',
                    studentId: '',
                    staffId: isAdmin ? '' : (currentUserId || ''),
                    status: AppointmentStatus.BOOKED,
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

            if (isEditing && appointment) {
                await updateAppointment.mutateAsync({
                    id: appointment.id,
                    data: {
                        scheduledAt: dateTime.toISOString(),
                        studentId: values.studentId,
                        duration: parseInt(values.duration),
                        staffId: values.staffId,
                        status: values.status,
                        notes: values.notes || undefined,
                    }
                });
            } else {
                await createAppointment.mutateAsync({
                    scheduledAt: dateTime.toISOString(),
                    studentId: values.studentId,
                    duration: parseInt(values.duration),
                    staffId: values.staffId,
                    notes: values.notes || undefined,
                });
            }
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    const isLoading = createAppointment.isPending || updateAppointment.isPending;

    // Restriction Logic
    // If pending: can edit date, time, and notes.
    // If other editable status (Booked, etc.): can ONLY edit notes.
    const isPending = appointment?.status === AppointmentStatus.PENDING;
    const isOtherEditable = isEditing && !isPending;

    const isDateDisabled = isOtherEditable || isLoading;
    const isDurationDisabled = isEditing || isLoading; // Per instructions, duration seems to be non-editable in both cases (only date/time/notes for pending, only notes for others)
    const isStudentDisabled = isEditing || isLoading;
    const isStaffDisabled = isEditing || isLoading;
    const isStatusDisabled = isEditing || isLoading;
    const isNotesDisabled = isLoading;

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
                                                    disabled={isStaffDisabled}
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
                                                            disabled={isDateDisabled}
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
                                                    disabled={(date) => {
                                                        // 1. Disable past dates
                                                        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;

                                                        // 2. Disable based on working hours
                                                        if (workingHours) {
                                                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                                            const dayName = dayNames[date.getDay()];
                                                            const workingDay = workingHours.find(wh => wh.dayOfWeek === dayName);
                                                            if (workingDay && !workingDay.isOpen) return true;
                                                        }

                                                        return false;
                                                    }}
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
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value} 
                                            disabled={!selectedDate || isDateDisabled || (timeOptions.length === 0 && !isBookedSlotsLoading) || isBookedSlotsLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select time" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[300px] overflow-y-auto">
                                                {isBookedSlotsLoading ? (
                                                    <SelectItem value="loading" disabled>Loading available slots...</SelectItem>
                                                ) : timeOptions.length > 0 ? (
                                                    timeOptions.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>No slots available</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (minutes)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isDurationDisabled}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select duration" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="15">15 minutes</SelectItem>
                                                <SelectItem value="30">30 minutes</SelectItem>
                                                <SelectItem value="45">45 minutes</SelectItem>
                                                <SelectItem value="60">60 minutes</SelectItem>
                                                <SelectItem value="90">90 minutes</SelectItem>
                                                <SelectItem value="120">120 minutes</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                    disabled={isStudentDisabled}
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? (() => {
                                                            const student = students.find(s => s.id === field.value);
                                                            return student ? `${student.firstName} ${student.lastName}` : "Select student";
                                                        })()
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
                                            disabled={isStatusDisabled}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={AppointmentStatus.BOOKED}>Booked</SelectItem>
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
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Meeting notes..."
                                            className="resize-none"
                                            rows={3}
                                            disabled={isNotesDisabled}
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
