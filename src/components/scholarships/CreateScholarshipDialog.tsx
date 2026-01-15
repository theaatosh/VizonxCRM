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
import { Plus, Loader2 } from "lucide-react";
import { useCreateScholarship } from "@/hooks/useScholarships";
import { CreateScholarshipDto } from "@/types/scholarship.types";

export const CreateScholarshipDialog = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateScholarshipDto>({
        title: "",
        slug: "",
        description: "",
        eligibility: "",
        amount: 0,
        currency: "USD",
        deadline: "",
        applicationUrl: "",
        universityName: "",
        countryName: "",
    });

    const createMutation = useCreateScholarship();

    // Helper function to generate slug from title
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-');     // Remove consecutive hyphens
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-generate slug from title if not provided
        const dataWithSlug = {
            ...formData,
            slug: formData.slug || generateSlug(formData.title),
        };

        try {
            await createMutation.mutateAsync(dataWithSlug);
            setOpen(false);
            // Reset form
            setFormData({
                title: "",
                slug: "",
                description: "",
                eligibility: "",
                amount: 0,
                currency: "USD",
                deadline: "",
                applicationUrl: "",
                universityName: "",
                countryName: "",
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
                    Create Scholarship
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Scholarship</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Chevening Scholarship"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the scholarship..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="eligibility">Eligibility Requirements *</Label>
                        <Textarea
                            id="eligibility"
                            placeholder="Who is eligible to apply?"
                            value={formData.eligibility}
                            onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                            rows={2}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="50000"
                                value={formData.amount || ""}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Input
                                id="currency"
                                placeholder="USD"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deadline">Application Deadline *</Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="universityName">University Name</Label>
                            <Input
                                id="universityName"
                                placeholder="e.g., Oxford University"
                                value={formData.universityName}
                                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="countryName">Country</Label>
                            <Input
                                id="countryName"
                                placeholder="e.g., United Kingdom"
                                value={formData.countryName}
                                onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applicationUrl">Application URL</Label>
                        <Input
                            id="applicationUrl"
                            type="url"
                            placeholder="https://example.com/apply"
                            value={formData.applicationUrl}
                            onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
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
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create Scholarship"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
