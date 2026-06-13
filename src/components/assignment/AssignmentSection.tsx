import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { User, Calendar, GitBranch, Info } from "lucide-react";
import { useLeadAssignmentHistory, useAssignmentHistoryById } from "@/hooks/useAssignment";
import { AssignmentHistory } from "./AssignmentHistory";
import { RevisitIndicator } from "./RevisitIndicator";
import type { LeadWithAssignment } from "@/types/lead.types";

function CurrentAssignmentDetail({ id, onClose }: { id: string; onClose: () => void }) {
    const { data: item, isLoading } = useAssignmentHistoryById(id);

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Current Assignment Detail</DialogTitle>
                    <DialogDescription>Full details of this assignment record</DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ) : item ? (
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Staff</span>
                            <span className="col-span-2 font-medium">{item.toStaff?.user?.name || 'Unknown'}</span>
                        </div>
                        {item.fromStaff && (
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">From</span>
                                <span className="col-span-2">{item.fromStaff.user?.name || 'Unknown'}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Lead</span>
                            <span className="col-span-2">{item.lead?.firstName} {item.lead?.lastName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Reason</span>
                            <span className="col-span-2 capitalize">{item.reason.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground">Date</span>
                            <span className="col-span-2">{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                        {item.reassignmentNote && (
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Note</span>
                                <span className="col-span-2">{item.reassignmentNote}</span>
                            </div>
                        )}
                        {item.assignedBy && (
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-muted-foreground">Assigned By</span>
                                <span className="col-span-2">{item.assignedBy}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Record not found</p>
                )}
            </DialogContent>
        </Dialog>
    );
}

interface AssignmentSectionProps {
    lead: LeadWithAssignment;
}

export function AssignmentSection({ lead }: AssignmentSectionProps) {
    const { data: history, isLoading } = useLeadAssignmentHistory(lead.id);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const currentAssignment = Array.isArray(history) && history.length > 0 ? history[history.length - 1] : null;

    return (
        <>
            <div className="space-y-4">
                <Card className="shadow-card">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Current Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        ) : currentAssignment ? (
                            <div
                                className="space-y-3 cursor-pointer group"
                                onClick={() => setSelectedId(currentAssignment.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{currentAssignment.toStaff?.user?.name || 'Unknown'}</span>
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                        {currentAssignment.reason}
                                    </Badge>
                                </div>
                                {currentAssignment.reassignmentNote && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <GitBranch className="h-4 w-4" />
                                        Note: {currentAssignment.reassignmentNote}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Assigned: {new Date(currentAssignment.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                                <span className="text-xs text-muted-foreground/50 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Info className="h-3 w-3" /> Click for details
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                {lead.assignedUser ? (
                                    <span>Assigned to <strong>{lead.assignedUser.name}</strong></span>
                                ) : (
                                    <span>Not assigned</span>
                                )}
                            </div>
                        )}

                        {lead.isRevisit && (
                            <div className="mt-4">
                                <RevisitIndicator
                                    previousCounselorName={lead.previousCounselorName}
                                    previousInteractionDate={lead.previousInteractionDate}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <AssignmentHistory leadId={lead.id} />
            </div>

            {selectedId && (
                <CurrentAssignmentDetail
                    id={selectedId}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </>
    );
}
