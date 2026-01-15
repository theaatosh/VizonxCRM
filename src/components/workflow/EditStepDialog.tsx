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
import { useUpdateStep } from "@/hooks/useWorkflows";
import { WorkflowStep, UpdateStepDto } from "@/types/workflow.types";

interface EditStepDialogProps {
    workflowId: string;
    step: WorkflowStep | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditStepDialog = ({ workflowId, step, open, onOpenChange }: EditStepDialogProps) => {
    const [formData, setFormData] = useState<UpdateStepDto>({
        name: "",
        description: "",
        stepOrder: 1,
        requiresDocument: false,
        isActive: true,
        expectedDurationDays: 7,
    });

    const updateStepMutation = useUpdateStep();

    useEffect(() => {
        if (step) {
            setFormData({
                name: step.name,
                description: step.description,
                stepOrder: step.stepOrder,
                requiresDocument: step.requiresDocument,
                isActive: step.isActive,
                expectedDurationDays: step.expectedDurationDays,
            });
        }
    }, [step]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!step) return;

        try {
            await updateStepMutation.mutateAsync({
                workflowId,
                stepId: step.id,
                data: formData,
            });
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    if (!step) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Step</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-step-name">Step Name *</Label>
                        <Input
                            id="edit-step-name"
                            placeholder="e.g., Document Collection"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-step-description">Description</Label>
                        <Textarea
                            id="edit-step-description"
                            placeholder="Describe what happens in this step..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-step-order">Step Order *</Label>
                            <Input
                                id="edit-step-order"
                                type="number"
                                min="1"
                                value={formData.stepOrder || 1}
                                onChange={(e) => setFormData({ ...formData, stepOrder: parseInt(e.target.value) || 1 })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-duration-days">Duration (Days) *</Label>
                            <Input
                                id="edit-duration-days"
                                type="number"
                                min="1"
                                value={formData.expectedDurationDays || 1}
                                onChange={(e) => setFormData({ ...formData, expectedDurationDays: parseInt(e.target.value) || 1 })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="edit-requires-doc">Requires Document</Label>
                            <p className="text-sm text-muted-foreground">
                                Does this step require document upload?
                            </p>
                        </div>
                        <Switch
                            id="edit-requires-doc"
                            checked={formData.requiresDocument}
                            onCheckedChange={(checked) => setFormData({ ...formData, requiresDocument: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="edit-step-active">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Set whether this step is currently active
                            </p>
                        </div>
                        <Switch
                            id="edit-step-active"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateStepMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateStepMutation.isPending}>
                            {updateStepMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
