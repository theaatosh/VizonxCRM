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
import { useDeleteService } from '@/hooks/useServices';
import type { Service } from '@/types/service.types';

interface DeleteServiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: Service | null;
}

export function DeleteServiceDialog({ open, onOpenChange, service }: DeleteServiceDialogProps) {
    const deleteService = useDeleteService();

    const handleDelete = async () => {
        if (!service) return;

        try {
            await deleteService.mutateAsync(service.id);
            onOpenChange(false);
        } catch {
            // Error handling is done in the hook
        }
    };

    if (!service) return null;

    // Format price for display
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(service.price);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Service</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            {service.name}
                        </span>
                        {' '}({formattedPrice})?{' '}
                        This action cannot be undone and will remove all associated student assignments.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteService.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteService.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteService.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
