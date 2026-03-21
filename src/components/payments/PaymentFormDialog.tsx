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
import { useCreatePayment, useUpdatePayment } from '@/hooks/usePayments';
import { useStudents } from '@/hooks/useStudents';
import { useServices } from '@/hooks/useServices';
import type { Payment, CreatePaymentDto, UpdatePaymentDto } from '@/types/payment.types';
import { Loader2 } from 'lucide-react';

const paymentFormSchema = z.object({
    studentId: z.string().min(1, 'Student is required'),
    serviceId: z.string().optional(),
    totalAmount: z.coerce.number().min(0, 'Total amount must be positive'),
    paidAmount: z.coerce.number().min(0, 'Paid amount must be positive'),
    paymentType: z.enum(['Full', 'Advance', 'Partial', 'Balance']),
    paymentMethod: z.enum(['Cash', 'BankTransfer', 'Card', 'Cheque', 'Online', 'Other']),
    status: z.enum(['Pending', 'Completed', 'Failed', 'Refunded', 'PartiallyPaid', 'Overdue']),
    currency: z.string().min(1, 'Currency is required'),
    invoiceNumber: z.string().optional(),
    transactionReference: z.string().optional(),
    notes: z.string().optional(),
    paymentDate: z.string().optional(),
    dueDate: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payment?: Payment | null;
}

export function PaymentFormDialog({ open, onOpenChange, payment }: PaymentFormDialogProps) {
    const isEditing = !!payment;
    const createPayment = useCreatePayment();
    const updatePayment = useUpdatePayment();

    const { data: studentsData, isLoading: isLoadingStudents } = useStudents({ limit: 100 });
    const { data: servicesData, isLoading: isLoadingServices } = useServices({ limit: 100 });

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            studentId: '',
            serviceId: '',
            totalAmount: 0,
            paidAmount: 0,
            paymentType: 'Full',
            paymentMethod: 'Cash',
            status: 'Pending',
            currency: 'USD',
            invoiceNumber: '',
            transactionReference: '',
            notes: '',
            paymentDate: new Date().toISOString().split('T')[0],
            dueDate: '',
        },
    });

    const totalAmount = form.watch('totalAmount');
    const paidAmount = form.watch('paidAmount');
    const serviceId = form.watch('serviceId');
    const remainingAmount = Math.max(0, (totalAmount || 0) - (paidAmount || 0));

    // Auto-fill total amount from service price
    useEffect(() => {
        if (serviceId && serviceId !== 'none' && servicesData) {
            const selectedService = servicesData.data.find(s => s.id === serviceId);
            if (selectedService) {
                // Only auto-fill if we're creating a new payment OR if the service selection has changed
                if (!isEditing || (payment && serviceId !== payment.serviceId)) {
                    form.setValue('totalAmount', selectedService.price);
                }
            }
        }
    }, [serviceId, servicesData, form, isEditing, payment]);

    useEffect(() => {
        if (open && payment) {
            form.reset({
                studentId: payment.studentId,
                serviceId: payment.serviceId || '',
                totalAmount: payment.totalAmount,
                paidAmount: payment.paidAmount,
                paymentType: payment.paymentType,
                paymentMethod: payment.paymentMethod,
                status: payment.status,
                currency: payment.currency,
                invoiceNumber: payment.invoiceNumber,
                transactionReference: payment.transactionReference || '',
                notes: payment.notes || '',
                paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '',
                dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : '',
            });
        } else if (open && !payment) {
            form.reset({
                studentId: '',
                serviceId: '',
                totalAmount: 0,
                paidAmount: 0,
                paymentType: 'Full',
                paymentMethod: 'Cash',
                status: 'Pending',
                currency: 'USD',
                invoiceNumber: '',
                transactionReference: '',
                notes: '',
                paymentDate: new Date().toISOString().split('T')[0],
                dueDate: '',
            });
        }
    }, [open, payment, form]);

    const onSubmit = async (values: PaymentFormValues) => {
        try {
            if (isEditing && payment) {
                await updatePayment.mutateAsync({ 
                    id: payment.id, 
                    data: {
                        ...values,
                        serviceId: values.serviceId === 'none' ? undefined : values.serviceId
                    } as UpdatePaymentDto 
                });
            } else {
                await createPayment.mutateAsync({
                    ...values,
                    serviceId: values.serviceId === 'none' ? undefined : values.serviceId
                } as CreatePaymentDto);
            }
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation hooks
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Update Payment Record' : 'Record New Payment'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Modify the existing payment details.' : 'Create a new payment record for an applicant.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Student Selection */}
                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Applicant</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select applicant" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isLoadingStudents ? (
                                                    <div className="flex items-center justify-center p-2">
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Loading...
                                                    </div>
                                                ) : (
                                                    studentsData?.data.map((student) => (
                                                        <SelectItem key={student.id} value={student.id}>
                                                            {student.firstName} {student.lastName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Service Selection */}
                            <FormField
                                control={form.control}
                                name="serviceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service (Optional)</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select service" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {isLoadingServices ? (
                                                    <div className="flex items-center justify-center p-2">
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Loading...
                                                    </div>
                                                ) : (
                                                    servicesData?.data.map((service) => (
                                                        <SelectItem key={service.id} value={service.id}>
                                                            {service.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Amounts */}
                            <FormField
                                control={form.control}
                                name="totalAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Amount</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                <Input type="number" step="0.01" className="pl-7" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paidAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paid Amount</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                <Input type="number" step="0.01" className="pl-7" {...field} />
                                            </div>
                                        </FormControl>
                                        <div className="mt-1 text-xs text-muted-foreground font-medium">
                                            Remaining: <span className="text-primary font-bold">${remainingAmount.toFixed(2)}</span>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Payment Type */}
                            <FormField
                                control={form.control}
                                name="paymentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Full">Full</SelectItem>
                                                <SelectItem value="Advance">Advance</SelectItem>
                                                <SelectItem value="Partial">Partial</SelectItem>
                                                <SelectItem value="Balance">Balance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Payment Method */}
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="BankTransfer">Bank Transfer</SelectItem>
                                                <SelectItem value="Card">Card</SelectItem>
                                                <SelectItem value="Cheque">Cheque</SelectItem>
                                                <SelectItem value="Online">Online</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue="Pending">
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Failed">Failed</SelectItem>
                                                <SelectItem value="Refunded">Refunded</SelectItem>
                                                <SelectItem value="PartiallyPaid">Partially Paid</SelectItem>
                                                <SelectItem value="Overdue">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Currency */}
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Dates */}
                            <FormField
                                control={form.control}
                                name="paymentDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Invoice Number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Auto-generated if empty" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="transactionReference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction Reference</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ref #, Txn ID..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Add any additional details about the payment..." 
                                            className="resize-none"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={createPayment.isPending || updatePayment.isPending}
                                className="min-w-[100px]"
                            >
                                {(createPayment.isPending || updatePayment.isPending) ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    isEditing ? 'Update Payment' : 'Record Payment'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
