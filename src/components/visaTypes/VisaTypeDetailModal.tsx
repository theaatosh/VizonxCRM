import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { VisaType } from "@/types/visaType.types";
import { useVisaType } from "@/hooks/useVisaTypes";
import {
    Loader2,
    Globe,
    CheckCircle2,
    XCircle,
    Workflow as WorkflowIcon,
    FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VisaTypeDetailModalProps {
    visaType: VisaType | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const VisaTypeDetailModal = ({ visaType, open, onOpenChange }: VisaTypeDetailModalProps) => {
    const { data: detailedVisaType, isLoading } = useVisaType(visaType?.id || "");

    const displayVisaType = detailedVisaType || visaType;

    if (!displayVisaType) return null;

    const workflows = displayVisaType.workflows || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl mb-2">{displayVisaType.name}</DialogTitle>
                            <p className="text-sm text-muted-foreground">{displayVisaType.description}</p>
                            <div className="flex gap-2 mt-3">
                                <Badge variant={displayVisaType.isActive ? "default" : "secondary"}>
                                    {displayVisaType.isActive ? (
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
                                {displayVisaType.country && (
                                    <Badge variant="outline">
                                        <Globe className="h-3 w-3 mr-1" />
                                        {displayVisaType.country.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <WorkflowIcon className="h-5 w-5" />
                            Associated Workflows
                        </h3>
                        <Badge variant="outline">
                            {workflows.length} {workflows.length === 1 ? 'workflow' : 'workflows'}
                        </Badge>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : workflows.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-2">No workflows associated</p>
                            <p className="text-xs text-muted-foreground">
                                Workflows can be created and linked from the Workflows page
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {workflows.map((workflow: any) => (
                                <Card key={workflow.id} className="border">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-base mb-1">{workflow.name}</h4>
                                                <p className="text-sm text-muted-foreground mb-2">{workflow.description}</p>
                                                <div className="flex gap-2">
                                                    <Badge variant={workflow.isActive ? "default" : "secondary"} className="text-xs">
                                                        {workflow.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    {workflow.steps && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {workflow.steps.length} {workflow.steps.length === 1 ? 'step' : 'steps'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
