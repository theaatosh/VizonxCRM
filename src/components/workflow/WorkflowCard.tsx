import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workflow } from "@/types/workflow.types";
import {
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    Layers
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

interface WorkflowCardProps {
    workflow: Workflow;
    onView: (workflow: Workflow) => void;
    onEdit: (workflow: Workflow) => void;
    onDelete: (id: string) => void;
}

export const WorkflowCard = ({ workflow, onView, onEdit, onDelete }: WorkflowCardProps) => {
    const stepCount = workflow._count?.steps || workflow.steps?.length || 0;

    return (
        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Layers className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg font-semibold">{workflow.name}</CardTitle>
                        </div>
                        <Badge
                            variant={workflow.isActive ? "default" : "secondary"}
                            className="flex items-center gap-1 w-fit"
                        >
                            {workflow.isActive ? (
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
                    {workflow.description || "No description provided"}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Layers className="h-4 w-4" />
                            <span className="font-medium">{stepCount}</span>
                            <span>{stepCount === 1 ? 'step' : 'steps'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onView(workflow)}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(workflow)}
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
                                <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{workflow.name}"? This action cannot be undone
                                    and will also remove all associated steps.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(workflow.id)}
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
