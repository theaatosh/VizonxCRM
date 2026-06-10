import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import { Loader2 } from 'lucide-react';
import { useUpdateVisaApplication } from '@/hooks/useVisaApplications';
import type { VisaApplication } from '@/types/visaApplication.types';

const formSchema = z.object({
    status: z.string().min(1, 'Please select a status'),
    decisionDate: z.string().optional(),
    submissionDate: z.string().optional(),
    destinationCountry: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditVisaApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    visa: VisaApplication | null;
}

const VISA_STATUSES = ['Pending', 'Submitted', 'UnderReview', 'Approved', 'Rejected'] as const;

export const EditVisaApplicationDialog = ({
    open,
    onOpenChange,
    visa,
}: EditVisaApplicationDialogProps) => {
    const updateMutation = useUpdateVisaApplication();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: '',
            decisionDate: '',
            submissionDate: '',
            destinationCountry: '',
        },
    });

    useEffect(() => {
        if (visa) {
            form.reset({
                status: visa.status || '',
                decisionDate: visa.decisionDate
                    ? format(new Date(visa.decisionDate), 'yyyy-MM-dd')
                    : '',
                submissionDate: visa.submissionDate
                    ? format(new Date(visa.submissionDate), 'yyyy-MM-dd')
                    : '',
                destinationCountry: visa.destinationCountry || '',
            });
        }
    }, [visa, form]);

    const onSubmit = (values: FormValues) => {
        if (!visa) return;

        updateMutation.mutate(
            {
                id: visa.id,
                data: {
                    status: values.status || undefined,
                    decisionDate: values.decisionDate
                        ? new Date(values.decisionDate).toISOString()
                        : null,
                    submissionDate: values.submissionDate
                        ? new Date(values.submissionDate).toISOString()
                        : undefined,
                    destinationCountry: values.destinationCountry || undefined,
                },
            },
            {
                onSuccess: () => {
                    form.reset();
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Edit Visa Application</DialogTitle>
                    <DialogDescription>
                        Update the status, dates, or other details for this visa application.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                                            {VISA_STATUSES.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
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
                            name="destinationCountry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination Country</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter destination country"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="submissionDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Submission Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="decisionDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Decision Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={updateMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
