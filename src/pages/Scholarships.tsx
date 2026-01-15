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
import { Search, Award, FileX } from "lucide-react";
import { useScholarships, useDeleteScholarship, useTogglePublish } from "@/hooks/useScholarships";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";
import { CreateScholarshipDialog } from "@/components/scholarships/CreateScholarshipDialog";
import { EditScholarshipDialog } from "@/components/scholarships/EditScholarshipDialog";
import { ScholarshipDetailModal } from "@/components/scholarships/ScholarshipDetailModal";
import { Scholarship } from "@/types/scholarship.types";
import { Skeleton } from "@/components/ui/skeleton";

const Scholarships = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [editScholarship, setEditScholarship] = useState<Scholarship | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const limit = 12;

  const { data, isLoading, isError, error } = useScholarships({
    page,
    limit,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const deleteScholarshipMutation = useDeleteScholarship();
  const togglePublishMutation = useTogglePublish();

  // Filter by status on client side
  const scholarships = data?.data || [];
  const filteredScholarships = statusFilter === "all"
    ? scholarships
    : scholarships.filter(s => statusFilter === "published" ? s.isPublished : !s.isPublished);

  const totalPages = Math.ceil((data?.totalPages || 0));

  const handleViewScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setDetailModalOpen(true);
  };

  const handleEditScholarship = (scholarship: Scholarship) => {
    setEditScholarship(scholarship);
    setEditModalOpen(true);
  };

  const handleDeleteScholarship = (id: string) => {
    deleteScholarshipMutation.mutate(id);
  };

  const handleTogglePublish = (id: string, isPublished: boolean) => {
    togglePublishMutation.mutate({ id, isPublished });
  };

  return (
    <DashboardLayout title="Scholarships" subtitle="Manage scholarship opportunities">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
          <CreateScholarshipDialog />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scholarships</SelectItem>
              <SelectItem value="published">Published Only</SelectItem>
              <SelectItem value="draft">Drafts Only</SelectItem>
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
            Failed to load scholarships: {(error as any)?.message || "Unknown error"}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredScholarships.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
          <Award className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            {search || statusFilter !== "all"
              ? "No scholarships match your filters"
              : "No scholarships created yet"}
          </p>
          {!search && statusFilter === "all" && (
            <CreateScholarshipDialog />
          )}
        </div>
      )}

      {/* Scholarships Grid */}
      {!isLoading && !isError && filteredScholarships.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onView={handleViewScholarship}
                onEdit={handleEditScholarship}
                onDelete={handleDeleteScholarship}
                onTogglePublish={handleTogglePublish}
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
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
      <EditScholarshipDialog
        scholarship={editScholarship}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </DashboardLayout>
  );
};

export default Scholarships;

