import { useState, useEffect } from 'react';
import { useUpdateLandingPage } from '@/hooks/useLandingPages';
import { LandingPage, UpdateLandingPageDto } from '@/types/landingPage.types';
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

interface EditLandingPageDialogProps {
    landingPage: LandingPage | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditLandingPageDialog({ landingPage, open, onOpenChange }: EditLandingPageDialogProps) {
    const [formData, setFormData] = useState<UpdateLandingPageDto>({
        title: '',
        slug: '',
        content: '',
        heroImage: '',
        metaTitle: '',
        metaDescription: '',
    });

    const updateLandingPageMutation = useUpdateLandingPage();

    useEffect(() => {
        if (landingPage) {
            setFormData({
                title: landingPage.title,
                slug: landingPage.slug,
                content: landingPage.content,
                heroImage: landingPage.heroImage,
                metaTitle: landingPage.metaTitle,
                metaDescription: landingPage.metaDescription,
            });
        }
    }, [landingPage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!landingPage) return;

        updateLandingPageMutation.mutate(
            { id: landingPage.id, data: formData },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    if (!landingPage) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Landing Page</DialogTitle>
                        <DialogDescription>
                            Update the landing page content and SEO metadata.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title *</Label>
                            <Input
                                id="edit-title"
                                placeholder="e.g., Study in Canada"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-slug">Slug *</Label>
                            <Input
                                id="edit-slug"
                                placeholder="study-in-canada"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly version of the title
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-content">Content *</Label>
                            <Textarea
                                id="edit-content"
                                placeholder="Enter the main page content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={8}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-heroImage">Hero Image URL</Label>
                            <Input
                                id="edit-heroImage"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={formData.heroImage}
                                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                            />
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-sm font-semibold mb-4">SEO Metadata</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-metaTitle">Meta Title</Label>
                                    <Input
                                        id="edit-metaTitle"
                                        placeholder="SEO title for search engines"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: 50-60 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-metaDescription">Meta Description</Label>
                                    <Textarea
                                        id="edit-metaDescription"
                                        placeholder="SEO description for search engines"
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        rows={3}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: 150-160 characters
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateLandingPageMutation.isPending}>
                            {updateLandingPageMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
