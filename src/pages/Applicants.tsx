import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, Mail, Phone, MoreVertical } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { ApplicantFormDialog } from '@/components/applicants/ApplicantFormDialog';
import { DeleteApplicantDialog } from '@/components/applicants/DeleteApplicantDialog';
import type { Student, StudentStatus, StudentPriority } from '@/types/student.types';

// Status colors
const statusColors: Record<StudentStatus, string> = {
  Prospective: 'bg-info/10 text-info border-info/20',
  Enrolled: 'bg-success/10 text-success border-success/20',
  Alumni: 'bg-muted text-muted-foreground border-muted',
};

// Priority colors
const priorityColors: Record<StudentPriority, string> = {
  High: 'bg-destructive/10 text-destructive border-destructive/20',
  Medium: 'bg-warning/10 text-warning border-warning/20',
  Low: 'bg-muted text-muted-foreground border-muted',
};

const Applicants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Student | null>(null);

  // Fetch applicants from API
  const { data, isLoading, isError, error } = useStudents({
    page,
    limit: 10,
    search: searchQuery || undefined,
    sortOrder: 'desc',
  });

  // Filter by status locally
  const filteredApplicants = useMemo(() => {
    if (!data?.data) return [];
    if (statusFilter === 'all') return data.data;
    return data.data.filter(
      (applicant) => applicant.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [data?.data, statusFilter]);

  // Helpers
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getFullName = (applicant: Student) => {
    return `${applicant.firstName} ${applicant.lastName}`;
  };

  // Handlers
  const handleAddApplicant = () => {
    setSelectedApplicant(null);
    setFormDialogOpen(true);
  };

  const handleEditApplicant = (applicant: Student) => {
    setSelectedApplicant(applicant);
    setFormDialogOpen(true);
  };

  const handleDeleteApplicant = (applicant: Student) => {
    setSelectedApplicant(applicant);
    setDeleteDialogOpen(true);
  };

  const handleViewProfile = (applicant: Student) => {
    navigate(`/applicants/${applicant.id}`);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-primary/5 to-accent p-4 border-b border-border">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <DashboardLayout title="Applicants" subtitle="Manage student applications">
      <Card className="shadow-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">All Applicants</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {data?.meta?.total || 0} applicants
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search applicants..."
                  className="pl-9 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="prospective">Prospective</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2" onClick={handleAddApplicant}>
                <Plus className="h-4 w-4" />
                Add Applicant
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {isError && (
            <div className="py-8 text-center">
              <p className="text-destructive">
                Failed to load applicants: {error?.message || 'Unknown error'}
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

          {/* Applicants Grid */}
          {!isError && (
            <div className="grid gap-6 md:grid-cols-2">
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredApplicants.length === 0 ? (
                <div className="col-span-2 py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'No applicants found matching your criteria.'
                      : 'No applicants yet. Click "Add Applicant" to create one.'}
                  </p>
                </div>
              ) : (
                filteredApplicants.map((applicant) => (
                  <Card key={applicant.id} className="border border-border overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-primary/5 to-accent p-4 border-b border-border">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getFullName(applicant)}`}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                              {getInitials(applicant.firstName, applicant.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {getFullName(applicant)}
                                </h3>
                                <div className="flex gap-2 mt-1">
                                  <Badge
                                    variant="outline"
                                    className={statusColors[applicant.status]}
                                  >
                                    {applicant.status}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={priorityColors[applicant.priority]}
                                  >
                                    {applicant.priority}
                                  </Badge>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewProfile(applicant)}>
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditApplicant(applicant)}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteApplicant(applicant)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{applicant.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {applicant.phone || 'No phone'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Created: </span>
                            <span className="font-medium">
                              {new Date(applicant.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(applicant)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
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
      <ApplicantFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        applicant={selectedApplicant}
      />

      <DeleteApplicantDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        applicant={selectedApplicant}
      />
    </DashboardLayout>
  );
};

export default Applicants;
