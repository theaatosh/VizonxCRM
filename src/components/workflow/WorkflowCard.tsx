import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workflow } from "@/types/workflow.types";
import { Layers, MoreHorizontal, Pencil, Power, PowerOff, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkflowCardProps {
    workflow: Workflow;
    onView: (workflow: Workflow) => void;
    onEdit: (workflow: Workflow) => void;
    onDelete: (id: string) => void;
    onActivate: (id: string) => void;
    onDeactivate: (id: string) => void;
}

export const WorkflowCard = ({ workflow, onView, onEdit, onDelete, onActivate, onDeactivate }: WorkflowCardProps) => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const stepCount = workflow._count?.steps || workflow.steps?.length || 0;

    return (
        <>
            <Card
                className="shadow-card hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => onView(workflow)}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Layers className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-base font-semibold truncate">
                                    {workflow.name}
                                </CardTitle>
                                {workflow.visaType && (
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                        {workflow.visaType.name}
                                        {workflow.visaType.country
                                            ? ` · ${workflow.visaType.country.name}`
                                            : ""}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(workflow);
                                    }}
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {workflow.isActive ? (
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeactivate(workflow.id);
                                        }}
                                    >
                                        <PowerOff className="h-4 w-4 mr-2" />
                                        Deactivate Workflow
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onActivate(workflow.id);
                                        }}
                                    >
                                        <Power className="h-4 w-4 mr-2" />
                                        Activate Workflow
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                        {workflow.description || "No description provided"}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Layers className="h-3.5 w-3.5" />
                            <span className="font-medium">{stepCount}</span>
                            <span>{stepCount === 1 ? "step" : "steps"}</span>
                        </div>
                        <Badge
                            variant={workflow.isActive ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {workflow.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{workflow.name}"? This action cannot be
                            undone and will remove all associated steps.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(workflow.id);
                                setDeleteOpen(false);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
