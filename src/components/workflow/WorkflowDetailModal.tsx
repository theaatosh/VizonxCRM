import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Workflow, WorkflowStep, CreateVersionDto } from "@/types/workflow.types";
import { useDeleteStep, useReorderSteps, useCreateVersion } from "@/hooks/useWorkflows";
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
    Calendar,
    Save,
    RotateCcw,
    Layers
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useWorkflowVersions, useWorkflowVersion, useActivateVersion, useDeprecateVersion } from "@/hooks/useWorkflows";
import { format } from "date-fns";
import { History, ShieldCheck, ShieldAlert } from "lucide-react";

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
    const [localSteps, setLocalSteps] = useState<WorkflowStep[] | null>(null);
    const [isDiscarding, setIsDiscarding] = useState(false);
    const [activeTab, setActiveTab] = useState("steps");
    const [selectedVersionId, setSelectedVersionId] = useState<string>("");
    const [deprecatingVersionId, setDeprecatingVersionId] = useState<string | null>(null);
    const [deprecateReason, setDeprecateReason] = useState("");
    const [allowMigration, setAllowMigration] = useState(false);

    const { data: versionsData, isLoading: isLoadingVersions } = useWorkflowVersions(workflow?.id || "");
    const latestVersion = versionsData?.data?.[0];
    const latestSteps = latestVersion?.steps || [];
    const { data: selectedVersion, isLoading: isLoadingVersion } = useWorkflowVersion(selectedVersionId);
    const createVersionMutation = useCreateVersion();
    const activateVersionMutation = useActivateVersion();
    const deprecateVersionMutation = useDeprecateVersion();
    const advanceStepMutation = useAdvanceVisaStep();

    // Sync selectedVersionId with latest version on load
    useEffect(() => {
        if (versionsData?.data && !selectedVersionId) {
            // Prefer the latest Active version as the default
            const activeVersion = versionsData.data.find(v => v.status === 'Active');
            if (activeVersion) {
                setSelectedVersionId(activeVersion.id);
            } else if (versionsData.data[0]) {
                setSelectedVersionId(versionsData.data[0].id);
            }
        }
    }, [versionsData, selectedVersionId]);

    const isLatestVersion = selectedVersionId === (latestVersion?.id || "");
    const steps = isLatestVersion ? (localSteps || latestSteps) : (selectedVersion?.steps || []);
    const isLoading = isLoadingVersions || (!!selectedVersionId && !isLatestVersion && isLoadingVersion);

    const hasStructuralChange = !!localSteps && JSON.stringify(localSteps) !== JSON.stringify(latestSteps);

    useEffect(() => {
        if (open && currentStepId) {
            setAdvancingStepId(currentStepId);
        }
        if (!open) {
            setLocalSteps(null);
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

    const initDraft = () => {
        if (!localSteps) {
            setLocalSteps(latestSteps);
        }
    };

    const handleSaveChanges = () => {
        if (!workflow || !localSteps) return;

        const payload: CreateVersionDto = {
            workflowId: workflow.id,
            description: `Version created on ${new Date().toLocaleDateString()}`,
            steps: localSteps.map(({ id, workflowId, tenantId, versionId, createdAt, updatedAt, ...rest }, index) => ({
                ...rest,
                stepOrder: index + 1,
            }))
        };

        createVersionMutation.mutate(payload, {
            onSuccess: () => {
                setLocalSteps(null);
            }
        });
    };

    const handleDiscardChanges = () => {
        setLocalSteps(null);
        setIsDiscarding(false);
    };

    const handleDeleteStep = (stepId: string) => {
        initDraft();
        setLocalSteps(prev => (prev || steps).filter(s => s.id !== stepId));
    };

    const handleAddStepLocal = (newStep: WorkflowStep) => {
        initDraft();
        setLocalSteps(prev => [...(prev || latestSteps), { ...newStep, id: `temp-${Date.now()}` }]);
    };

    const handleUpdateStepLocal = (stepId: string, data: Partial<WorkflowStep>) => {
        setLocalSteps(prev => {
            if (!prev) return null;
            return prev.map(s => s.id === stepId ? { ...s, ...data } : s);
        });
    };

    const handleActivate = async (versionId: string) => {
        await activateVersionMutation.mutateAsync(versionId);
    };

    const handleDeprecate = async () => {
        if (!deprecatingVersionId || !deprecateReason) return;
        await deprecateVersionMutation.mutateAsync({
            versionId: deprecatingVersionId,
            deprecatedReason: deprecateReason,
            allowMigration,
        });
        setDeprecatingVersionId(null);
        setDeprecateReason("");
        setAllowMigration(false);
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

        // Update orders
        const reorderedSteps = newSteps.map((s, index) => ({
            ...s,
            stepOrder: index + 1
        }));

        initDraft();
        setLocalSteps(reorderedSteps);

        setDraggedStepId(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && hasStructuralChange) {
            setIsDiscarding(true);
            return;
        }
        onOpenChange(newOpen);
        if (!newOpen) {
            setActiveTab("steps");
        }
    };

    if (!workflow) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
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
                                {hasStructuralChange && (
                                    <Badge variant="destructive" className="animate-pulse">
                                        Unsaved Structural Changes
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {hasStructuralChange && (
                            <div className="flex gap-2">
                                <AlertDialog open={isDiscarding} onOpenChange={setIsDiscarding}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <RotateCcw className="h-4 w-4" />
                                            Discard
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You have unsaved structural changes. Discarding will revert to the previous version.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDiscardChanges} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Discard Changes
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button 
                                    size="sm" 
                                    className="gap-2 shadow-lg shadow-primary/20" 
                                    onClick={handleSaveChanges}
                                    disabled={createVersionMutation.isPending}
                                >
                                    {createVersionMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="mt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="steps" className="flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Current Steps
                            </TabsTrigger>
                            <TabsTrigger value="versions" className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Version History
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="steps" className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-semibold whitespace-nowrap">Workflow Steps</h3>
                                    {versionsData?.data && versionsData.data.length > 0 && (
                                        <Select value={selectedVersionId} onValueChange={setSelectedVersionId}>
                                            <SelectTrigger className="w-[180px] h-9">
                                                <SelectValue placeholder="Select Version" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {versionsData.data.map((v) => (
                                                    <SelectItem key={v.id} value={v.id}>
                                                        Version {v.versionNumber} {v.id === versionsData.data[0].id ? '(Latest)' : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                                {isLatestVersion && (
                                    <CreateStepDialog 
                                        workflowId={workflow.id} 
                                        onAddLocal={handleAddStepLocal}
                                        nextOrder={sortedSteps.length + 1}
                                    />
                                )}
                            </div>

                            {!isLatestVersion && (
                                <div className="bg-muted px-4 py-2 rounded-lg text-xs flex items-center gap-2 text-muted-foreground border border-dashed">
                                    <History className="h-3 w-3" />
                                    Viewing Version {selectedVersion?.versionNumber} (Read-only)
                                </div>
                            )}

                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : sortedSteps.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-sm text-muted-foreground mb-4">No steps defined yet</p>
                                    <CreateStepDialog workflowId={workflow.id} onAddLocal={handleAddStepLocal} nextOrder={1} />
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
                                            draggable={isLatestVersion}
                                            onDragStart={isLatestVersion ? (e) => handleDragStart(e, step.id) : undefined}
                                            onDragOver={isLatestVersion ? handleDragOver : undefined}
                                            onDrop={isLatestVersion ? (e) => handleDrop(e, step.id) : undefined}
                                            className={`relative border rounded-lg p-4 bg-card transition-all ${isLatestVersion ? 'hover:bg-muted/30 cursor-move' : ''} ${draggedStepId === step.id ? 'opacity-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex items-center gap-2">
                                                    {isLatestVersion && <GripVertical className="h-5 w-5 text-muted-foreground" />}
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                                                        {index + 1}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-base">{step.name}</h4>
                                                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                                                        </div>
                                                        {isLatestVersion && (
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
                                                        )}
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

                                            {index < sortedSteps.length - 1 && (
                                                <div className="absolute left-[42px] top-full h-3 w-0.5 bg-border" />
                                            )}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="versions" className="space-y-4">
                            {isLoadingVersions ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : versionsData?.data?.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                                    <History className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-sm text-muted-foreground">No version history found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {versionsData?.data.map((version) => (
                                        <div 
                                            key={version.id}
                                            className="border rounded-xl p-4 bg-card hover:border-primary/50 transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                        v{version.versionNumber}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-semibold">{version.description || `Version ${version.versionNumber}`}</h4>
                                                            <Badge variant={
                                                                version.status === 'Active' ? 'default' : 
                                                                version.status === 'Draft' ? 'secondary' : 'outline'
                                                            }>
                                                                {version.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(new Date(version.createdAt), 'PPP p')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <span className="text-sm font-medium text-muted-foreground">
                                                            {version.steps.length} {version.steps.length === 1 ? 'Step' : 'Steps'}
                                                        </span>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {version.applicationCount} active users
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {version.status !== 'Active' && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                className="h-8 bg-primary/5 hover:bg-primary/10 border-primary/20"
                                                                onClick={() => handleActivate(version.id)}
                                                                disabled={activateVersionMutation.isPending}
                                                            >
                                                                {activateVersionMutation.isPending ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                                                )}
                                                                Activate
                                                            </Button>
                                                        )}
                                                        {version.status === 'Active' && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                className="h-8 text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                                                                onClick={() => {
                                                                    setDeprecatingVersionId(version.id);
                                                                    setDeprecateReason("");
                                                                }}
                                                            >
                                                                <ShieldAlert className="h-3 w-3 mr-1" />
                                                                Deprecate
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Preview steps trigger or direct preview */}
                                            <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
                                                {version.steps.map((step, sIdx) => (
                                                    <div key={step.id} className="flex items-center shrink-0">
                                                        <div className="h-7 px-3 bg-muted rounded-full flex items-center text-[11px] font-medium border border-transparent group-hover:border-primary/20">
                                                            {step.name}
                                                        </div>
                                                        {sIdx < version.steps.length - 1 && (
                                                            <div className="w-4 h-[1px] bg-border mx-1" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Deprecation Dialog */}
                <AlertDialog open={!!deprecatingVersionId} onOpenChange={(open) => !open && setDeprecatingVersionId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deprecate Version</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please provide a reason for deprecating this version. This will mark the version as outdated.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deprecation Reason</label>
                                <textarea
                                    className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="e.g. New compliance rules require updated documentation steps..."
                                    value={deprecateReason}
                                    onChange={(e) => setDeprecateReason(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="allow-migration"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={allowMigration}
                                    onChange={(e) => setAllowMigration(e.target.checked)}
                                />
                                <label htmlFor="allow-migration" className="text-sm text-muted-foreground">
                                    Allow users to migrate to newer versions
                                </label>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button 
                                variant="destructive" 
                                onClick={handleDeprecate}
                                disabled={!deprecateReason || deprecateVersionMutation.isPending}
                            >
                                {deprecateVersionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Deprecation
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>

            <EditStepDialog
                workflowId={workflow.id}
                step={selectedStep}
                open={editStepOpen}
                onOpenChange={setEditStepOpen}
                onUpdateLocal={handleUpdateStepLocal}
                isDraftMode={hasStructuralChange}
            />
        </Dialog>
    );
};
