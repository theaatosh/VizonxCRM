import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeads, useConvertLeadToStudent, useUpdateLead } from "@/hooks/useLeads";

import { usePermissions } from "@/contexts/PermissionContext";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { DeleteLeadDialog } from "@/components/leads/DeleteLeadDialog";
import type { Lead, LeadStatus } from "@/types/lead.types";

// Map backend status to display colors
const statusColors: Record<LeadStatus, string> = {
  New: "bg-primary/10 text-primary border-primary/20",
  Contacted: "bg-warning/10 text-warning border-warning/20",
  Qualified: "bg-info/10 text-info border-info/20",
  Converted: "bg-success/10 text-success border-success/20",
  NotInterested: "bg-muted text-muted-foreground border-muted",
  NotReachable: "bg-destructive/10 text-destructive border-destructive/20",
};

// Map backend priority to display colors
const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-muted text-muted-foreground border-muted",
};

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Fetch leads from API
  const { data, isLoading, isError, error } = useLeads({
    page,
    limit: 10,
    search: searchQuery || undefined,
    sortOrder: 'desc',
  });

  const convertToStudent = useConvertLeadToStudent();
  const updateLead = useUpdateLead();
  const { canCreate, canUpdate, canDelete, hasPermission } = usePermissions();

  // Filter leads by status locally (after fetching)
  const filteredLeads = useMemo(() => {
    if (!data?.data) return [];
    if (statusFilter === "all") return data.data;
    return data.data.filter(
      (lead) => lead.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [data?.data, statusFilter]);

  // Helper to get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Helper to format full name
  const getFullName = (lead: Lead) => {
    return `${lead.firstName} ${lead.lastName}`;
  };

  // Handlers
  const handleAddLead = () => {
    setSelectedLead(null);
    setFormDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormDialogOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  const handleConvertLead = (lead: Lead) => {
    convertToStudent.mutate(lead.id);
  };

  const handleChangeStatus = (lead: Lead, newStatus: LeadStatus) => {
    updateLead.mutate({ id: lead.id, data: { status: newStatus } });
  };

  // Get available status transitions for a lead
  const getAvailableStatuses = (currentStatus: LeadStatus): LeadStatus[] => {
    const allStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'NotInterested', 'NotReachable'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  // Format status display name
  const formatStatusName = (status: LeadStatus): string => {
    if (status === 'NotInterested') return 'Not Interested';
    if (status === 'NotReachable') return 'Not Reachable';
    return status;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[120px]" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-[60px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <DashboardLayout title="Leads" subtitle="Manage and track your leads">
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">All Leads</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {data?.meta?.total || 0} leads
              </p>
            </div>
            {canCreate('leads') && (
              <Button className="gap-2" onClick={handleAddLead}>
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="notinterested">Not Interested</SelectItem>
                  <SelectItem value="notreachable">Not Reachable</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error State */}
          {isError && (
            <div className="py-8 text-center">
              <p className="text-destructive">
                Failed to load leads: {error?.message || 'Unknown error'}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Table */}
          {!isError && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Lead</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <p className="text-muted-foreground">
                          {searchQuery || statusFilter !== 'all'
                            ? 'No leads found matching your criteria.'
                            : 'No leads yet. Click "Add Lead" to create one.'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="cursor-pointer">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getFullName(lead)}`}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(lead.firstName, lead.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {getFullName(lead)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lead.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {lead.phone || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusColors[lead.status]}
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={priorityColors[lead.priority] || ''}
                          >
                            {lead.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {lead.source || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {(canUpdate('leads') || canDelete('leads') || hasPermission('leads', 'convert')) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                {canUpdate('leads') && (
                                  <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                                    Edit Lead
                                  </DropdownMenuItem>
                                )}
                                {canUpdate('leads') && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuSub>
                                      <DropdownMenuSubTrigger>
                                        Change Status
                                      </DropdownMenuSubTrigger>
                                      <DropdownMenuSubContent className="w-48">
                                        {getAvailableStatuses(lead.status).map((status) => (
                                          <DropdownMenuItem
                                            key={status}
                                            onClick={() => handleChangeStatus(lead, status)}
                                            disabled={updateLead.isPending}
                                          >
                                            {updateLead.isPending && selectedLead?.id === lead.id ? (
                                              <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                              </>
                                            ) : (
                                              `Mark as ${formatStatusName(status)}`
                                            )}
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                  </>
                                )}
                                {hasPermission('leads', 'convert') && lead.status !== 'Converted' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleConvertLead(lead)}
                                      disabled={convertToStudent.isPending}
                                    >
                                      {convertToStudent.isPending ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Converting...
                                        </>
                                      ) : (
                                        'Convert to Student'
                                      )}
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {canDelete('leads') && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteLead(lead)}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.meta.page} of {data.meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.meta.totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LeadFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        lead={selectedLead}
      />

      <DeleteLeadDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        lead={selectedLead}
      />
    </DashboardLayout>
  );
};

export default Leads;
