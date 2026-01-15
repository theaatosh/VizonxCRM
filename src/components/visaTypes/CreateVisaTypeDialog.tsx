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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCreateVisaType } from "@/hooks/useVisaTypes";
import { CreateVisaTypeDto } from "@/types/visaType.types";
import { useQuery } from "@tanstack/react-query";
import countryService from "@/services/country.service";

export const CreateVisaTypeDialog = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateVisaTypeDto>({
        name: "",
        description: "",
        countryId: "",
        isActive: true,
    });

    const createMutation = useCreateVisaType();

    // Fetch active countries for dropdown
    const { data: countries = [], isLoading: loadingCountries } = useQuery({
        queryKey: ['countries', 'active'],
        queryFn: () => countryService.getActiveCountries(),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createMutation.mutateAsync(formData);
            setOpen(false);
            // Reset form
            setFormData({
                name: "",
                description: "",
                countryId: "",
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
                    Create Visa Type
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Visa Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Visa Type Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Student Visa"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe this visa type..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="countryId">Country *</Label>
                        {loadingCountries ? (
                            <div className="flex items-center justify-center p-4 border rounded-md">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-muted-foreground">Loading countries...</span>
                            </div>
                        ) : (
                            <Select
                                value={formData.countryId}
                                onValueChange={(value) => setFormData({ ...formData, countryId: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country: any) => (
                                        <SelectItem key={country.id} value={country.id}>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="isActive">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Set whether this visa type is currently active
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
                        <Button type="submit" disabled={createMutation.isPending || loadingCountries}>
                            {createMutation.isPending ? "Creating..." : "Create Visa Type"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
