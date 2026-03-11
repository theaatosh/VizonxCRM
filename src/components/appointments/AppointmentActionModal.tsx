import React, { useState } from 'react';
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
import { 
    useApproveAppointment, 
    useRejectAppointment, 
    useCompleteAppointment,
    useCancelAppointment
} from '@/hooks/useAppointments';
import { Loader2 } from 'lucide-react';

export type ActionType = 'approve' | 'reject' | 'complete' | 'cancel' | null;

interface AppointmentActionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    actionType: ActionType;
    appointmentId: string | null;
}

const actionConfig = {
    approve: {
        title: 'Approve Appointment',
        description: 'Are you sure you want to approve this appointment? You can add internal staff notes below.',
        label: 'Internal Notes (Optional)',
        placeholder: 'e.g. Will prepare Stanford application materials beforehand.',
        buttonText: 'Approve',
        buttonClass: 'bg-green-600 hover:bg-green-700',
        field: 'staffNotes'
    },
    reject: {
        title: 'Reject Appointment',
        description: 'Please provide a reason for rejecting this appointment request.',
        label: 'Rejection Reason',
        placeholder: 'e.g. Not available at this time. Please choose another slot.',
        buttonText: 'Reject',
        buttonClass: 'bg-destructive hover:bg-destructive/90',
        field: 'rejectionReason'
    },
    complete: {
        title: 'Complete Appointment',
        description: 'Mark this appointment as completed. Please summarize the outcome of the meeting.',
        label: 'Outcome Notes',
        placeholder: 'e.g. Reviewed application. Recommended improvements to personal statement.',
        buttonText: 'Complete',
        buttonClass: 'bg-primary hover:bg-primary/90',
        field: 'outcomeNotes'
    },
    cancel: {
        title: 'Cancel Appointment',
        description: 'Are you sure you want to cancel this appointment? Please provide a reason.',
        label: 'Cancellation Reason',
        placeholder: 'e.g. Staff unavailable – emergency situation.',
        buttonText: 'Cancel Appointment',
        buttonClass: 'bg-destructive hover:bg-destructive/90',
        field: 'cancellationReason'
    }
};

export const AppointmentActionModal = ({
    open,
    onOpenChange,
    actionType,
    appointmentId
}: AppointmentActionModalProps) => {
    const [note, setNote] = useState('');
    
    const approveMutation = useApproveAppointment();
    const rejectMutation = useRejectAppointment();
    const completeMutation = useCompleteAppointment();
    const cancelMutation = useCancelAppointment();

    if (!actionType) return null;

    const config = actionConfig[actionType];
    const isPending = approveMutation.isPending || rejectMutation.isPending || completeMutation.isPending || cancelMutation.isPending;

    const handleSubmit = async () => {
        if (!appointmentId) return;

        try {
            if (actionType === 'approve') {
                await approveMutation.mutateAsync({ id: appointmentId, staffNotes: note });
            } else if (actionType === 'reject') {
                await rejectMutation.mutateAsync({ id: appointmentId, rejectionReason: note });
            } else if (actionType === 'complete') {
                await completeMutation.mutateAsync({ id: appointmentId, outcomeNotes: note });
            } else if (actionType === 'cancel') {
                await cancelMutation.mutateAsync({ id: appointmentId, cancellationReason: note });
            }
            setNote('');
            onOpenChange(false);
        } catch (error) {
            // Error handling is managed by the hooks (toast)
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                    <DialogDescription>
                        {config.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="note">{config.label}</Label>
                        <Textarea
                            id="note"
                            placeholder={config.placeholder}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={config.buttonClass}
                        onClick={handleSubmit}
                        disabled={isPending || ((actionType === 'reject' || actionType === 'cancel') && !note.trim())}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {config.buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
