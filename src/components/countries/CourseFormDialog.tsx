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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCourse, useUpdateCourse } from '@/hooks/useUniversities';
import type { Course, CreateCourseDto, UpdateCourseDto } from '@/types/university.types';

// Validation schema - matches backend API
const courseFormSchema = z.object({
    name: z.string().min(1, 'Course name is required'),
    fees: z.coerce.number().min(0, 'Fees must be a positive number'),
    duration: z.string().optional(),
    requirements: z.string().optional(),
    intakePeriods: z.string().optional(),
    deadlines: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course?: Course | null;
    universityId: string;
}

export function CourseFormDialog({
    open,
    onOpenChange,
    course,
    universityId
}: CourseFormDialogProps) {
    const isEditing = !!course;

    const createCourse = useCreateCourse();
    const updateCourse = useUpdateCourse();

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            name: '',
            fees: 0,
            duration: '',
            requirements: '',
            intakePeriods: '',
            deadlines: '',
        },
    });

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open && course) {
            form.reset({
                name: course.name,
                fees: typeof course.fees === 'string' ? parseFloat(course.fees) : course.fees,
                duration: course.duration || '',
                requirements: course.requirements || '',
                intakePeriods: course.intakePeriods || '',
                deadlines: course.deadlines || '',
            });
        } else if (open && !course) {
            form.reset({
                name: '',
                fees: 0,
                duration: '',
                requirements: '',
                intakePeriods: '',
                deadlines: '',
            });
        }
    }, [open, course, form]);

    const onSubmit = async (values: CourseFormValues) => {
        try {
            if (isEditing && course) {
                const updateData: UpdateCourseDto = {
                    name: values.name,
                    fees: values.fees,
                    duration: values.duration || undefined,
                    requirements: values.requirements || undefined,
                    intakePeriods: values.intakePeriods || undefined,
                    deadlines: values.deadlines || undefined,
                };
                await updateCourse.mutateAsync({
                    universityId,
                    courseId: course.id,
                    data: updateData
                });
            } else {
                const createData: CreateCourseDto = {
                    name: values.name,
                    fees: values.fees,
                    duration: values.duration || undefined,
                    requirements: values.requirements || undefined,
                    intakePeriods: values.intakePeriods || undefined,
                    deadlines: values.deadlines || undefined,
                };
                await createCourse.mutateAsync({
                    universityId,
                    data: createData
                });
            }
            onOpenChange(false);
        } catch {
            // Error handling is done in hooks
        }
    };

    const isLoading = createCourse.isPending || updateCourse.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the course information below.'
                            : 'Fill in the details to add a new course.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="BSc Computer Science" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fees (USD) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="15000"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <FormControl>
                                            <Input placeholder="4 Years" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="requirements"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requirements</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Entry requirements for this course..."
                                            className="resize-none"
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="intakePeriods"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Intake Periods</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Fall, Spring" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="deadlines"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deadlines</FormLabel>
                                        <FormControl>
                                            <Input placeholder="March 15, October 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
