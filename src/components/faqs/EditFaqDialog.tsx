import { useState, useEffect } from 'react';
import { useUpdateFaq } from '@/hooks/useFaqs';
import { Faq, UpdateFaqDto } from '@/types/faq.types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface EditFaqDialogProps {
    faq: Faq | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditFaqDialog({ faq, open, onOpenChange }: EditFaqDialogProps) {
    const [formData, setFormData] = useState<UpdateFaqDto>({
        category: '',
        question: '',
        answer: '',
        sortOrder: 0,
        isActive: true,
    });

    const updateFaqMutation = useUpdateFaq();

    useEffect(() => {
        if (faq) {
            setFormData({
                category: faq.category,
                question: faq.question,
                answer: faq.answer,
                sortOrder: faq.sortOrder,
                isActive: faq.isActive,
            });
        }
    }, [faq]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!faq) return;

        updateFaqMutation.mutate(
            { id: faq.id, data: formData },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    if (!faq) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit FAQ</DialogTitle>
                        <DialogDescription>
                            Update the frequently asked question details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category *</Label>
                            <Input
                                id="edit-category"
                                placeholder="e.g., General, Visa, Admission"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-question">Question *</Label>
                            <Textarea
                                id="edit-question"
                                placeholder="Enter the question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-answer">Answer *</Label>
                            <Textarea
                                id="edit-answer"
                                placeholder="Enter the answer"
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-sortOrder">Sort Order</Label>
                            <Input
                                id="edit-sortOrder"
                                type="number"
                                placeholder="0"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Lower numbers appear first
                            </p>
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="edit-isActive">Is Active</Label>
                                <p className="text-xs text-muted-foreground">
                                    Only active FAQs will be displayed publicly
                                </p>
                            </div>
                            <Switch
                                id="edit-isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateFaqMutation.isPending}>
                            {updateFaqMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
