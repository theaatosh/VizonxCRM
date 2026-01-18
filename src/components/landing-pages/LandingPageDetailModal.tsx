import { LandingPage } from '@/types/landingPage.types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface LandingPageDetailModalProps {
    landingPage: LandingPage | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LandingPageDetailModal({ landingPage, open, onOpenChange }: LandingPageDetailModalProps) {
    if (!landingPage) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Landing Page Details</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
                            <p className="text-lg font-semibold">{landingPage.title}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Slug</h3>
                            <Badge variant="outline" className="font-mono">/{landingPage.slug}</Badge>
                        </div>

                        {landingPage.heroImage && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Hero Image</h3>
                                <div className="rounded-lg overflow-hidden border bg-muted">
                                    <img
                                        src={landingPage.heroImage}
                                        alt={landingPage.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 break-all">{landingPage.heroImage}</p>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Content</h3>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted p-4 rounded-lg">
                                {landingPage.content}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-semibold mb-3">SEO Metadata</h3>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Meta Title</h4>
                                    <p className="text-sm">{landingPage.metaTitle || <span className="text-muted-foreground italic">Not set</span>}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Meta Description</h4>
                                    <p className="text-sm">{landingPage.metaDescription || <span className="text-muted-foreground italic">Not set</span>}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created At</h3>
                                <p className="text-sm">{new Date(landingPage.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Updated At</h3>
                                <p className="text-sm">{new Date(landingPage.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
