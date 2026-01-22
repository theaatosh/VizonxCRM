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
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateService, useUpdateService } from '@/hooks/useServices';
import type { Service, CreateServiceDto, UpdateServiceDto } from '@/types/service.types';

// Validation schema
const serviceFormSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    description: z.string().optional(),
    price: z.coerce.number().min(0, 'Price must be 0 or greater'),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service?: Service | null;
}

export function ServiceFormDialog({ open, onOpenChange, service }: ServiceFormDialogProps) {
    const isEditing = !!service;

    const createService = useCreateService();
    const updateService = useUpdateService();

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
        },
    });

    // Reset form when dialog opens/closes or service changes
    useEffect(() => {
        if (open && service) {
            form.reset({
                name: service.name,
                description: service.description || '',
                price: service.price,
            });
        } else if (open && !service) {
            form.reset({
                name: '',
                description: '',
                price: 0,
            });
        }
    }, [open, service, form]);

    const onSubmit = async (values: ServiceFormValues) => {
        try {
            if (isEditing && service) {
                const updateData: UpdateServiceDto = {
                    name: values.name,
                    description: values.description || undefined,
                    price: values.price,
                };
                await updateService.mutateAsync({ id: service.id, data: updateData });
            } else {
                const createData: CreateServiceDto = {
                    name: values.name,
                    description: values.description || undefined,
                    price: values.price,
                };
                await createService.mutateAsync(createData);
            }
            onOpenChange(false);
        } catch {
            // Error handling is done in hooks
        }
    };

    const isLoading = createService.isPending || updateService.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the service information below.'
                            : 'Fill in the details to add a new consultancy service.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="University Application" {...field} />
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
                                            placeholder="Describe the service..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Brief description of what this service includes
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (USD) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Service price in US dollars
                                    </FormDescription>
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update Service' : 'Create Service'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
