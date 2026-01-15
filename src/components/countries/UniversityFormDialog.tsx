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
import { useCreateUniversity, useUpdateUniversity } from '@/hooks/useUniversities';
import type { University, CreateUniversityDto, UpdateUniversityDto } from '@/types/university.types';

// Validation schema - only fields supported by backend
const universityFormSchema = z.object({
    name: z.string().min(1, 'University name is required'),
    description: z.string().optional(),
});

type UniversityFormValues = z.infer<typeof universityFormSchema>;

interface UniversityFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    university?: University | null;
    countryId: string;
}

export function UniversityFormDialog({
    open,
    onOpenChange,
    university,
    countryId
}: UniversityFormDialogProps) {
    const isEditing = !!university;

    const createUniversity = useCreateUniversity();
    const updateUniversity = useUpdateUniversity();

    const form = useForm<UniversityFormValues>({
        resolver: zodResolver(universityFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open && university) {
            form.reset({
                name: university.name,
                description: university.description || '',
            });
        } else if (open && !university) {
            form.reset({
                name: '',
                description: '',
            });
        }
    }, [open, university, form]);

    const onSubmit = async (values: UniversityFormValues) => {
        try {
            if (isEditing && university) {
                const updateData: UpdateUniversityDto = {
                    name: values.name,
                    description: values.description || undefined,
                };
                await updateUniversity.mutateAsync({ id: university.id, data: updateData });
            } else {
                const createData: CreateUniversityDto = {
                    name: values.name,
                    countryId,
                    description: values.description || undefined,
                };
                await createUniversity.mutateAsync(createData);
            }
            onOpenChange(false);
        } catch {
            // Error handling is done in hooks
        }
    };

    const isLoading = createUniversity.isPending || updateUniversity.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit University' : 'Add New University'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the university information below.'
                            : 'Fill in the details to add a new university.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>University Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="University of Oxford" {...field} />
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
                                            placeholder="Brief description of the university..."
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
