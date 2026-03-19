import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTablePagination } from '@/components/shared/DataTablePagination';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Users,
  Plus,
  Settings,
  DollarSign,
  Package,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2,
  BookOpen,
  FileCheck
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServices } from "@/hooks/useServices";
import { useClasses } from "@/hooks/useClasses";
import { useTests } from "@/hooks/useTests";
import { usePermissions } from "@/contexts/PermissionContext";
import { ServiceFormDialog } from "@/components/services/ServiceFormDialog";
import { DeleteServiceDialog } from "@/components/services/DeleteServiceDialog";
import { ClassFormDialog } from "@/components/services/ClassFormDialog";
import { DeleteClassDialog } from "@/components/services/DeleteClassDialog";
import { TestFormDialog } from "@/components/services/TestFormDialog";
import { DeleteTestDialog } from "@/components/services/DeleteTestDialog";
import type { Service } from "@/types/service.types";
import type { Class } from "@/types/class.types";
import type { Test } from "@/types/test.types";

const Services = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isError } = useServices({
    page,
    limit,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [classPage, setClassPage] = useState(1);
  const [classLimit, setClassLimit] = useState(10);
  const { 
    data: classesData, 
    isLoading: isClassesLoading, 
    isError: isClassesError 
  } = useClasses({
    page: classPage,
    limit: classLimit,
  });

  const [testPage, setTestPage] = useState(1);
  const [testLimit, setTestLimit] = useState(10);
  const {
    data: testsData,
    isLoading: isTestsLoading,
    isError: isTestsError
  } = useTests({
    page: testPage,
    limit: testLimit,
  });

  const { canCreate, canUpdate, canDelete } = usePermissions();

  const services = data?.data || [];
  const totalServices = data?.total || 0;

  const classes = classesData?.data || [];
  const totalClasses = classesData?.total || 0;

  const tests = testsData?.data || [];
  const totalTests = testsData?.total || 0;

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [classFormOpen, setClassFormOpen] = useState(false);
  const [classDeleteOpen, setClassDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const [testFormOpen, setTestFormOpen] = useState(false);
  const [testDeleteOpen, setTestDeleteOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle add new service
  const handleAddService = () => {
    setSelectedService(null);
    setFormDialogOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setFormDialogOpen(true);
  };

  // Handle delete service
  const handleDeleteService = (service: Service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  // Class handlers
  const handleAddClass = () => {
    setSelectedClass(null);
    setClassFormOpen(true);
  };

  const handleEditClass = (classData: Class) => {
    setSelectedClass(classData);
    setClassFormOpen(true);
  };

  const handleDeleteClass = (classData: Class) => {
    setSelectedClass(classData);
    setClassDeleteOpen(true);
  };

  // Test handlers
  const handleAddTest = () => {
    setSelectedTest(null);
    setTestFormOpen(true);
  };

  const handleEditTest = (testData: Test) => {
    setSelectedTest(testData);
    setTestFormOpen(true);
  };

  const handleDeleteTest = (testData: Test) => {
    setSelectedTest(testData);
    setTestDeleteOpen(true);
  };

  // Loading skeleton for stats
  const StatSkeleton = () => (
    <Skeleton className="h-8 w-16 mb-1" />
  );

  // Loading skeleton for cards
  const CardSkeleton = () => (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Services" subtitle="Manage your academic offerings and services">
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-muted/50 p-1 text-muted-foreground w-auto shadow-sm">
          <TabsTrigger 
            value="services" 
            className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
          >
            <Package className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="classes" 
            className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
          >
            <BookOpen className="h-4 w-4" />
            Classes
          </TabsTrigger>
          <TabsTrigger 
            value="tests" 
            className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
          >
            <FileCheck className="h-4 w-4" />
            Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? <StatSkeleton /> : (
                  <p className="text-2xl font-bold">{totalServices}</p>
                )}
                <p className="text-sm text-muted-foreground">Total Services</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? <StatSkeleton /> : (
                  <p className="text-2xl font-bold">{services.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Active Services</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? <StatSkeleton /> : (
                  <p className="text-2xl font-bold">
                    {services.reduce((acc, s) => acc + s.price, 0) > 0
                      ? formatPrice(services.reduce((acc, s) => acc + s.price, 0))
                      : '$0'}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Service Catalog</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your consultancy offerings</p>
            </div>
            {canCreate('services') && (
              <Button className="gap-2" onClick={handleAddService}>
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load services</h3>
              <p className="text-sm text-muted-foreground mb-4">
                An error occurred while fetching services
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && services.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first service
              </p>
              {canCreate('services') && (
                <Button className="gap-2" onClick={handleAddService}>
                  <Plus className="h-4 w-4" />
                  Add Service
                </Button>
              )}
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && !isError && services.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: Service) => (
                <Card key={service.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge
                            variant="outline"
                            className="bg-success/10 text-success border-success/20"
                          >
                            Active
                          </Badge>
                        </div>
                      </div>
                      {(canUpdate('services') || canDelete('services')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canUpdate('services') && (
                              <DropdownMenuItem onClick={() => handleEditService(service)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete('services') && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteService(service)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description || "No description provided"}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-medium">{formatPrice(service.price)}</span>
                      </div>
                      <Badge variant="secondary">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="classes" className="animate-in fade-in-50 duration-300">
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Academic Classes</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your academic schedules and instructors</p>
            </div>
            {canCreate('services') && (
              <Button className="gap-2" onClick={handleAddClass}>
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {isClassesError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load classes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                An error occurred while fetching class data
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isClassesLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isClassesLoading && !isClassesError && classes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set up your first academic class and schedule
              </p>
              {canCreate('services') && (
                <Button className="gap-2" onClick={handleAddClass}>
                  <Plus className="h-4 w-4" />
                  Add Class
                </Button>
              )}
            </div>
          )}

          {/* Classes Grid */}
          {!isClassesLoading && !isClassesError && classes.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((classData: Class) => (
                <Card 
                  key={classData.id} 
                  className="border border-border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/services/classes/${classData.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{classData.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {classData.description || "Academic Class"}
                          </p>
                        </div>
                      </div>
                      {(canUpdate('services') || canDelete('services')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canUpdate('services') && (
                              <DropdownMenuItem onClick={() => handleEditClass(classData)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete('services') && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteClass(classData)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Instructor: {classData.instructorName || 'Assigned'}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Schedule</p>
                        <div className="flex flex-wrap gap-1">
                          {classData.schedule.map((s, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0 flex flex-col items-start gap-0">
                              <span className="font-bold">{s.day.substring(0, 3)}</span>
                              <span className="opacity-80 font-normal">{s.startTime}-{s.endTime}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>Capacity: {classData.studentCapacity} students</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Settings className="h-3 w-3" />
                        <span>ID: {classData.id.substring(0, 8)}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {new Date(classData.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {classesData && (
            <DataTablePagination
              pageIndex={classPage}
              pageSize={classLimit}
              totalItems={classesData.total}
              totalPages={classesData.totalPages}
              onPageChange={setClassPage}
              onPageSizeChange={(newLimit) => {
                setClassLimit(newLimit);
                setClassPage(1);
              }}
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="tests" className="animate-in fade-in-50 duration-300">
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Testing Systems</CardTitle>
              <p className="text-sm text-muted-foreground">Manage various test types and capacities</p>
            </div>
            {canCreate('services') && (
              <Button className="gap-2" onClick={handleAddTest}>
                <Plus className="h-4 w-4" />
                Add New Test
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {isTestsError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load tests</h3>
              <p className="text-sm text-muted-foreground mb-4">
                An error occurred while fetching test options
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isTestsLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isTestsLoading && !isTestsError && tests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tests configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first testing system to start managing exams
              </p>
              {canCreate('services') && (
                <Button className="gap-2" onClick={handleAddTest}>
                  <Plus className="h-4 w-4" />
                  Add New Test
                </Button>
              )}
            </div>
          )}

          {/* Tests Grid */}
          {!isTestsLoading && !isTestsError && tests.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tests.map((testData: Test) => (
                <Card key={testData.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                          <FileCheck className="h-6 w-6 text-info" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{testData.name}</h3>
                          <Badge variant="secondary">{testData.type}</Badge>
                        </div>
                      </div>
                      {(canUpdate('services') || canDelete('services')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canUpdate('services') && (
                              <DropdownMenuItem onClick={() => handleEditTest(testData)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete('services') && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteTest(testData)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {testData.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Cap: {testData.studentCapacity}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        ID: {testData.id.substring(0, 8)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {testsData && (
            <DataTablePagination
              pageIndex={testPage}
              pageSize={testLimit}
              totalItems={testsData.total}
              totalPages={testsData.totalPages}
              onPageChange={setTestPage}
              onPageSizeChange={(newLimit) => {
                setTestLimit(newLimit);
                setTestPage(1);
              }}
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>

      </Tabs>

      {/* Dialogs */}
      <ServiceFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        service={selectedService}
      />
      <DeleteServiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        service={selectedService}
      />

      <ClassFormDialog
        open={classFormOpen}
        onOpenChange={setClassFormOpen}
        classData={selectedClass}
      />
      <DeleteClassDialog
        open={classDeleteOpen}
        onOpenChange={setClassDeleteOpen}
        classData={selectedClass}
      />

      <TestFormDialog
        open={testFormOpen}
        onOpenChange={setTestFormOpen}
        testData={selectedTest}
      />
      <DeleteTestDialog
        open={testDeleteOpen}
        onOpenChange={setTestDeleteOpen}
        testData={selectedTest}
      />
    </DashboardLayout>
  );
};

export default Services;
