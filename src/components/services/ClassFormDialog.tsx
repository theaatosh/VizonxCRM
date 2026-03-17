import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
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
    level: z.string().min(1, 'Level is required'),
    instructorId: z.string().min(1, 'Instructor is required'),
    days: z.array(z.string()).min(1, 'At least one day is required'),
    time: z.string().min(1, 'Time is required'),
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
            level: 'Beginner',
            instructorId: '',
            days: ['Monday'],
            time: '10:00',
        },
    });

    useEffect(() => {
        if (open && classData) {
            form.reset({
                level: classData.level,
                instructorId: classData.instructorId,
                days: classData.schedule.days,
                time: classData.schedule.time,
            });
        } else if (open && !classData) {
            form.reset({
                level: 'Beginner',
                instructorId: '',
                days: ['Monday'],
                time: '10:00',
            });
        }
    }, [open, classData, form]);

    const onSubmit = async (values: ClassFormValues) => {
        try {
            const payload = {
                level: values.level,
                instructorId: values.instructorId,
                courseId: null, // As requested: course id is optional send null value
                schedule: {
                    days: values.days,
                    time: values.time,
                    // timezone is NOT added as requested
                },
            };

            if (isEditing && classData) {
                await updateClass.mutateAsync({ id: classData.id, data: payload as UpdateClassDto });
            } else {
                await createClass.mutateAsync(payload as CreateClassDto);
            }
            onOpenChange(false);
        } catch {
            // Error handling is in hooks
        }
    };

    const isLoading = createClass.isPending || updateClass.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Class' : 'Create New Class'}</DialogTitle>
                    <DialogDescription>
                        Set up the schedule and instructor for this academic class.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
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

                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="days"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Schedule Days</FormLabel>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <FormField
                                                key={day}
                                                control={form.control}
                                                name="days"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={day}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(day)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, day])
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (value) => value !== day
                                                                                  )
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">
                                                                {day}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update Class' : 'Create Class'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
