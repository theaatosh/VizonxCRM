import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Workflow, WorkflowStep } from "@/types/workflow.types";
import { useWorkflowSteps, useDeleteStep, useReorderSteps } from "@/hooks/useWorkflows";
import {
    Loader2,
    Plus,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Pencil,
    Trash2,
    GripVertical,
    Calendar
} from "lucide-react";
import { CreateStepDialog } from "./CreateStepDialog";
import { EditStepDialog } from "./EditStepDialog";
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

interface WorkflowDetailModalProps {
    workflow: Workflow | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const WorkflowDetailModal = ({ workflow, open, onOpenChange }: WorkflowDetailModalProps) => {
    const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
    const [editStepOpen, setEditStepOpen] = useState(false);
    const [draggedStepId, setDraggedStepId] = useState<string | null>(null);

    const { data: steps = [], isLoading } = useWorkflowSteps(workflow?.id || "");
    const deleteStepMutation = useDeleteStep();
    const reorderStepsMutation = useReorderSteps();

    const sortedSteps = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);

    const handleDeleteStep = (stepId: string) => {
        if (!workflow) return;
        deleteStepMutation.mutate({ workflowId: workflow.id, stepId });
    };

    const handleEditStep = (step: WorkflowStep) => {
        setSelectedStep(step);
        setEditStepOpen(true);
    };

    const handleDragStart = (e: React.DragEvent, stepId: string) => {
        setDraggedStepId(stepId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetStepId: string) => {
        e.preventDefault();
        if (!draggedStepId || !workflow || draggedStepId === targetStepId) return;

        const draggedIndex = sortedSteps.findIndex(s => s.id === draggedStepId);
        const targetIndex = sortedSteps.findIndex(s => s.id === targetStepId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newSteps = [...sortedSteps];
        const [removed] = newSteps.splice(draggedIndex, 1);
        newSteps.splice(targetIndex, 0, removed);

        const stepIds = newSteps.map(s => s.id);
        reorderStepsMutation.mutate({ workflowId: workflow.id, stepIds });

        setDraggedStepId(null);
    };

    if (!workflow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl mb-2">{workflow.name}</DialogTitle>
                            <p className="text-sm text-muted-foreground">{workflow.description}</p>
                            <div className="flex gap-2 mt-3">
                                <Badge variant={workflow.isActive ? "default" : "secondary"}>
                                    {workflow.isActive ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Inactive
                                        </>
                                    )}
                                </Badge>
                                <Badge variant="outline">
                                    {sortedSteps.length} {sortedSteps.length === 1 ? 'Step' : 'Steps'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Workflow Steps</h3>
                        <CreateStepDialog workflowId={workflow.id} />
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : sortedSteps.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">No steps defined yet</p>
                            <CreateStepDialog workflowId={workflow.id} />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedSteps.map((step, index) => (
                                <div
                                    key={step.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, step.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, step.id)}
                                    className={`relative border rounded-lg p-4 bg-card hover:bg-muted/30 transition-all cursor-move ${draggedStepId === step.id ? 'opacity-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Drag Handle */}
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                                                {index + 1}
                                            </div>
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-base">{step.name}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                                                </div>
                                                <div className="flex gap-1 ml-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditStep(step)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Step</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete "{step.name}"? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteStep(step.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Badge variant={step.isActive ? "default" : "secondary"} className="text-xs">
                                                    {step.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                                {step.requiresDocument && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        Requires Document
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {step.expectedDurationDays} {step.expectedDurationDays === 1 ? 'day' : 'days'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connection Line */}
                                    {index < sortedSteps.length - 1 && (
                                        <div className="absolute left-[42px] top-full h-3 w-0.5 bg-border" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>

            <EditStepDialog
                workflowId={workflow.id}
                step={selectedStep}
                open={editStepOpen}
                onOpenChange={setEditStepOpen}
            />
        </Dialog>
    );
};
