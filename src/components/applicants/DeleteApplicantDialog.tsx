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
import { useDeleteStudent } from '@/hooks/useStudents';
import type { Student } from '@/types/student.types';

interface DeleteApplicantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicant: Student | null;
}

export function DeleteApplicantDialog({ open, onOpenChange, applicant }: DeleteApplicantDialogProps) {
    const deleteStudent = useDeleteStudent();

    const handleDelete = async () => {
        if (!applicant) return;

        try {
            await deleteStudent.mutateAsync(applicant.id);
            onOpenChange(false);
        } catch {
            // Error handling is done in the hook
        }
    };

    if (!applicant) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Applicant</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the applicant{' '}
                        <span className="font-semibold text-foreground">
                            {applicant.firstName} {applicant.lastName}
                        </span>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteStudent.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteStudent.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteStudent.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
