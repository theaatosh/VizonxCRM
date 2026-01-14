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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCreateCountry, useUpdateCountry } from '@/hooks/useCountries';
import type { Country, CreateCountryDto, UpdateCountryDto } from '@/types/country.types';

// Validation schema
const countryFormSchema = z.object({
    name: z.string().min(1, 'Country name is required'),
    code: z.string().min(2, 'Country code must be 2-3 characters').max(3, 'Country code must be 2-3 characters'),
    isActive: z.boolean().default(true),
});

type CountryFormValues = z.infer<typeof countryFormSchema>;

interface CountryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    country?: Country | null;
}

export function CountryFormDialog({ open, onOpenChange, country }: CountryFormDialogProps) {
    const isEditing = !!country;

    const createCountry = useCreateCountry();
    const updateCountry = useUpdateCountry();

    const form = useForm<CountryFormValues>({
        resolver: zodResolver(countryFormSchema),
        defaultValues: {
            name: '',
            code: '',
            isActive: true,
        },
    });

    // Reset form when dialog opens/closes or country changes
    useEffect(() => {
        if (open && country) {
            form.reset({
                name: country.name,
                code: country.code,
                isActive: country.isActive,
            });
        } else if (open && !country) {
            form.reset({
                name: '',
                code: '',
                isActive: true,
            });
        }
    }, [open, country, form]);

    const onSubmit = async (values: CountryFormValues) => {
        try {
            if (isEditing && country) {
                const updateData: UpdateCountryDto = {
                    name: values.name,
                    code: values.code.toUpperCase(),
                    isActive: values.isActive,
                };
                await updateCountry.mutateAsync({ id: country.id, data: updateData });
            } else {
                const createData: CreateCountryDto = {
                    name: values.name,
                    code: values.code.toUpperCase(),
                    isActive: values.isActive,
                };
                await createCountry.mutateAsync(createData);
            }
            onOpenChange(false);
        } catch {
            // Error handling is done in hooks
        }
    };

    const isLoading = createCountry.isPending || updateCountry.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Country' : 'Add New Country'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the country information below.'
                            : 'Fill in the details to add a new country.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="United Kingdom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country Code *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="UK"
                                            maxLength={3}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        ISO country code (2-3 characters, e.g., US, UK, AUS)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                        <FormDescription>
                                            Enable this country for selection in forms
                                        </FormDescription>
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
                                {isLoading ? 'Saving...' : isEditing ? 'Update Country' : 'Create Country'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
