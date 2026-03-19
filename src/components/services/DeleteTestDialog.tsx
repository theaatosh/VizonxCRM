import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTest } from "@/hooks/useTests";
import type { Test } from "@/types/test.types";

interface DeleteTestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testData: Test | null;
}

export function DeleteTestDialog({ open, onOpenChange, testData }: DeleteTestDialogProps) {
    const deleteTest = useDeleteTest();

    const handleDelete = async () => {
        if (!testData) return;
        
        try {
            await deleteTest.mutateAsync(testData.id);
            onOpenChange(false);
        } catch {
            // Error is handled in the hook (toast)
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the {testData?.name} test.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteTest.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={deleteTest.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteTest.isPending ? "Deleting..." : "Delete Test"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
