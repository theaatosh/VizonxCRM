import { LandingPage } from '@/types/landingPage.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LandingPageCardProps {
    landingPage: LandingPage;
    onView: (landingPage: LandingPage) => void;
    onEdit: (landingPage: LandingPage) => void;
    onDelete: (id: string) => void;
}

export function LandingPageCard({ landingPage, onView, onEdit, onDelete }: LandingPageCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-mono">
                                /{landingPage.slug}
                            </Badge>
                        </div>
                        <CardTitle className="text-base line-clamp-1">{landingPage.title}</CardTitle>
                    </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                    {landingPage.metaDescription || landingPage.content.substring(0, 100) + '...'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {landingPage.heroImage && (
                    <div className="mb-3 rounded-md overflow-hidden bg-muted h-32">
                        <img
                            src={landingPage.heroImage}
                            alt={landingPage.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Updated {new Date(landingPage.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(landingPage)}
                            className="h-8 w-8"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(landingPage)}
                            className="h-8 w-8"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Landing Page</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this landing page? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDelete(landingPage.id)} className="bg-destructive text-destructive-foreground">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
