import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateApplicationStatus } from '@/hooks/useCourseApplications';
import type { ApplicationStatus } from '@/types/course-application.types';

interface UpdateStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationId: string | null;
    currentStatus: ApplicationStatus | null;
}

const statusOptions: ApplicationStatus[] = [
    'Submitted', 
    'UnderReview', 
    'Shortlisted', 
    'OfferReceived', 
    'Accepted', 
    'Rejected', 
    'Withdrawn'
];

export function UpdateStatusDialog({ 
    open, 
    onOpenChange, 
    applicationId, 
    currentStatus 
}: UpdateStatusDialogProps) {
    const [status, setStatus] = useState<ApplicationStatus | ''>('');
    const [rejectionReason, setRejectionReason] = useState('');
    
    const updateStatusMutation = useUpdateApplicationStatus();

    useEffect(() => {
        if (open && currentStatus) {
            setStatus(currentStatus);
            setRejectionReason('');
        }
    }, [open, currentStatus]);

    const handleUpdate = async () => {
        if (!applicationId || !status) return;
        
        await updateStatusMutation.mutateAsync({
            id: applicationId,
            status: status as ApplicationStatus,
            rejectionReason: status === 'Rejected' ? rejectionReason : undefined,
        });
        
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Update Application Status</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-semibold">New Status</Label>
                        <Select 
                            value={status} 
                            onValueChange={(v) => setStatus(v as ApplicationStatus)}
                        >
                            <SelectTrigger id="status" className="h-10 rounded-xl border-muted-foreground/20 focus:ring-primary/20">
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-muted-foreground/10 shadow-xl">
                                {statusOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt} className="rounded-lg">
                                        {opt.replace(/([A-Z])/g, ' $1').trim()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {status === 'Rejected' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="rejectionReason" className="text-sm font-semibold">Rejection Reason</Label>
                            <Textarea 
                                id="rejectionReason" 
                                placeholder="Please provide a reason for rejection..." 
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[100px] rounded-xl border-muted-foreground/20 focus:ring-primary/20 resize-none"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl h-10 px-6 font-medium"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdate} 
                        disabled={!status || updateStatusMutation.isPending || (status === 'Rejected' && !rejectionReason.trim())}
                        className="rounded-xl h-10 px-6 font-semibold shadow-lg shadow-primary/20"
                    >
                        {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
