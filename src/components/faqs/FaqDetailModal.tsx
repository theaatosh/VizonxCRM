import { Faq } from '@/types/faq.types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FaqDetailModalProps {
    faq: Faq | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FaqDetailModal({ faq, open, onOpenChange }: FaqDetailModalProps) {
    if (!faq) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>FAQ Details</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline">{faq.category}</Badge>
                                <Badge variant={faq.isActive ? 'default' : 'secondary'}>
                                    {faq.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Question</h3>
                            <p className="text-base font-semibold">{faq.question}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Answer</h3>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Sort Order</h3>
                                <p className="text-sm">{faq.sortOrder}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                <p className="text-sm">{faq.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created At</h3>
                                <p className="text-sm">{new Date(faq.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Updated At</h3>
                                <p className="text-sm">{new Date(faq.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
