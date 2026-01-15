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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCreateWorkflow } from "@/hooks/useWorkflows";
import { CreateWorkflowDto } from "@/types/workflow.types";
import { useVisaTypes } from "@/hooks/useVisaTypes";

export const CreateWorkflowDialog = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateWorkflowDto>({
        name: "",
        description: "",
        visaTypeId: "",
        isActive: true,
    });

    const createMutation = useCreateWorkflow();

    // Fetch visa types for dropdown
    const { data: visaTypesResponse, isLoading: loadingVisaTypes } = useVisaTypes({
        limit: 100,
    });

    const visaTypes = visaTypesResponse?.data || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createMutation.mutateAsync(formData);
            setOpen(false);
            // Reset form
            setFormData({
                name: "",
                description: "",
                visaTypeId: "",
                isActive: true,
            });
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Workflow Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Student Visa Application Process"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the purpose of this workflow..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="visaTypeId">Visa Type *</Label>
                        {loadingVisaTypes ? (
                            <div className="flex items-center justify-center p-4 border rounded-md">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-muted-foreground">Loading visa types...</span>
                            </div>
                        ) : (
                            <Select
                                value={formData.visaTypeId}
                                onValueChange={(value) => setFormData({ ...formData, visaTypeId: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a visa type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visaTypes.map((visaType) => (
                                        <SelectItem key={visaType.id} value={visaType.id}>
                                            {visaType.name} {visaType.country ? `(${visaType.country.name})` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Select the visa type this workflow is for
                        </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="isActive">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Set whether this workflow is currently active
                            </p>
                        </div>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending || loadingVisaTypes}>
                            {createMutation.isPending ? "Creating..." : "Create Workflow"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

