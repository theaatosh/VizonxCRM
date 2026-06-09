import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, GitBranch } from "lucide-react";
import { useLeadAssignmentHistory } from "@/hooks/useAssignment";
import { AssignmentHistory } from "./AssignmentHistory";
import { RevisitIndicator } from "./RevisitIndicator";
import type { LeadWithAssignment } from "@/types/lead.types";

interface AssignmentSectionProps {
    lead: LeadWithAssignment;
}

export function AssignmentSection({ lead }: AssignmentSectionProps) {
    const { data: history, isLoading } = useLeadAssignmentHistory(lead.id);
    const currentAssignment = history && history.length > 0 ? history[history.length - 1] : null;

    return (
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
                        <div className="space-y-3">
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
    );
}
