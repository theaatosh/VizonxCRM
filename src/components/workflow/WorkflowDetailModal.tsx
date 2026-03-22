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
import { useAdvanceVisaStep } from "@/hooks/useVisaApplications";
import { toast } from "sonner";
import { useEffect } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    visaId?: string;
    currentStepId?: string;
}

export const WorkflowDetailModal = ({ workflow, open, onOpenChange, visaId, currentStepId }: WorkflowDetailModalProps) => {
    const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
    const [editStepOpen, setEditStepOpen] = useState(false);
    const [draggedStepId, setDraggedStepId] = useState<string | null>(null);
    const [advanceNotes, setAdvanceNotes] = useState("");
    const [advancingStepId, setAdvancingStepId] = useState<string>(currentStepId || "");

    const { data: steps = [], isLoading } = useWorkflowSteps(workflow?.id || "");
    const deleteStepMutation = useDeleteStep();
    const reorderStepsMutation = useReorderSteps();
    const advanceStepMutation = useAdvanceVisaStep();

    useEffect(() => {
        if (open && currentStepId) {
            setAdvancingStepId(currentStepId);
        }
    }, [open, currentStepId]);

    const sortedSteps = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);

    const handleAdvance = () => {
        if (!visaId || !advancingStepId || !advanceNotes) {
            toast.error("Please select a step and provide notes");
            return;
        }

        advanceStepMutation.mutate({
            id: visaId,
            data: {
                expectedStepId: advancingStepId,
                notes: advanceNotes
            }
        }, {
            onSuccess: () => {
                setAdvanceNotes("");
                onOpenChange(false);
            }
        });
    };

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

        const reorderPayload = newSteps.map((s, index) => ({
            id: s.id,
            order: index + 1
        }));
        reorderStepsMutation.mutate({ workflowId: workflow.id, steps: reorderPayload });

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
                        <div className="space-y-6">
                            {/* Advance Step Action Area */}
                            {visaId && (
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-end">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                Workflow Step
                                            </label>
                                            <Select 
                                                value={advancingStepId} 
                                                onValueChange={setAdvancingStepId}
                                            >
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue placeholder="Select Workflow Step" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sortedSteps.map((step) => (
                                                        <SelectItem key={step.id} value={step.id}>
                                                            Step {step.stepOrder}: {step.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-[2] space-y-2">
                                            <label className="text-sm font-medium">Progress Notes</label>
                                            <input 
                                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="e.g. Document verified, moving to next stage..."
                                                value={advanceNotes}
                                                onChange={(e) => setAdvanceNotes(e.target.value)}
                                            />
                                        </div>
                                        <Button 
                                            onClick={handleAdvance}
                                            disabled={advanceStepMutation.isPending || !advanceNotes}
                                            className="px-8"
                                        >
                                            {advanceStepMutation.isPending ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                            )}
                                            Advance
                                        </Button>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-3 italic">
                                        * Selecting a step will send its ID as the "expectedStepId" to safely advance the workflow.
                                    </p>
                                </div>
                            )}

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
