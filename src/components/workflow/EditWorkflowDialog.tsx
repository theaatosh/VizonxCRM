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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateWorkflow } from "@/hooks/useWorkflows";
import { useVisaTypes } from "@/hooks/useVisaTypes";
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
    const { data: visaTypesResponse, isLoading: loadingVisaTypes } = useVisaTypes({ limit: 100 });
    const visaTypes = visaTypesResponse?.data || [];

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
        } catch {
            // handled by mutation hook
        }
    };

    if (!workflow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Edit Workflow</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name *</Label>
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
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-visaTypeId">Visa Type *</Label>
                        {loadingVisaTypes ? (
                            <div className="flex items-center gap-2 p-3 border rounded-md text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading visa types…
                            </div>
                        ) : (
                            <Select
                                value={formData.visaTypeId || ""}
                                onValueChange={(v) => setFormData({ ...formData, visaTypeId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a visa type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visaTypes.map((vt) => (
                                        <SelectItem key={vt.id} value={vt.id}>
                                            {vt.name}
                                            {vt.country ? ` (${vt.country.name})` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? "Saving…" : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
