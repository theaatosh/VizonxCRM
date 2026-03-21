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
import { useDeleteCourseApplication } from '@/hooks/useCourseApplications';
import { Loader2 } from 'lucide-react';

interface DeleteApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationId: string | null;
    studentName?: string;
}

export function DeleteApplicationDialog({ 
    open, 
    onOpenChange, 
    applicationId, 
    studentName 
}: DeleteApplicationDialogProps) {
    const deleteApplication = useDeleteCourseApplication();

    const handleDelete = async () => {
        if (!applicationId) return;
        try {
            await deleteApplication.mutateAsync(applicationId);
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
                        This will permanently delete the course application
                        {studentName ? ` for ${studentName}` : ''}. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteApplication.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={deleteApplication.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteApplication.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Application'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
