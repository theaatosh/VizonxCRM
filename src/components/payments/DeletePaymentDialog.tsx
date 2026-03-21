import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeletePayment } from '@/hooks/usePayments';
import { Loader2 } from 'lucide-react';

interface DeletePaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    paymentId: string | null;
    invoiceNumber?: string;
}

export function DeletePaymentDialog({ 
    open, 
    onOpenChange, 
    paymentId, 
    invoiceNumber 
}: DeletePaymentDialogProps) {
    const deletePayment = useDeletePayment();

    const handleDelete = async () => {
        if (!paymentId) return;
        try {
            await deletePayment.mutateAsync(paymentId);
            onOpenChange(false);
        } catch (error) {
            // Error handled by mutation hook
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the payment record
                        {invoiceNumber ? ` for invoice ${invoiceNumber}` : ''}. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deletePayment.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={deletePayment.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deletePayment.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Record'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
