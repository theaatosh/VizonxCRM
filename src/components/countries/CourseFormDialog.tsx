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
import { Switch } from '@/components/ui/switch';
import { useCreateCourse, useUpdateCourse } from '@/hooks/useUniversities';
import type { Course, CreateCourseDto, UpdateCourseDto } from '@/types/university.types';

// Validation schema
const courseFormSchema = z.object({
    name: z.string().min(1, 'Course name is required'),
    description: z.string().optional(),
    duration: z.string().optional(),
    tuitionFee: z.coerce.number().positive().optional().or(z.literal('')),
    currency: z.string().default('USD'),
    level: z.string().optional(),
    department: z.string().optional(),
    isActive: z.boolean().default(true),
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
            description: '',
            duration: '',
            tuitionFee: '',
            currency: 'USD',
            level: '',
            department: '',
            isActive: true,
        },
    });

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open && course) {
            form.reset({
                name: course.name,
                description: course.description || '',
                duration: course.duration || '',
                tuitionFee: course.tuitionFee || '',
                currency: course.currency || 'USD',
                level: course.level || '',
                department: course.department || '',
                isActive: course.isActive,
            });
        } else if (open && !course) {
            form.reset({
                name: '',
                description: '',
                duration: '',
                tuitionFee: '',
                currency: 'USD',
                level: '',
                department: '',
                isActive: true,
            });
        }
    }, [open, course, form]);

    const onSubmit = async (values: CourseFormValues) => {
        try {
            if (isEditing && course) {
                const updateData: UpdateCourseDto = {
                    name: values.name,
                    description: values.description || undefined,
                    duration: values.duration || undefined,
                    tuitionFee: values.tuitionFee ? Number(values.tuitionFee) : undefined,
                    currency: values.currency,
                    level: values.level || undefined,
                    department: values.department || undefined,
                    isActive: values.isActive,
                };
                await updateCourse.mutateAsync({
                    universityId,
                    courseId: course.id,
                    data: updateData
                });
            } else {
                const createData: CreateCourseDto = {
                    name: values.name,
                    description: values.description || undefined,
                    duration: values.duration || undefined,
                    tuitionFee: values.tuitionFee ? Number(values.tuitionFee) : undefined,
                    currency: values.currency,
                    level: values.level || undefined,
                    department: values.department || undefined,
                    isActive: values.isActive,
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

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of the course..."
                                            className="resize-none"
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
                                name="level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Level</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Undergraduate" {...field} />
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
                                            <Input placeholder="3-4 Years" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tuitionFee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tuition Fee</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="15000"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <Input placeholder="USD" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
