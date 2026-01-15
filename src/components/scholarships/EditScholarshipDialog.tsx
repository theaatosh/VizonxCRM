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
import { useUpdateScholarship } from "@/hooks/useScholarships";
import { Scholarship, UpdateScholarshipDto } from "@/types/scholarship.types";

interface EditScholarshipDialogProps {
    scholarship: Scholarship | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditScholarshipDialog = ({ scholarship, open, onOpenChange }: EditScholarshipDialogProps) => {
    const [formData, setFormData] = useState<UpdateScholarshipDto>({
        title: "",
        description: "",
        eligibility: "",
        amount: 0,
        currency: "USD",
        deadline: "",
        applicationUrl: "",
        universityName: "",
        countryName: "",
    });

    const updateMutation = useUpdateScholarship();

    useEffect(() => {
        if (scholarship) {
            setFormData({
                title: scholarship.title,
                description: scholarship.description,
                eligibility: scholarship.eligibility,
                amount: scholarship.amount,
                currency: scholarship.currency,
                deadline: scholarship.deadline.split('T')[0],
                applicationUrl: scholarship.applicationUrl || "",
                universityName: scholarship.universityName || "",
                countryName: scholarship.countryName || "",
            });
        }
    }, [scholarship]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scholarship) return;

        try {
            await updateMutation.mutateAsync({ id: scholarship.id, data: formData });
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    if (!scholarship) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Scholarship</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                            id="edit-title"
                            placeholder="e.g., Chevening Scholarship"
                            value={formData.title || ""}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description *</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Describe the scholarship..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-eligibility">Eligibility Requirements *</Label>
                        <Textarea
                            id="edit-eligibility"
                            placeholder="Who is eligible to apply?"
                            value={formData.eligibility || ""}
                            onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                            rows={2}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-amount">Amount *</Label>
                            <Input
                                id="edit-amount"
                                type="number"
                                placeholder="50000"
                                value={formData.amount || ""}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-currency">Currency</Label>
                            <Input
                                id="edit-currency"
                                placeholder="USD"
                                value={formData.currency || ""}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-deadline">Application Deadline *</Label>
                        <Input
                            id="edit-deadline"
                            type="date"
                            value={formData.deadline || ""}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-universityName">University Name</Label>
                            <Input
                                id="edit-universityName"
                                placeholder="e.g., Oxford University"
                                value={formData.universityName || ""}
                                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-countryName">Country</Label>
                            <Input
                                id="edit-countryName"
                                placeholder="e.g., United Kingdom"
                                value={formData.countryName || ""}
                                onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-applicationUrl">Application URL</Label>
                        <Input
                            id="edit-applicationUrl"
                            type="url"
                            placeholder="https://example.com/apply"
                            value={formData.applicationUrl || ""}
                            onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
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
