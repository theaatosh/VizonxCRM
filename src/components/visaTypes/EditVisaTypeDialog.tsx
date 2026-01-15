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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateVisaType } from "@/hooks/useVisaTypes";
import { VisaType, UpdateVisaTypeDto } from "@/types/visaType.types";
import { useQuery } from "@tanstack/react-query";
import countryService from "@/services/country.service";

interface EditVisaTypeDialogProps {
    visaType: VisaType | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditVisaTypeDialog = ({ visaType, open, onOpenChange }: EditVisaTypeDialogProps) => {
    const [formData, setFormData] = useState<UpdateVisaTypeDto>({
        name: "",
        description: "",
        countryId: "",
        isActive: true,
    });

    const updateMutation = useUpdateVisaType();

    // Fetch active countries for dropdown
    const { data: countries = [], isLoading: loadingCountries } = useQuery({
        queryKey: ['countries', 'active'],
        queryFn: () => countryService.getActiveCountries(),
    });

    useEffect(() => {
        if (visaType) {
            setFormData({
                name: visaType.name,
                description: visaType.description,
                countryId: visaType.countryId,
                isActive: visaType.isActive,
            });
        }
    }, [visaType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!visaType) return;

        try {
            await updateMutation.mutateAsync({ id: visaType.id, data: formData });
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    if (!visaType) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Visa Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Visa Type Name *</Label>
                        <Input
                            id="edit-name"
                            placeholder="e.g., Student Visa"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Describe this visa type..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-countryId">Country *</Label>
                        {loadingCountries ? (
                            <div className="flex items-center justify-center p-4 border rounded-md">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-muted-foreground">Loading countries...</span>
                            </div>
                        ) : (
                            <Select
                                value={formData.countryId || ""}
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
                            <Label htmlFor="edit-isActive">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Set whether this visa type is currently active
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
                        <Button type="submit" disabled={updateMutation.isPending || loadingCountries}>
                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
