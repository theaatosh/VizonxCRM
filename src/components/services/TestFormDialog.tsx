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
import { Textarea } from '@/components/ui/textarea';
import { useCreateTest, useUpdateTest } from '@/hooks/useTests';
import type { Test, CreateTestDto, UpdateTestDto } from '@/types/test.types';

const TEST_TYPES = [
    'IELTS',
    'TOEFL',
    'GRE',
    'GMAT',
    'SAT',
    'Other'
];

const testFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    description: z.string().min(1, 'Description is required'),
    studentCapacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
});

type TestFormValues = z.infer<typeof testFormSchema>;

interface TestFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testData?: Test | null;
}

export function TestFormDialog({ open, onOpenChange, testData }: TestFormDialogProps) {
    const isEditing = !!testData;
    const createTest = useCreateTest();
    const updateTest = useUpdateTest();

    const form = useForm<TestFormValues>({
        resolver: zodResolver(testFormSchema),
        defaultValues: {
            name: '',
            type: '',
            description: '',
            studentCapacity: 100,
        },
    });

    useEffect(() => {
        if (open && testData) {
            form.reset({
                name: testData.name,
                type: testData.type,
                description: testData.description,
                studentCapacity: testData.studentCapacity,
            });
        } else if (open && !testData) {
            form.reset({
                name: '',
                type: '',
                description: '',
                studentCapacity: 100,
            });
        }
    }, [open, testData, form]);

    const onSubmit = async (values: TestFormValues) => {
        try {
            const payload: CreateTestDto = {
                name: values.name,
                type: values.type,
                description: values.description,
                studentCapacity: values.studentCapacity,
            };

            if (isEditing && testData) {
                await updateTest.mutateAsync({ id: testData.id, data: payload as UpdateTestDto });
            } else {
                await createTest.mutateAsync(payload);
            }
            onOpenChange(false);
        } catch {
            // Error handling is in hooks
        }
    };

    const isLoading = createTest.isPending || updateTest.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Test' : 'Create New Test'}</DialogTitle>
                    <DialogDescription>
                        Configure the details for the testing system.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Test Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. IELTS Academic" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Test Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TEST_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="International English Language Testing System" 
                                            className="resize-none" 
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update Test' : 'Create Test'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
