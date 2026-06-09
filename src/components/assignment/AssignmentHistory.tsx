import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, UserCheck, RefreshCw, Undo, GitBranch } from "lucide-react";
import { useLeadAssignmentHistory } from "@/hooks/useAssignment";
import { cn } from "@/lib/utils";

interface AssignmentHistoryProps {
    leadId: string;
}

const reasonIcons: Record<string, React.ElementType> = {
    InitialAssignment: UserCheck,
    AutomaticAssignment: UserCheck,
    ManualAssignment: UserCheck,
    Reassignment: RefreshCw,
    RevisitAssignment: Undo,
};

const reasonColors: Record<string, string> = {
    InitialAssignment: "bg-primary/10 text-primary",
    AutomaticAssignment: "bg-primary/10 text-primary",
    ManualAssignment: "bg-primary/10 text-primary",
    Reassignment: "bg-warning/10 text-warning",
    RevisitAssignment: "bg-info/10 text-info",
};

export function AssignmentHistory({ leadId }: AssignmentHistoryProps) {
    const { data: history, isLoading, isError } = useLeadAssignmentHistory(leadId);

    return (
        <Card className="shadow-card">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Assignment History
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <p className="text-sm text-muted-foreground">Failed to load assignment history</p>
                ) : !history || history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No assignment history available</p>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                        <div className="space-y-4">
                            {history.map((item, index) => {
                                const Icon = reasonIcons[item.reason] || UserCheck;
                                return (
                                    <div key={item.id || index} className="relative flex gap-4">
                                        <div className={cn(
                                            "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                                            reasonColors[item.reason] || "bg-muted text-muted-foreground"
                                        )}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{item.toStaff?.user?.name || 'Unknown'}</span>
                                                {item.fromStaff && (
                                                    <span className="text-sm text-muted-foreground">
                                                        (from {item.fromStaff.user?.name || 'Unknown'})
                                                    </span>
                                                )}
                                                <Badge variant="outline" className="text-[10px] capitalize">
                                                    {item.reason.replace(/([A-Z])/g, ' $1').trim()}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            {item.reassignmentNote && (
                                                <p className="text-xs text-muted-foreground mt-1 p-1.5 bg-muted/50 rounded">
                                                    {item.reassignmentNote}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
