import { useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useDeprecateVersion } from "@/hooks/useWorkflows";

interface DeprecateVersionDialogProps {
    versionId: string | null;
    onClose: () => void;
}

export const DeprecateVersionDialog = ({ versionId, onClose }: DeprecateVersionDialogProps) => {
    const [reason, setReason] = useState("");
    const deprecateMutation = useDeprecateVersion();

    const handleConfirm = async () => {
        if (!versionId) return;
        await deprecateMutation.mutateAsync({
            versionId,
            deprecatedReason: reason || "Archived",
            allowMigration: true,
        });
        setReason("");
        onClose();
    };

    return (
        <AlertDialog open={!!versionId} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archive Version</AlertDialogTitle>
                    <AlertDialogDescription>
                        This version will be marked as archived. Existing applications using it
                        will not be affected.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="py-2">
                    <Label htmlFor="archive-reason" className="text-sm font-medium">
                        Reason{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Textarea
                        id="archive-reason"
                        className="mt-2"
                        placeholder="e.g., Superseded by updated compliance requirements…"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <Button
                        variant="outline"
                        onClick={handleConfirm}
                        disabled={deprecateMutation.isPending}
                    >
                        {deprecateMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Archive Version
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
