import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Plane, Clock, CheckCircle, XCircle, Globe, FileX, Loader2, ExternalLink } from "lucide-react";
import { WorkflowDetailModal } from "@/components/workflow/WorkflowDetailModal";
import { Workflow } from "@/types/workflow.types";
import { useVisaTypes, useDeleteVisaType } from "@/hooks/useVisaTypes";
import { useVisaApplications } from "@/hooks/useVisaApplications";
import { useStudents } from "@/hooks/useStudents";
import { VisaTypeCard } from "@/components/visaTypes/VisaTypeCard";
import { CreateVisaTypeDialog } from "@/components/visaTypes/CreateVisaTypeDialog";
import { EditVisaTypeDialog } from "@/components/visaTypes/EditVisaTypeDialog";
import { VisaTypeDetailModal } from "@/components/visaTypes/VisaTypeDetailModal";
import { VisaType } from "@/types/visaType.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import countryService from "@/services/country.service";
import { format } from "date-fns";



const countryStats = [
  { country: "United Kingdom", total: 45, approved: 32, pending: 10, rejected: 3, flag: "🇬🇧" },
  { country: "Canada", total: 38, approved: 28, pending: 8, rejected: 2, flag: "🇨🇦" },
  { country: "Australia", total: 29, approved: 20, pending: 7, rejected: 2, flag: "🇦🇺" },
  { country: "USA", total: 35, approved: 22, pending: 9, rejected: 4, flag: "🇺🇸" },
  { country: "Germany", total: 22, approved: 18, pending: 3, rejected: 1, flag: "🇩🇪" },
  { country: "Ireland", total: 18, approved: 14, pending: 4, rejected: 0, flag: "🇮🇪" },
];

const statusColors: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  "In Process": "bg-info/10 text-info border-info/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  UnderReview: "bg-info/10 text-info border-info/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle className="h-4 w-4 text-success" />,
  Pending: <Clock className="h-4 w-4 text-warning" />,
  "In Process": <Plane className="h-4 w-4 text-info" />,
  "UnderReview": <Loader2 className="h-4 w-4 text-info animate-spin" />,
  Rejected: <XCircle className="h-4 w-4 text-destructive" />,
};

const Visas = () => {
  const navigate = useNavigate();
  // Visa Types state
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null);
  const [editVisaType, setEditVisaType] = useState<VisaType | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedVisaId, setSelectedVisaId] = useState<string>("");
  const [currentStepId, setCurrentStepId] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Applications tab state
  const [appPage, setAppPage] = useState(1);
  const [appLimit, setAppLimit] = useState(12);
  const [appSearch, setAppSearch] = useState("");
  const [appStatus, setAppStatus] = useState<string>("all");
  const [appStudentId, setAppStudentId] = useState<string>("all");


  const { data, isLoading, isError, error } = useVisaTypes({
    page,
    limit,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const deleteVisaTypeMutation = useDeleteVisaType();

  // Fetch visa applications
  const { data: appData, isLoading: isLoadingApps } = useVisaApplications({
    page: appPage,
    limit: appLimit,
    search: appSearch || undefined,
    status: appStatus !== "all" ? appStatus : undefined,
    studentId: appStudentId !== "all" ? appStudentId : undefined,
  });

  // Fetch students for filter
  const { data: studentsData } = useStudents({ limit: 100 });
  const students = studentsData?.data || [];

  // Fetch countries for filter
  const { data: countries = [] } = useQuery({
    queryKey: ['countries', 'active'],
    queryFn: () => countryService.getActiveCountries(),
  });

  // Filter visa types
  const visaTypes = data?.data || [];
  let filteredVisaTypes = visaTypes;

  if (countryFilter !== "all") {
    filteredVisaTypes = filteredVisaTypes.filter(vt => vt.countryId === countryFilter);
  }

  if (statusFilter !== "all") {
    filteredVisaTypes = filteredVisaTypes.filter(vt =>
      statusFilter === "active" ? vt.isActive : !vt.isActive
    );
  }

  const handleViewVisaType = (visaType: VisaType) => {
    setSelectedVisaType(visaType);
    setDetailModalOpen(true);
  };

  const handleEditVisaType = (visaType: VisaType) => {
    setEditVisaType(visaType);
    setEditModalOpen(true);
  };

  const handleDeleteVisaType = (id: string) => {
    deleteVisaTypeMutation.mutate(id);
  };

  return (
    <DashboardLayout title="Visas" subtitle="Manage visa types and track applications">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Plane className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">67</p>
                <p className="text-sm text-muted-foreground">In Process</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visaTypes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visaTypes">Visa Types</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="countries">By Country</TabsTrigger>
        </TabsList>

        {/* Visa Types Tab */}
        <TabsContent value="visaTypes">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search visa types..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              <CreateVisaTypeDialog />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country: any) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
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
                Failed to load visa types: {(error as any)?.message || "Unknown error"}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredVisaTypes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
              <Globe className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                {search || countryFilter !== "all" || statusFilter !== "all"
                  ? "No visa types match your filters"
                  : "No visa types created yet"}
              </p>
              {!search && countryFilter === "all" && statusFilter === "all" && (
                <CreateVisaTypeDialog />
              )}
            </div>
          )}

          {/* Visa Types Grid */}
          {!isLoading && !isError && filteredVisaTypes.length > 0 && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredVisaTypes.map((visaType) => (
                  <VisaTypeCard
                    key={visaType.id}
                    visaType={visaType}
                    onView={handleViewVisaType}
                    onEdit={handleEditVisaType}
                    onDelete={handleDeleteVisaType}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data && (
                <DataTablePagination
                  pageIndex={page}
                  pageSize={limit}
                  totalItems={data.total}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                  onPageSizeChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                  pageSizeOptions={[12, 24, 48, 96]}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold">Visa Applications</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage and track all visa filings</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="relative w-full sm:w-[250px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                        placeholder="Search applications..." 
                        className="pl-9"
                        value={appSearch}
                        onChange={(e) => {
                            setAppSearch(e.target.value);
                            setAppPage(1);
                        }}
                    />
                  </div>
                  
                  <Select value={appStatus} onValueChange={(v) => { setAppStatus(v); setAppPage(1); }}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="UnderReview">Under Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={appStudentId} onValueChange={(v) => { setAppStudentId(v); setAppPage(1); }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Application
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingApps ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !appData || appData.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                    <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No Applications Found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appData.map((visa) => (
                    <div
                      key={visa.id}
                      className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer group"
                      onClick={() => visa.studentId && navigate(`/applicants/${visa.studentId}?tab=visa`)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${visa.student?.firstName || 'User'}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {visa.student ? `${visa.student.firstName[0]}${visa.student.lastName[0]}` : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {visa.student ? `${visa.student.firstName} ${visa.student.lastName}` : 'Unknown Student'}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Plane className="h-3 w-3" />
                            {visa.visaType?.name || 'Unknown Visa Type'}
                            {visa.workflow && (
                              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded ml-2 border border-border/50">
                                {visa.workflow.name}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium flex items-center justify-end gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                            {visa.destinationCountry}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {visa.submissionDate 
                              ? `Submitted: ${format(new Date(visa.submissionDate), 'MMM d, yyyy')}`
                              : `Created: ${format(new Date(visa.createdAt), 'MMM d, yyyy')}`
                            }
                          </p>
                        </div>
                         <div className="flex items-center gap-2">
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={`gap-1.5 py-1 px-3 ${statusColors[visa.status] || "bg-muted text-muted-foreground"}`}>
                              {statusIcons[visa.status]}
                              {visa.status}
                            </Badge>
                            {visa.workflow && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-[10px] gap-1 hover:bg-primary/10 text-primary-foreground/70 hover:text-primary transition-all pr-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedVisaId(visa.id);
                                  setCurrentStepId(visa.currentStepId || "");
                                  setSelectedWorkflow(visa.workflow as any);
                                  setWorkflowModalOpen(true);
                                }}
                              >
                                <ExternalLink className="h-3 w-3" />
                                Go to workflow
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] gap-1 hover:bg-primary/10 text-primary-foreground/70 hover:text-primary transition-all pr-0 lg:pr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/visas/${visa.id}`);
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className="pt-4 mt-6 border-t">
                      <DataTablePagination
                          pageIndex={appPage}
                          pageSize={appLimit}
                          totalItems={appData.length}
                          totalPages={1}
                          onPageChange={setAppPage}
                          onPageSizeChange={(newLimit) => {
                              setAppLimit(newLimit);
                              setAppPage(1);
                          }}
                          pageSizeOptions={[12, 24, 48]}
                      />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Country Tab */}
        <TabsContent value="countries">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Visa Applications by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {countryStats.map((country) => (
                  <Card key={country.country} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <p className="font-semibold">{country.country}</p>
                          <p className="text-sm text-muted-foreground">{country.total} total applications</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-success/10 p-2">
                          <p className="text-lg font-bold text-success">{country.approved}</p>
                          <p className="text-xs text-muted-foreground">Approved</p>
                        </div>
                        <div className="rounded-lg bg-warning/10 p-2">
                          <p className="text-lg font-bold text-warning">{country.pending}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                        <div className="rounded-lg bg-destructive/10 p-2">
                          <p className="text-lg font-bold text-destructive">{country.rejected}</p>
                          <p className="text-xs text-muted-foreground">Rejected</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <VisaTypeDetailModal
        visaType={selectedVisaType}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
      <EditVisaTypeDialog
        visaType={editVisaType}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <WorkflowDetailModal
        workflow={selectedWorkflow}
        open={workflowModalOpen}
        onOpenChange={setWorkflowModalOpen}
        visaId={selectedVisaId}
        currentStepId={currentStepId}
      />
    </DashboardLayout>
  );
};

export default Visas;
