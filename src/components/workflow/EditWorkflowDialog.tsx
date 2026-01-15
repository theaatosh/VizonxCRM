import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUpdateWorkflow } from "@/hooks/useWorkflows";
import { Workflow, UpdateWorkflowDto } from "@/types/workflow.types";

interface EditWorkflowDialogProps {
    workflow: Workflow | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditWorkflowDialog = ({ workflow, open, onOpenChange }: EditWorkflowDialogProps) => {
    const [formData, setFormData] = useState<UpdateWorkflowDto>({
        name: "",
        description: "",
        visaTypeId: "",
        isActive: true,
    });

    const updateMutation = useUpdateWorkflow();

    useEffect(() => {
        if (workflow) {
            setFormData({
                name: workflow.name,
                description: workflow.description,
                visaTypeId: workflow.visaTypeId,
                isActive: workflow.isActive,
            });
        }
    }, [workflow]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workflow) return;

        try {
            await updateMutation.mutateAsync({ id: workflow.id, data: formData });
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    if (!workflow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Workflow</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Workflow Name *</Label>
                        <Input
                            id="edit-name"
                            placeholder="e.g., Student Visa Application Process"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Describe the purpose of this workflow..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-visaTypeId">Visa Type ID *</Label>
                        <Input
                            id="edit-visaTypeId"
                            placeholder="Enter visa type UUID"
                            value={formData.visaTypeId || ""}
                            onChange={(e) => setFormData({ ...formData, visaTypeId: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="edit-isActive">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Set whether this workflow is currently active
                            </p>
                        </div>
                        <Switch
                            id="edit-isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
