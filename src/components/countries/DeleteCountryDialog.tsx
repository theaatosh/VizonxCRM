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
import { useDeleteCountry } from '@/hooks/useCountries';
import type { Country } from '@/types/country.types';

interface DeleteCountryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    country: Country | null;
}

export function DeleteCountryDialog({ open, onOpenChange, country }: DeleteCountryDialogProps) {
    const deleteCountry = useDeleteCountry();

    const handleDelete = async () => {
        if (!country) return;

        try {
            await deleteCountry.mutateAsync(country.id);
            onOpenChange(false);
        } catch {
            // Error handling is done in the hook
        }
    };

    if (!country) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Country</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            {country.name} ({country.code})
                        </span>
                        ? This action cannot be undone and will remove all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteCountry.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteCountry.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteCountry.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
