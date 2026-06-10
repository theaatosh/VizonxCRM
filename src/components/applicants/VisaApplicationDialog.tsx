import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog as ShadcnDialog,
    DialogContent as ShadcnDialogContent,
    DialogDescription as ShadcnDialogDescription,
    DialogHeader as ShadcnDialogHeader,
    DialogTitle as ShadcnDialogTitle,
    DialogFooter as ShadcnDialogFooter,
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
import { Loader2, Globe } from 'lucide-react';
import { useVisaTypes } from '@/hooks/useVisaTypes';
import { useCountries } from '@/hooks/useCountries';
import { useCreateVisaApplication } from '@/hooks/useVisaApplications';
import { useWorkflowsByVisaType, useWorkflowVersions } from '@/hooks/useWorkflows';
import type { CourseApplication } from '@/types/course-application.types';

const formSchema = z.object({
    visaTypeId: z.string().min(1, 'Please select a visa type'),
    workflowVersionId: z.string().optional(),
    courseApplicationId: z.string().min(1, 'Please enter a course application ID'),
    destinationCountry: z.string().min(1, 'Please enter a destination country'),
});

interface VisaApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentId: string;
    courseApplications?: CourseApplication[];
}

export const VisaApplicationDialog = ({
    open,
    onOpenChange,
    studentId,
    courseApplications = [],
}: VisaApplicationDialogProps) => {
    const { data: visaTypesData, isLoading: isLoadingVisaTypes } = useVisaTypes({ limit: 100 });
    const { data: countriesData, isLoading: isLoadingCountries } = useCountries({ limit: 100 });
    const createMutation = useCreateVisaApplication();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            visaTypeId: '',
            workflowVersionId: '',
            courseApplicationId: '',
            destinationCountry: '',
        },
    });

    const selectedCountry = form.watch('destinationCountry');
    const selectedVisaTypeId = form.watch('visaTypeId');
    const isCountrySelected = !!selectedCountry;

    const { data: workflowsData, isLoading: isLoadingWorkflows } = useWorkflowsByVisaType(selectedVisaTypeId);
    const workflowForVisaType = workflowsData?.[0];

    const { data: versionsData, isLoading: isLoadingVersions } = useWorkflowVersions(workflowForVisaType?.id || '');
    const versions = versionsData?.data || [];

    useEffect(() => {
        if (versions.length > 0) {
            const activeVersion = versions.find(v => v.status === 'Active') || versions[0];
            if (activeVersion) {
                form.setValue('workflowVersionId', activeVersion.id);
            }
        } else {
            form.setValue('workflowVersionId', '');
        }
    }, [versions, form]);

    const countries = countriesData?.data || [];

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createMutation.mutate({
            studentId,
            visaTypeId: values.visaTypeId,
            courseApplicationId: values.courseApplicationId,
            destinationCountry: values.destinationCountry,
            workflowId: workflowForVisaType?.id,
            workflowVersionId: values.workflowVersionId || undefined,
        }, {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <ShadcnDialog open={open} onOpenChange={onOpenChange}>
            <ShadcnDialogContent className="sm:max-w-[500px]">
                <ShadcnDialogHeader>
                    <ShadcnDialogTitle>Create Visa Application</ShadcnDialogTitle>
                    <ShadcnDialogDescription>
                        Enter the details for the new visa application.
                    </ShadcnDialogDescription>
                </ShadcnDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="destinationCountry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination Country</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select destination country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingCountries ? (
                                                <div className="p-2 text-center">
                                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                </div>
                                            ) : (
                                                countries.map((country) => (
                                                    <SelectItem key={country.id} value={country.name}>
                                                        {country.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="visaTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visa Type</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        value={field.value}
                                        disabled={!isCountrySelected}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isCountrySelected ? "Select visa type" : "Select country first"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingVisaTypes ? (
                                                <div className="p-2 text-center">
                                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                </div>
                                            ) : (
                                                visaTypesData?.data
                                                    .filter(vt => !selectedCountry || vt.country?.name === selectedCountry || !vt.country)
                                                    .map((vt) => (
                                                        <SelectItem key={vt.id} value={vt.id}>
                                                            {vt.name} ({vt.country?.name || 'Any Country'})
                                                        </SelectItem>
                                                    ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedVisaTypeId && workflowForVisaType && (
                            <FormField
                                control={form.control}
                                name="workflowVersionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workflow Version</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select workflow version" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isLoadingVersions || isLoadingWorkflows ? (
                                                    <div className="p-2 text-center">
                                                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                                    </div>
                                                ) : versions.length === 0 ? (
                                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                                        No versions available
                                                    </div>
                                                ) : (
                                                    versions.map((version) => (
                                                        <SelectItem key={version.id} value={version.id}>
                                                            Version {version.versionNumber} ({version.status}) {version.description ? `- ${version.description}` : ''}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="courseApplicationId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Application</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        value={field.value}
                                        disabled={!isCountrySelected}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isCountrySelected ? "Select course application" : "Select country first"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseApplications.length === 0 ? (
                                                <div className="p-2 text-sm text-muted-foreground text-center">
                                                    No course applications found
                                                </div>
                                            ) : (
                                                courseApplications.map((app) => (
                                                    <SelectItem key={app.id} value={app.id}>
                                                        {app.course?.name || 'Unknown Course'} ({app.status})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ShadcnDialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={createMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Application'
                                )}
                            </Button>
                        </ShadcnDialogFooter>
                    </form>
                </Form>
            </ShadcnDialogContent>
        </ShadcnDialog>
    );
};
