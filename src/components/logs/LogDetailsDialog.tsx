import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActivityLog } from '@/types/log.types';
import { format } from 'date-fns';

interface LogDetailsDialogProps {
    log: ActivityLog | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LogDetailsDialog: React.FC<LogDetailsDialogProps> = ({ log, open, onOpenChange }) => {
    if (!log) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Activity Log Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about this activity.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider mb-1">Timestamp</span>
                                <span>{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider mb-1">Action</span>
                                <span>{log.action}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider mb-1">Entity</span>
                                <span>{log.entityType} ({log.entityId})</span>
                            </div>
                            <div>
                                <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider mb-1">User</span>
                                <span>{log.user?.name || 'System'} {log.user?.role ? `(${log.user.role})` : ''}</span>
                            </div>
                        </div>

                        {/* Changes */}
                        {log.changes && (Object.keys(log.changes.before || {}).length > 0 || Object.keys(log.changes.after || {}).length > 0) && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold border-b pb-2">Changes</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-md border bg-muted/30 p-4">
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider">Before</h4>
                                        <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-auto max-h-60">
                                            {log.changes.before ? JSON.stringify(log.changes.before, null, 2) : 'No previous data'}
                                        </pre>
                                    </div>
                                    <div className="rounded-md border bg-success/5 p-4 border-success/20">
                                        <h4 className="text-xs font-semibold uppercase text-success/80 mb-3 tracking-wider">After</h4>
                                        <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-auto max-h-60 text-success/90">
                                            {log.changes.after ? JSON.stringify(log.changes.after, null, 2) : 'No new data'}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold border-b pb-2">Metadata</h3>
                                <div className="rounded-md border bg-muted/30 p-4">
                                    <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-auto max-h-40">
                                        {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                        
                        {/* Raw API Response for debugging if needed */}
                        <details className="text-xs text-muted-foreground opacity-70">
                            <summary className="cursor-pointer hover:text-foreground transition-colors">View Raw JSON</summary>
                            <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto font-mono max-h-40 break-all whitespace-pre-wrap">
                                {JSON.stringify(log, null, 2)}
                            </pre>
                        </details>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
