import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Workflow as WorkflowIcon, FileX } from "lucide-react";
import { useWorkflows, useDeleteWorkflow } from "@/hooks/useWorkflows";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { CreateWorkflowDialog } from "@/components/workflow/CreateWorkflowDialog";
import { EditWorkflowDialog } from "@/components/workflow/EditWorkflowDialog";
import { WorkflowDetailModal } from "@/components/workflow/WorkflowDetailModal";
import { Workflow as WorkflowType } from "@/types/workflow.types";
import { Skeleton } from "@/components/ui/skeleton";

const Workflow = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null);
  const [editWorkflow, setEditWorkflow] = useState<WorkflowType | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const limit = 12;

  const { data, isLoading, isError, error } = useWorkflows({
    page,
    limit,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const deleteWorkflowMutation = useDeleteWorkflow();

  // Filter by status on client side for now
  const workflows = data?.data || [];
  const filteredWorkflows = statusFilter === "all"
    ? workflows
    : workflows.filter(w => statusFilter === "active" ? w.isActive : !w.isActive);

  const totalPages = Math.ceil((data?.totalPages || 0));

  const handleViewWorkflow = (workflow: WorkflowType) => {
    setSelectedWorkflow(workflow);
    setDetailModalOpen(true);
  };

  const handleEditWorkflow = (workflow: WorkflowType) => {
    setEditWorkflow(workflow);
    setEditModalOpen(true);
  };

  const handleDeleteWorkflow = (id: string) => {
    deleteWorkflowMutation.mutate(id);
  };

  return (
    <DashboardLayout
      title="Workflows"
      subtitle="Manage visa application workflows and process steps"
    >
      {/* Header Actions */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
          <CreateWorkflowDialog />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-10 w-10 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
          <FileX className="h-12 w-12 text-destructive mb-3" />
          <p className="text-sm text-muted-foreground">
            Failed to load workflows: {(error as any)?.message || "Unknown error"}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredWorkflows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
          <WorkflowIcon className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            {search || statusFilter !== "all"
              ? "No workflows match your filters"
              : "No workflows created yet"}
          </p>
          {!search && statusFilter === "all" && <CreateWorkflowDialog />}
        </div>
      )}

      {/* Workflows Grid */}
      {!isLoading && !isError && filteredWorkflows.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onView={handleViewWorkflow}
                onEdit={handleEditWorkflow}
                onDelete={handleDeleteWorkflow}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    className="w-10 h-10 p-0"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <WorkflowDetailModal
        workflow={selectedWorkflow}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
      <EditWorkflowDialog
        workflow={editWorkflow}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </DashboardLayout>
  );
};

export default Workflow;
