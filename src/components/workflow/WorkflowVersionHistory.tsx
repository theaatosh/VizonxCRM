import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, History, Calendar, UploadCloud, Archive } from "lucide-react";
import { useWorkflowVersions, useActivateVersion } from "@/hooks/useWorkflows";
import { DeprecateVersionDialog } from "./DeprecateVersionDialog";
import { format } from "date-fns";

interface WorkflowVersionHistoryProps {
    workflowId: string;
}

export const WorkflowVersionHistory = ({ workflowId }: WorkflowVersionHistoryProps) => {
    const [deprecatingVersionId, setDeprecatingVersionId] = useState<string | null>(null);

    const { data: versionsData, isLoading } = useWorkflowVersions(workflowId);
    const activateMutation = useActivateVersion();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!versionsData?.data?.length) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                <History className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No version history yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Versions are created when you publish changes.
                </p>
            </div>
        );
    }

    const statusBadge = (status: string) => {
        if (status === "Active")
            return (
                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    Current
                </Badge>
            );
        if (status === "Draft")
            return (
                <Badge variant="secondary" className="text-amber-600 bg-amber-50 border-amber-200">
                    Draft
                </Badge>
            );
        return (
            <Badge variant="outline" className="text-muted-foreground">
                Archived
            </Badge>
        );
    };

    return (
        <>
            <div className="space-y-3">
                {versionsData.data.map((version) => (
                    <div
                        key={version.id}
                        className={`border rounded-xl p-4 bg-card transition-colors
                            ${version.status === "Active" ? "border-green-200 bg-green-50/30" : "hover:border-border/80"}`}
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-9 w-9 flex items-center justify-center rounded-full font-bold text-sm shrink-0
                                        ${version.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-primary/10 text-primary"}`}
                                >
                                    v{version.versionNumber}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm">
                                            {version.description ||
                                                `Version ${version.versionNumber}`}
                                        </span>
                                        {statusBadge(version.status)}
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(version.createdAt), "PPP")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {version.steps.length}{" "}
                                        {version.steps.length === 1 ? "step" : "steps"}
                                    </p>
                                    {version.applicationCount > 0 && (
                                        <p className="text-[11px] text-muted-foreground">
                                            {version.applicationCount} application
                                            {version.applicationCount !== 1 ? "s" : ""}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {version.status !== "Active" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 gap-1.5"
                                            onClick={() => activateMutation.mutate(version.id)}
                                            disabled={activateMutation.isPending}
                                        >
                                            {activateMutation.isPending ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <UploadCloud className="h-3 w-3" />
                                            )}
                                            Make Current
                                        </Button>
                                    )}
                                    {version.status === "Active" && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                                            onClick={() => setDeprecatingVersionId(version.id)}
                                        >
                                            <Archive className="h-3 w-3" />
                                            Archive
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Step pills */}
                        {version.steps.length > 0 && (
                            <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
                                {version.steps
                                    .slice()
                                    .sort((a, b) => a.stepOrder - b.stepOrder)
                                    .map((step, idx) => (
                                        <div key={step.id} className="flex items-center shrink-0">
                                            <div className="h-6 px-2.5 bg-muted rounded-full flex items-center text-[11px] font-medium border">
                                                {step.name}
                                            </div>
                                            {idx < version.steps.length - 1 && (
                                                <div className="w-3 h-px bg-border mx-0.5" />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <DeprecateVersionDialog
                versionId={deprecatingVersionId}
                onClose={() => setDeprecatingVersionId(null)}
            />
        </>
    );
};
