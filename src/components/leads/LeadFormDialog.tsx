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
import { useCreateLead, useUpdateLead } from '@/hooks/useLeads';
import type { Lead, CreateLeadDto, UpdateLeadDto } from '@/types/lead.types';

// Validation schema
const leadFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, 'First name is required')
        .regex(/^[^\d]+$/, 'Numbers are not allowed in name'),
    lastName: z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .regex(/^[^\d]+$/, 'Numbers are not allowed in name'),
    email: z.string().email('Invalid email address'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    academicBackground: z.string().optional(),
    studyInterests: z.string().optional(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Converted', 'NotInterested', 'NotReachable']).optional(),
    priority: z.enum(['High', 'Medium', 'Low']).optional(),
    source: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead?: Lead | null; // If provided, we're editing; otherwise creating
}

export function LeadFormDialog({ open, onOpenChange, lead }: LeadFormDialogProps) {
    const isEditing = !!lead;

    const createLead = useCreateLead();
    const updateLead = useUpdateLead();

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            academicBackground: '',
            studyInterests: '',
            status: undefined,
            priority: undefined,
            source: '',
        },
    });

    // Reset form when dialog opens/closes or lead changes
    useEffect(() => {
        if (open && lead) {
            form.reset({
                firstName: lead.firstName,
                lastName: lead.lastName,
                email: lead.email,
                phone: lead.phone || '',
                academicBackground: lead.academicBackground || '',
                studyInterests: lead.studyInterests || '',
                status: lead.status,
                priority: lead.priority,
                source: lead.source || '',
            });
        } else if (open && !lead) {
            form.reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                academicBackground: '',
                studyInterests: '',
                status: undefined,
                priority: undefined,
                source: '',
            });
        }
    }, [open, lead, form]);

    const onSubmit = async (values: LeadFormValues) => {
        try {
            if (isEditing && lead) {
                const updateData: UpdateLeadDto = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone || undefined,
                    academicBackground: values.academicBackground || undefined,
                    studyInterests: values.studyInterests || undefined,
                    status: values.status,
                    priority: values.priority,
                };
                await updateLead.mutateAsync({ id: lead.id, data: updateData });
            } else {
                const createData: CreateLeadDto = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone || undefined,
                    academicBackground: values.academicBackground || undefined,
                    studyInterests: values.studyInterests || undefined,
                    priority: values.priority,
                    source: values.source || undefined,
                };
                await createLead.mutateAsync(createData);
            }
            onOpenChange(false);
        } catch {
            // Error handling is done in the hooks
        }
    };

    const isLoading = createLead.isPending || updateLead.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the lead information below.'
                            : 'Fill in the details to create a new lead.'}
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
                                    <FormLabel>Phone *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
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
                                                    <SelectItem value="New">New</SelectItem>
                                                    <SelectItem value="Contacted">Contacted</SelectItem>
                                                    <SelectItem value="Qualified">Qualified</SelectItem>
                                                    <SelectItem value="Converted">Converted</SelectItem>
                                                    <SelectItem value="NotInterested">Not Interested</SelectItem>
                                                    <SelectItem value="NotReachable">Not Reachable</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

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

                            {!isEditing && (
                                <FormField
                                    control={form.control}
                                    name="source"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Source</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Website, Referral, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {isEditing && (
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Website, Referral, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="academicBackground"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Academic Background</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Previous education, degrees, etc."
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
                            name="studyInterests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Study Interests</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Countries, courses, institutions of interest..."
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update Lead' : 'Create Lead'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
