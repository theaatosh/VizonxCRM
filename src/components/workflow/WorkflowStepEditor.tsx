import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
    Loader2,
    Plus,
    FileText,
    Clock,
    Pencil,
    Trash2,
    GripVertical,
    UploadCloud,
    RotateCcw,
} from "lucide-react";
import { CreateStepDialog } from "./CreateStepDialog";
import { EditStepDialog } from "./EditStepDialog";
import { useCreateVersion, useWorkflowVersions } from "@/hooks/useWorkflows";
import { WorkflowStep, CreateVersionDto } from "@/types/workflow.types";

interface WorkflowStepEditorProps {
    workflowId: string;
}

export const WorkflowStepEditor = ({ workflowId }: WorkflowStepEditorProps) => {
    const [localSteps, setLocalSteps] = useState<WorkflowStep[] | null>(null);
    const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
    const [editStepOpen, setEditStepOpen] = useState(false);
    const [draggedStepId, setDraggedStepId] = useState<string | null>(null);
    const [isDiscarding, setIsDiscarding] = useState(false);

    const { data: versionsData, isLoading: isLoadingVersions } = useWorkflowVersions(workflowId);
    const createVersionMutation = useCreateVersion();

    // Always work with the latest version's steps
    const latestVersion = versionsData?.data?.[0];
    const latestSteps = latestVersion?.steps ?? [];

    // Reset local draft when the underlying data reloads (e.g. after publish)
    useEffect(() => {
        setLocalSteps(null);
    }, [latestVersion?.id]);

    const steps: WorkflowStep[] = localSteps ?? latestSteps;
    const sortedSteps = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);
    const hasUnsavedChanges =
        localSteps !== null &&
        JSON.stringify(localSteps) !== JSON.stringify(latestSteps);

    const initDraft = () => {
        if (!localSteps) setLocalSteps([...latestSteps]);
    };

    const handleAddStepLocal = (newStep: WorkflowStep) => {
        initDraft();
        setLocalSteps((prev) => [
            ...(prev ?? latestSteps),
            { ...newStep, id: `temp-${Date.now()}` },
        ]);
    };

    const handleDeleteStep = (stepId: string) => {
        initDraft();
        setLocalSteps((prev) => (prev ?? steps).filter((s) => s.id !== stepId));
    };

    const handleUpdateStepLocal = (stepId: string, data: Partial<WorkflowStep>) => {
        setLocalSteps((prev) => {
            if (!prev) return null;
            return prev.map((s) => (s.id === stepId ? { ...s, ...data } : s));
        });
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
        if (!draggedStepId || draggedStepId === targetStepId) return;

        const draggedIdx = sortedSteps.findIndex((s) => s.id === draggedStepId);
        const targetIdx = sortedSteps.findIndex((s) => s.id === targetStepId);
        if (draggedIdx === -1 || targetIdx === -1) return;

        const reordered = [...sortedSteps];
        const [removed] = reordered.splice(draggedIdx, 1);
        reordered.splice(targetIdx, 0, removed);

        initDraft();
        setLocalSteps(reordered.map((s, i) => ({ ...s, stepOrder: i + 1 })));
        setDraggedStepId(null);
    };

    const handlePublish = () => {
        if (!localSteps) return;

        const payload: CreateVersionDto = {
            workflowId,
            description: `Published on ${new Date().toLocaleDateString()}`,
            steps: localSteps.map(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (
                    {
                        id: _id,
                        workflowId: _wid,
                        tenantId: _tid,
                        versionId: _vid,
                        createdAt: _ca,
                        updatedAt: _ua,
                        ...rest
                    },
                    idx
                ) => ({ ...rest, stepOrder: idx + 1 })
            ),
        };

        createVersionMutation.mutate(payload, {
            onSuccess: () => setLocalSteps(null),
        });
    };

    const handleDiscardChanges = () => {
        setLocalSteps(null);
        setIsDiscarding(false);
    };

    if (isLoadingVersions) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">Steps</h3>
                    {hasUnsavedChanges && (
                        <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-300 bg-amber-50 text-xs font-medium"
                        >
                            Draft · unsaved changes
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {hasUnsavedChanges && (
                        <>
                            <AlertDialog open={isDiscarding} onOpenChange={setIsDiscarding}>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Discard
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Your unpublished edits will be lost and the steps will
                                            revert to the last published version.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Keep editing</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDiscardChanges}>
                                            Discard
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button
                                size="sm"
                                className="gap-2"
                                onClick={handlePublish}
                                disabled={createVersionMutation.isPending}
                            >
                                {createVersionMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <UploadCloud className="h-4 w-4" />
                                )}
                                Publish Changes
                            </Button>
                        </>
                    )}

                    <CreateStepDialog
                        workflowId={workflowId}
                        onAddLocal={handleAddStepLocal}
                        nextOrder={sortedSteps.length + 1}
                    />
                </div>
            </div>

            {/* Step list */}
            {sortedSteps.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">No steps defined yet</p>
                    <CreateStepDialog
                        workflowId={workflowId}
                        onAddLocal={handleAddStepLocal}
                        nextOrder={1}
                    />
                </div>
            ) : (
                <div className="space-y-2">
                    {sortedSteps.map((step, index) => (
                        <div
                            key={step.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, step.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, step.id)}
                            className={`relative border rounded-lg p-4 bg-card transition-colors hover:bg-muted/30 cursor-move group
                                ${draggedStepId === step.id ? "opacity-40" : ""}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs">
                                        {index + 1}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="font-medium text-sm">{step.name}</h4>
                                            {step.description && (
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                    {step.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => {
                                                    setSelectedStep(step);
                                                    setEditStepOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete step?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            "{step.name}" will be removed. This will be
                                                            applied when you publish.
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

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {step.requiresDocument && (
                                            <Badge variant="outline" className="text-xs">
                                                <FileText className="h-3 w-3 mr-1" />
                                                Requires Document
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {step.expectedDurationDays}{" "}
                                            {step.expectedDurationDays === 1 ? "day" : "days"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {index < sortedSteps.length - 1 && (
                                <div className="absolute left-[38px] top-full h-2 w-0.5 bg-border" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <EditStepDialog
                workflowId={workflowId}
                step={selectedStep}
                open={editStepOpen}
                onOpenChange={setEditStepOpen}
                onUpdateLocal={handleUpdateStepLocal}
                isDraftMode={hasUnsavedChanges}
            />
        </div>
    );
};
