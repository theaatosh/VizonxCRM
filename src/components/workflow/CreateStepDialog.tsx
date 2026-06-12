import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus } from "lucide-react";
import { useCreateStep } from "@/hooks/useWorkflows";
import { CreateStepDto, WorkflowStep } from "@/types/workflow.types";

const STORAGE_KEY_PREFIX = "workflow_step_draft_";

interface CreateStepDialogProps {
    workflowId: string;
    onAddLocal?: (step: WorkflowStep) => void;
    nextOrder?: number;
}

const getDefaultFormData = (order: number): CreateStepDto => ({
    name: "",
    description: "",
    stepOrder: order,
    requiresDocument: false,
    isActive: true,
    expectedDurationDays: 7,
});

const loadDraft = (workflowId: string): CreateStepDto | null => {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY_PREFIX + workflowId);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const saveDraft = (workflowId: string, data: CreateStepDto) => {
    try {
        sessionStorage.setItem(STORAGE_KEY_PREFIX + workflowId, JSON.stringify(data));
    } catch {
        // storage full or unavailable
    }
};

const clearDraft = (workflowId: string) => {
    try {
        sessionStorage.removeItem(STORAGE_KEY_PREFIX + workflowId);
    } catch {
        // ignore
    }
};

export const CreateStepDialog = ({
    workflowId,
    onAddLocal,
    nextOrder = 1,
}: CreateStepDialogProps) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateStepDto>(() =>
        loadDraft(workflowId) ?? getDefaultFormData(nextOrder)
    );

    useEffect(() => {
        if (open) {
            const draft = loadDraft(workflowId);
            if (draft) {
                setFormData({ ...draft, stepOrder: nextOrder });
            } else {
                setFormData((prev) => ({ ...prev, stepOrder: nextOrder }));
            }
        }
    }, [open, nextOrder, workflowId]);

    useEffect(() => {
        if (open) {
            saveDraft(workflowId, formData);
        }
    }, [open, formData, workflowId]);

    const createStepMutation = useCreateStep();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (onAddLocal) {
            onAddLocal({ id: `temp-${Date.now()}`, workflowId, ...formData } as WorkflowStep);
            setOpen(false);
            clearDraft(workflowId);
            setFormData(getDefaultFormData(nextOrder + 1));
            return;
        }

        try {
            await createStepMutation.mutateAsync({ workflowId, data: formData });
            setOpen(false);
            clearDraft(workflowId);
            setFormData(getDefaultFormData(nextOrder + 1));
        } catch {
            // handled by hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Add Step</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="step-name">Step Name *</Label>
                        <Input
                            id="step-name"
                            placeholder="e.g., Document Collection"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="step-description">Description</Label>
                        <Textarea
                            id="step-description"
                            placeholder="Describe what happens in this step..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration-days">Expected Duration (days) *</Label>
                        <Input
                            id="duration-days"
                            type="number"
                            min="1"
                            value={formData.expectedDurationDays}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    expectedDurationDays: parseInt(e.target.value) || 1,
                                })
                            }
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="requires-doc">Requires Document</Label>
                            <p className="text-sm text-muted-foreground">
                                Does this step require document upload?
                            </p>
                        </div>
                        <Switch
                            id="requires-doc"
                            checked={formData.requiresDocument}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, requiresDocument: checked })
                            }
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={createStepMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createStepMutation.isPending}>
                            {createStepMutation.isPending
                                ? "Adding…"
                                : onAddLocal
                                  ? "Add to Draft"
                                  : "Add Step"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
