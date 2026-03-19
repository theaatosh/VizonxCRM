import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateClass, useUpdateClass } from '@/hooks/useClasses';
import { useUsers } from '@/hooks/useUsers';
import type { Class, CreateClassDto, UpdateClassDto } from '@/types/class.types';

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

const classFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    studentCapacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
    instructorId: z.string().min(1, 'Instructor is required'),
    schedule: z.array(z.object({
        day: z.string().min(1, 'Day is required'),
        startTime: z.string().min(1, 'Start time is required'),
        endTime: z.string().min(1, 'End time is required'),
    })).min(1, 'At least one schedule item is required'),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classData?: Class | null;
}

export function ClassFormDialog({ open, onOpenChange, classData }: ClassFormDialogProps) {
    const isEditing = !!classData;
    const createClass = useCreateClass();
    const updateClass = useUpdateClass();
    const { data: usersData } = useUsers({ limit: 100 });
    
    // Filter users to only show instructors
    const instructors = (usersData?.data || []).filter(user => 
        user.role?.name === 'Instructor' || 
        (user as any).roleName === 'Instructor' || 
        (user as any).role === 'Instructor'
    );

    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classFormSchema),
        defaultValues: {
            name: '',
            description: '',
            studentCapacity: 20,
            instructorId: '',
            schedule: [{ day: 'Monday', startTime: '10:00', endTime: '11:00' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'schedule',
    });

    useEffect(() => {
        if (open && classData) {
            form.reset({
                name: classData.name,
                description: classData.description || '',
                studentCapacity: classData.studentCapacity,
                instructorId: classData.instructorId,
                schedule: classData.schedule.map(item => ({
                    day: item.day,
                    startTime: item.startTime,
                    endTime: item.endTime,
                })),
            });
        } else if (open && !classData) {
            form.reset({
                name: '',
                description: '',
                studentCapacity: 20,
                instructorId: '',
                schedule: [{ day: 'Monday', startTime: '10:00', endTime: '11:00' }],
            });
        }
    }, [open, classData, form]);

    const onSubmit = async (values: ClassFormValues) => {
        try {
            const payload: CreateClassDto = {
                name: values.name,
                description: values.description,
                studentCapacity: values.studentCapacity,
                instructorId: values.instructorId,
                courseId: null, // Always pass null as requested
                schedule: values.schedule as any[], // Casting to avoid lint error with Zod inference
            };

            if (isEditing && classData) {
                await updateClass.mutateAsync({ id: classData.id, data: payload as UpdateClassDto });
            } else {
                await createClass.mutateAsync(payload);
            }
            onOpenChange(false);
        } catch {
            // Error handling is in hooks
        }
    };

    const isLoading = createClass.isPending || updateClass.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Class' : 'Create New Class'}</DialogTitle>
                    <DialogDescription>
                        Set up the schedule and details for this academic class.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 sm:col-span-2">
                                        <FormLabel>Class Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. IELTS Morning Batch" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 sm:col-span-2">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Weekday class for IELTS preparation." 
                                                className="resize-none" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="studentCapacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Capacity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="instructorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instructor</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select instructor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {instructors.map((user) => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-base font-semibold">Schedule</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ day: 'Monday', startTime: '10:00', endTime: '11:00' })}
                                    className="h-8 gap-1"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Day
                                </Button>
                            </div>
                            
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-7 gap-2 p-3 border rounded-lg bg-muted/30 items-end">
                                    <div className="col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`schedule.${index}.day`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Day</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-8">
                                                                <SelectValue placeholder="Day" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {DAYS_OF_WEEK.map((day) => (
                                                                <SelectItem key={day} value={day}>
                                                                    {day}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`schedule.${index}.startTime`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Start</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" className="h-8 px-2" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2 flex gap-2 items-center">
                                        <FormField
                                            control={form.control}
                                            name={`schedule.${index}.endTime`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="text-xs">End</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" className="h-8 px-2" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {form.formState.errors.schedule?.message && (
                                <p className="text-sm font-medium text-destructive">
                                    {form.formState.errors.schedule.message}
                                </p>
                            )}
                        </div>

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
                                {isLoading ? 'Saving...' : isEditing ? 'Update Class' : 'Create Class'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
