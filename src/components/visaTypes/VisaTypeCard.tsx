import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisaType } from "@/types/visaType.types";
import {
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Globe,
    Workflow as WorkflowIcon
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

interface VisaTypeCardProps {
    visaType: VisaType;
    onView: (visaType: VisaType) => void;
    onEdit: (visaType: VisaType) => void;
    onDelete: (id: string) => void;
}

export const VisaTypeCard = ({ visaType, onView, onEdit, onDelete }: VisaTypeCardProps) => {
    const workflowCount = visaType._count?.workflows || 0;

    return (
        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Globe className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-semibold">{visaType.name}</CardTitle>
                        </div>
                        <Badge
                            variant={visaType.isActive ? "default" : "secondary"}
                            className="flex items-center gap-1 w-fit"
                        >
                            {visaType.isActive ? (
                                <>
                                    <CheckCircle2 className="h-3 w-3" />
                                    Active
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-3 w-3" />
                                    Inactive
                                </>
                            )}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                    {visaType.description || "No description provided"}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                    {visaType.country && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span className="font-medium">{visaType.country.name}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <WorkflowIcon className="h-4 w-4" />
                        <span className="font-medium">{workflowCount}</span>
                        <span>{workflowCount === 1 ? 'workflow' : 'workflows'}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onView(visaType)}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(visaType)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Visa Type</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{visaType.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(visaType.id)}
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
