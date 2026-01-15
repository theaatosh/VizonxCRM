import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scholarship } from "@/types/scholarship.types";
import {
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Award,
    Calendar,
    DollarSign,
    Globe,
    GraduationCap,
    ExternalLink
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";

interface ScholarshipCardProps {
    scholarship: Scholarship;
    onView: (scholarship: Scholarship) => void;
    onEdit: (scholarship: Scholarship) => void;
    onDelete: (id: string) => void;
    onTogglePublish: (id: string, isPublished: boolean) => void;
}

export const ScholarshipCard = ({ scholarship, onView, onEdit, onDelete, onTogglePublish }: ScholarshipCardProps) => {
    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isDeadlinePassed = new Date(scholarship.deadline) < new Date();

    return (
        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Award className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-semibold line-clamp-1">{scholarship.title}</CardTitle>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge
                                variant={scholarship.isPublished ? "default" : "secondary"}
                                className="flex items-center gap-1 w-fit"
                            >
                                {scholarship.isPublished ? (
                                    <>
                                        <CheckCircle2 className="h-3 w-3" />
                                        Published
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3 w-3" />
                                        Draft
                                    </>
                                )}
                            </Badge>
                            {isDeadlinePassed && (
                                <Badge variant="destructive" className="text-xs">
                                    Expired
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                    {scholarship.description || "No description provided"}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-medium">{formatCurrency(scholarship.amount, scholarship.currency)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-warning" />
                        <span className="font-medium">{formatDate(scholarship.deadline)}</span>
                    </div>
                    {scholarship.universityName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                            <GraduationCap className="h-4 w-4" />
                            <span className="truncate">{scholarship.universityName}</span>
                        </div>
                    )}
                    {scholarship.countryName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                            <Globe className="h-4 w-4" />
                            <span>{scholarship.countryName}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onView(scholarship)}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(scholarship)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTogglePublish(scholarship.id, !scholarship.isPublished)}
                    >
                        {scholarship.isPublished ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{scholarship.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(scholarship.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
};
