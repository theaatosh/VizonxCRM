import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDeleteLead } from '@/hooks/useLeads';
import type { Lead } from '@/types/lead.types';

interface DeleteLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead | null;
}

export function DeleteLeadDialog({ open, onOpenChange, lead }: DeleteLeadDialogProps) {
    const deleteLead = useDeleteLead();

    const handleDelete = async () => {
        if (!lead) return;

        try {
            await deleteLead.mutateAsync(lead.id);
            onOpenChange(false);
        } catch {
            // Error handling is done in the hook
        }
    };

    if (!lead) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the lead for{' '}
                        <span className="font-semibold text-foreground">
                            {lead.firstName} {lead.lastName}
                        </span>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteLead.isPending}>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteLead.isPending}
                    >
                        {deleteLead.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
