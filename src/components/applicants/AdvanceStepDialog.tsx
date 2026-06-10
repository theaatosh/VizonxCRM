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
import { Loader2 } from 'lucide-react';

interface AdvanceStepDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    visaId: string;
    isLastStep?: boolean;
}

export function AdvanceStepDialog({ open, onOpenChange, visaId, isLastStep }: AdvanceStepDialogProps) {
    const [notes, setNotes] = useState('');
    const { mutate: advanceStep, isPending } = useAdvanceVisaStep();

    const handleSubmit = () => {
        if (!notes.trim()) return;
        
        advanceStep({
            id: visaId,
            data: {
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
                    <DialogTitle>{isLastStep ? 'Complete Final Step' : 'Advance Visa Step'}</DialogTitle>
                    <DialogDescription>
                        {isLastStep
                            ? 'Provide a brief note to mark the final step as completed.'
                            : 'Provide a brief note about the progress to advance the application to the next step.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                                {isLastStep ? 'Completing...' : 'Advancing...'}
                            </>
                        ) : (
                            isLastStep ? 'Mark as Completed' : 'Confirm Advancement'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
