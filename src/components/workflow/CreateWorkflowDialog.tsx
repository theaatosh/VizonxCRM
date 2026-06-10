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
    const { data: visaTypesResponse, isLoading: loadingVisaTypes } = useVisaTypes({ limit: 100 });
    const visaTypes = visaTypesResponse?.data || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync(formData);
            setOpen(false);
            setFormData({ name: "", description: "", visaTypeId: "", isActive: true });
        } catch {
            // handled by mutation hook
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
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>New Workflow</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
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
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="visaTypeId">Visa Type *</Label>
                        {loadingVisaTypes ? (
                            <div className="flex items-center gap-2 p-3 border rounded-md text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading visa types…
                            </div>
                        ) : (
                            <Select
                                value={formData.visaTypeId}
                                onValueChange={(v) => setFormData({ ...formData, visaTypeId: v })}
                                required
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
                            onClick={() => setOpen(false)}
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                createMutation.isPending ||
                                loadingVisaTypes ||
                                !formData.name ||
                                !formData.visaTypeId
                            }
                        >
                            {createMutation.isPending ? "Creating…" : "Create Workflow"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
