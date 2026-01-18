import { useState } from 'react';
import { useCreateLandingPage } from '@/hooks/useLandingPages';
import { CreateLandingPageDto } from '@/types/landingPage.types';
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
import { Plus } from 'lucide-react';

export function CreateLandingPageDialog() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateLandingPageDto>({
        title: '',
        slug: '',
        content: '',
        heroImage: '',
        metaTitle: '',
        metaDescription: '',
    });

    const createLandingPageMutation = useCreateLandingPage();

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createLandingPageMutation.mutate(formData, {
            onSuccess: () => {
                setOpen(false);
                setFormData({
                    title: '',
                    slug: '',
                    content: '',
                    heroImage: '',
                    metaTitle: '',
                    metaDescription: '',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Landing Page
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Landing Page</DialogTitle>
                        <DialogDescription>
                            Add a new landing page with SEO-optimized content.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Study in Canada"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                placeholder="study-in-canada"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly version of the title (auto-generated)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter the main page content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={8}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heroImage">Hero Image URL</Label>
                            <Input
                                id="heroImage"
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
                                    <Label htmlFor="metaTitle">Meta Title</Label>
                                    <Input
                                        id="metaTitle"
                                        placeholder="SEO title for search engines"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: 50-60 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
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
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createLandingPageMutation.isPending}>
                            {createLandingPageMutation.isPending ? 'Creating...' : 'Create Landing Page'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
