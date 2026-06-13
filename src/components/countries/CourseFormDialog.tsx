import { useEffect, useState } from 'react';
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
import { Plus, X } from 'lucide-react';
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

const parseList = (val: unknown): string[] => {
    if (!val) return [''];
    if (Array.isArray(val)) return val.length ? val : [''];
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed.length ? parsed : [''];
        } catch {}
        return val.trim() ? val.split(',').map(s => s.trim()) : [''];
    }
    if (typeof val === 'object') {
        const values = Object.values(val as Record<string, unknown>);
        return values.length ? values.map(String) : [''];
    }
    return [''];
};

const formatList = (items: string[]): string => {
    const filtered = items.filter(s => s.trim());
    return filtered.length ? JSON.stringify(filtered) : '';
};

export function CourseFormDialog({
    open,
    onOpenChange,
    course,
    universityId
}: CourseFormDialogProps) {
    const isEditing = !!course;

    const createCourse = useCreateCourse();
    const updateCourse = useUpdateCourse();

    const [intakeList, setIntakeList] = useState<string[]>(['']);
    const [deadlineList, setDeadlineList] = useState<string[]>(['']);

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

    const toString = (val: unknown): string => {
        if (typeof val === 'string') return val;
        if (val == null) return '';
        return JSON.stringify(val);
    };

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open && course) {
            const rawIntake = course.intakePeriods;
            const rawDeadlines = course.deadlines;
            form.reset({
                name: course.name,
                fees: typeof course.fees === 'string' ? parseFloat(course.fees) : course.fees,
                duration: toString(course.duration),
                requirements: toString(course.requirements),
                intakePeriods: toString(rawIntake),
                deadlines: toString(rawDeadlines),
            });
            setIntakeList(parseList(rawIntake));
            setDeadlineList(parseList(rawDeadlines));
        } else if (open && !course) {
            form.reset({
                name: '',
                fees: 0,
                duration: '',
                requirements: '',
                intakePeriods: '',
                deadlines: '',
            });
            setIntakeList(['']);
            setDeadlineList(['']);
        }
    }, [open, course, form]);

    const onSubmit = async (values: CourseFormValues) => {
        try {
            const intakeStr = formatList(intakeList);
            const deadlineStr = formatList(deadlineList);
            const payload = {
                name: values.name,
                fees: values.fees,
                duration: values.duration || undefined,
                requirements: values.requirements || undefined,
                intakePeriods: intakeStr || undefined,
                deadlines: deadlineStr || undefined,
            };
            if (isEditing && course) {
                await updateCourse.mutateAsync({
                    universityId,
                    courseId: course.id,
                    data: payload
                });
            } else {
                await createCourse.mutateAsync({
                    universityId,
                    data: payload
                });
            }
            onOpenChange(false);
        } catch {
            // Error handling is done in hooks
        }
    };

    const handleIntakeChange = (index: number, value: string) => {
        setIntakeList(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const addIntake = () => setIntakeList(prev => [...prev, '']);
    const removeIntake = (index: number) => {
        setIntakeList(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeadlineChange = (index: number, value: string) => {
        setDeadlineList(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const addDeadline = () => setDeadlineList(prev => [...prev, '']);
    const removeDeadline = (index: number) => {
        setDeadlineList(prev => prev.filter((_, i) => i !== index));
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
                            <FormItem>
                                <FormLabel>Intake Periods</FormLabel>
                                <div className="space-y-2">
                                    {intakeList.map((item, index) => (
                                        <div key={index} className="flex items-center gap-1">
                                            <Input
                                                value={item}
                                                onChange={(e) => handleIntakeChange(index, e.target.value)}
                                                placeholder="e.g. Fall 2024"
                                                className="flex-1"
                                            />
                                            {intakeList.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeIntake(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-1 text-xs"
                                        onClick={addIntake}
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add Intake Period
                                    </Button>
                                </div>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Deadlines</FormLabel>
                                <div className="space-y-2">
                                    {deadlineList.map((item, index) => (
                                        <div key={index} className="flex items-center gap-1">
                                            <Input
                                                value={item}
                                                onChange={(e) => handleDeadlineChange(index, e.target.value)}
                                                placeholder="e.g. March 15"
                                                className="flex-1"
                                            />
                                            {deadlineList.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeDeadline(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-1 text-xs"
                                        onClick={addDeadline}
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add Deadline
                                    </Button>
                                </div>
                            </FormItem>
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
