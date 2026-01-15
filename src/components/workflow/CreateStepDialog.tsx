import { useState } from "react";
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
import { Plus } from "lucide-react";
import { useCreateStep } from "@/hooks/useWorkflows";
import { CreateStepDto } from "@/types/workflow.types";

interface CreateStepDialogProps {
    workflowId: string;
}

export const CreateStepDialog = ({ workflowId }: CreateStepDialogProps) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateStepDto>({
        name: "",
        description: "",
        stepOrder: 1,
        requiresDocument: false,
        isActive: true,
        expectedDurationDays: 7,
    });

    const createStepMutation = useCreateStep();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createStepMutation.mutateAsync({ workflowId, data: formData });
            setOpen(false);
            // Reset form
            setFormData({
                name: "",
                description: "",
                stepOrder: 1,
                requiresDocument: false,
                isActive: true,
                expectedDurationDays: 7,
            });
        } catch (error) {
            // Error is handled by the mutation hook
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Step</DialogTitle>
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
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="step-description">Description</Label>
                        <Textarea
                            id="step-description"
                            placeholder="Describe what happens in this step..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="step-order">Step Order *</Label>
                            <Input
                                id="step-order"
                                type="number"
                                min="1"
                                value={formData.stepOrder}
                                onChange={(e) => setFormData({ ...formData, stepOrder: parseInt(e.target.value) || 1 })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration-days">Duration (Days) *</Label>
                            <Input
                                id="duration-days"
                                type="number"
                                min="1"
                                value={formData.expectedDurationDays}
                                onChange={(e) => setFormData({ ...formData, expectedDurationDays: parseInt(e.target.value) || 1 })}
                                required
                            />
                        </div>
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
                            onCheckedChange={(checked) => setFormData({ ...formData, requiresDocument: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="step-active">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Set whether this step is currently active
                            </p>
                        </div>
                        <Switch
                            id="step-active"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={createStepMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createStepMutation.isPending}>
                            {createStepMutation.isPending ? "Creating..." : "Create Step"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
