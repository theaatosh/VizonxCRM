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
import { useDeleteClass } from "@/hooks/useClasses";
import { toast } from "sonner";
import type { Class } from "@/types/class.types";

interface DeleteClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classData: Class | null;
}

export function DeleteClassDialog({ open, onOpenChange, classData }: DeleteClassDialogProps) {
    const deleteClass = useDeleteClass();

    const handleDelete = async () => {
        if (!classData) return;
        
        try {
            await deleteClass.mutateAsync(classData.id);
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
                        This will permanently delete the {classData?.level} class scheduled on{" "}
                        {classData?.schedule.days.join(", ")} at {classData?.schedule.time}.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteClass.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={deleteClass.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteClass.isPending ? "Deleting..." : "Delete Class"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
