import { useState } from 'react';
import { useCreateFaq } from '@/hooks/useFaqs';
import { CreateFaqDto } from '@/types/faq.types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';

export function CreateFaqDialog() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateFaqDto>({
        category: '',
        question: '',
        answer: '',
        sortOrder: 0,
        isActive: true,
    });

    const createFaqMutation = useCreateFaq();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createFaqMutation.mutate(formData, {
            onSuccess: () => {
                setOpen(false);
                setFormData({
                    category: '',
                    question: '',
                    answer: '',
                    sortOrder: 0,
                    isActive: true,
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create FAQ
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New FAQ</DialogTitle>
                        <DialogDescription>
                            Add a new frequently asked question to your content library.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Input
                                id="category"
                                placeholder="e.g., General, Visa, Admission"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="question">Question *</Label>
                            <Textarea
                                id="question"
                                placeholder="Enter the question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer">Answer *</Label>
                            <Textarea
                                id="answer"
                                placeholder="Enter the answer"
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sortOrder">Sort Order</Label>
                            <Input
                                id="sortOrder"
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
                                <Label htmlFor="isActive">Is Active</Label>
                                <p className="text-xs text-muted-foreground">
                                    Only active FAQs will be displayed publicly
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createFaqMutation.isPending}>
                            {createFaqMutation.isPending ? 'Creating...' : 'Create FAQ'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
