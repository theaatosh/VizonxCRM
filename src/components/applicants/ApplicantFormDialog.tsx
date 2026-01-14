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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateStudent, useUpdateStudent } from '@/hooks/useStudents';
import type { Student, CreateStudentDto, UpdateStudentDto } from '@/types/student.types';

// Validation schema
const applicantFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    priority: z.enum(['High', 'Medium', 'Low']).optional(),
    status: z.enum(['Prospective', 'Enrolled', 'Alumni']).optional(),
    academicBackground: z.string().optional(),
    testScores: z.string().optional(),
});

type ApplicantFormValues = z.infer<typeof applicantFormSchema>;

interface ApplicantFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicant?: Student | null;
}

export function ApplicantFormDialog({ open, onOpenChange, applicant }: ApplicantFormDialogProps) {
    const isEditing = !!applicant;

    const createStudent = useCreateStudent();
    const updateStudent = useUpdateStudent();

    const form = useForm<ApplicantFormValues>({
        resolver: zodResolver(applicantFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            priority: undefined,
            status: undefined,
            academicBackground: '',
            testScores: '',
        },
    });

    // Reset form when dialog opens/closes or applicant changes
    useEffect(() => {
        if (open && applicant) {
            form.reset({
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                email: applicant.email,
                phone: applicant.phone || '',
                priority: applicant.priority,
                status: applicant.status,
                academicBackground: applicant.academicRecords
                    ? JSON.stringify(applicant.academicRecords, null, 2)
                    : '',
                testScores: applicant.testScores
                    ? JSON.stringify(applicant.testScores, null, 2)
                    : '',
            });
        } else if (open && !applicant) {
            form.reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                priority: undefined,
                status: undefined,
                academicBackground: '',
                testScores: '',
            });
        }
    }, [open, applicant, form]);

    const parseJsonSafe = (str: string | undefined): Record<string, unknown> | undefined => {
        if (!str || str.trim() === '') return undefined;
        try {
            return JSON.parse(str);
        } catch {
            return { raw: str };
        }
    };

    const onSubmit = async (values: ApplicantFormValues) => {
        try {
            if (isEditing && applicant) {
                const updateData: UpdateStudentDto = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone || undefined,
                    priority: values.priority,
                    status: values.status,
                    academicRecords: parseJsonSafe(values.academicBackground),
                    testScores: parseJsonSafe(values.testScores),
                };
                await updateStudent.mutateAsync({ id: applicant.id, data: updateData });
            } else {
                const createData: CreateStudentDto = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone || undefined,
                    priority: values.priority,
                    academicRecords: parseJsonSafe(values.academicBackground),
                    testScores: parseJsonSafe(values.testScores),
                };
                await createStudent.mutateAsync(createData);
            }
            onOpenChange(false);
        } catch {
            // Error handling is done in hooks
        }
    };

    const isLoading = createStudent.isPending || updateStudent.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Applicant' : 'Add New Applicant'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the applicant information below.'
                            : 'Fill in the details to register a new applicant.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john.doe@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 234 567 890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isEditing && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Prospective">Prospective</SelectItem>
                                                    <SelectItem value="Enrolled">Enrolled</SelectItem>
                                                    <SelectItem value="Alumni">Alumni</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="academicBackground"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Academic Background</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Previous education, degrees, GPA, etc."
                                            className="resize-none min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="testScores"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Test Scores</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="IELTS, TOEFL, GRE, etc."
                                            className="resize-none min-h-[80px]"
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update Applicant' : 'Create Applicant'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
