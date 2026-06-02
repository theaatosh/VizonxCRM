import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Layers, History } from "lucide-react";
import { Workflow } from "@/types/workflow.types";
import { WorkflowStepEditor } from "./WorkflowStepEditor";
import { WorkflowVersionHistory } from "./WorkflowVersionHistory";
import { useState } from "react";

interface WorkflowDetailModalProps {
    workflow: Workflow | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const WorkflowDetailModal = ({
    workflow,
    open,
    onOpenChange,
}: WorkflowDetailModalProps) => {
    const [activeTab, setActiveTab] = useState("steps");

    if (!workflow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{workflow.name}</DialogTitle>
                    {workflow.description && (
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                        <Badge variant={workflow.isActive ? "default" : "secondary"}>
                            {workflow.isActive ? (
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
                        {workflow.visaType && (
                            <Badge variant="outline" className="text-xs font-normal">
                                {workflow.visaType.name}
                                {workflow.visaType.country
                                    ? ` · ${workflow.visaType.country.name}`
                                    : ""}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="mt-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="steps" className="flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Steps
                            </TabsTrigger>
                            <TabsTrigger value="versions" className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Version History
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="steps">
                            <WorkflowStepEditor workflowId={workflow.id} />
                        </TabsContent>

                        <TabsContent value="versions">
                            <WorkflowVersionHistory workflowId={workflow.id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};
