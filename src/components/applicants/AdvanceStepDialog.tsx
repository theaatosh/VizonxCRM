import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAdvanceVisaStep } from '@/hooks/useVisaApplications';
import { useWorkflowSteps } from '@/hooks/useWorkflows';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AdvanceStepDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    visaId: string;
    currentStepId: string;
    workflowId: string;
}

export function AdvanceStepDialog({ open, onOpenChange, visaId, currentStepId, workflowId }: AdvanceStepDialogProps) {
    const [notes, setNotes] = useState('');
    const [selectedStepId, setSelectedStepId] = useState<string>(currentStepId);
    const { mutate: advanceStep, isPending } = useAdvanceVisaStep();
    const { data: steps = [], isLoading: isLoadingSteps } = useWorkflowSteps(workflowId);

    // Update selectedStepId when currentStepId changes (to sync with modal opening)
    useState(() => {
        if (currentStepId) setSelectedStepId(currentStepId);
    });

    const handleSubmit = () => {
        if (!notes.trim() || !selectedStepId) return;
        
        advanceStep({
            id: visaId,
            data: {
                expectedStepId: selectedStepId,
                notes: notes.trim()
            }
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setNotes('');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Advance Visa Step</DialogTitle>
                    <DialogDescription>
                        Provide a brief note about the progress to advance the application to the next step safely.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="step">Select Step to Advance From</Label>
                        <Select 
                            value={selectedStepId} 
                            onValueChange={setSelectedStepId}
                            disabled={isLoadingSteps}
                        >
                            <SelectTrigger id="step" className="w-full">
                                <SelectValue placeholder={isLoadingSteps ? "Loading steps..." : "Select a step"} />
                            </SelectTrigger>
                            <SelectContent>
                                {steps.sort((a, b) => a.stepOrder - b.stepOrder).map((step) => (
                                    <SelectItem key={step.id} value={step.id}>
                                        Step {step.stepOrder}: {step.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-muted-foreground italic">
                            The API uses this to ensure you are advancing from the correct state.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Progress Note</Label>
                        <Textarea
                            id="notes"
                            placeholder="e.g., Biometric verification cleared successfully."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isPending || !notes.trim()}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Advancing...
                            </>
                        ) : (
                            'Confirm Advancement'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
