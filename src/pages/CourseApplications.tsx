import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
} from '@/components/ui/card';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    MoreVertical, 
    Trash2, 
    Download, 
    FileText,
    GraduationCap,
    Clock,
    CheckCircle2,
    XCircle,
    Eye
} from 'lucide-react';
import { useCourseApplications } from '@/hooks/useCourseApplications';
import { ApplicationFilters } from '@/components/applications/ApplicationFilters';
import { DeleteApplicationDialog } from '@/components/applications/DeleteApplicationDialog';
import { ApplicationDetailDialog } from '@/components/applications/ApplicationDetailDialog';
import { UpdateStatusDialog } from '@/components/applications/UpdateStatusDialog';
import type { CourseApplication, ApplicationStatus, CourseApplicationFilters } from '@/types/course-application.types';
import { format } from 'date-fns';

const statusColors: Record<ApplicationStatus, string> = {
    Draft: 'bg-gray-100 text-gray-700 border-gray-200',
    Submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    UnderReview: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Shortlisted: 'bg-purple-100 text-purple-700 border-purple-200',
    OfferReceived: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Accepted: 'bg-green-100 text-green-700 border-green-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
    Withdrawn: 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function CourseApplications() {
    const [filters, setFilters] = useState<CourseApplicationFilters>({
        page: 1,
        limit: 10,
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<CourseApplication | null>(null);

    const { data: applicationsData, isLoading } = useCourseApplications(filters);

    const handleDelete = (application: CourseApplication) => {
        setSelectedApplication(application);
        setIsDeleteDialogOpen(true);
    };

    const handleViewDetails = (application: CourseApplication) => {
        setSelectedApplication(application);
        setIsDetailOpen(true);
    };

    const handleUpdateStatus = (application: CourseApplication) => {
        setSelectedApplication(application);
        setIsUpdateStatusOpen(true);
    };

    return (
        <DashboardLayout 
            title="Course Applications" 
            subtitle="Manage and track student course applications"
        >
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="shadow-sm border-none bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicationsData?.total || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all students</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-blue-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {applicationsData?.data.filter(a => a.status === 'UnderReview').length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Pending evaluation</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {applicationsData?.data.filter(a => a.status === 'Accepted').length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Successful placement</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-red-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {applicationsData?.data.filter(a => a.status === 'Rejected').length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Not eligible</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-card border-none overflow-hidden">
                <CardHeader className="pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <h3 className="text-lg font-semibold text-foreground">All Applications</h3>
                            <ApplicationFilters 
                                filters={filters} 
                                onFiltersChange={setFilters} 
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10 rounded-xl gap-2 font-medium">
                                <Download className="h-4 w-4" />
                                Export List
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-muted/30">
                                    <TableHead className="font-semibold">Student</TableHead>
                                    <TableHead className="font-semibold">Course</TableHead>
                                    <TableHead className="font-semibold">University</TableHead>
                                    <TableHead className="font-semibold">Intake</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="w-[80px] text-right font-semibold"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-6 w-24 bg-muted animate-pulse rounded-full" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : !applicationsData?.data || applicationsData.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="p-4 rounded-full bg-muted/30">
                                                    <GraduationCap className="h-10 w-10 text-muted-foreground/30" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-semibold text-foreground">No applications found</p>
                                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                                        There are no course applications matching your criteria.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    applicationsData?.data.map((application) => (
                                        <TableRow key={application.id} className="group hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="font-medium text-foreground">
                                                    {application.student?.firstName} {application.student?.lastName}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {application.student?.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {application.course?.name || 'Unknown Course'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Fees: {application.course?.fees ? `${application.course.fees}` : '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {application.university?.name || '-'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {application.university?.country?.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium text-primary">
                                                    {application.intakePeriod || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[application.status] || ''}`}
                                                >
                                                    {application.status.replace(/([A-Z])/g, ' $1').trim()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background shadow-none">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-muted-foreground/10">
                                                        <DropdownMenuItem 
                                                            onClick={() => handleViewDetails(application)}
                                                            className="gap-2 cursor-pointer"
                                                        >
                                                            <Eye className="h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleUpdateStatus(application)}
                                                            className="gap-2 cursor-pointer"
                                                        >
                                                            <Clock className="h-4 w-4" /> Change Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Download className="h-4 w-4" /> Documents
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDelete(application)}
                                                            className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <DeleteApplicationDialog 
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                applicationId={selectedApplication?.id || null}
                studentName={selectedApplication ? `${selectedApplication.student?.firstName} ${selectedApplication.student?.lastName}` : undefined}
            />

            <ApplicationDetailDialog 
                open={isDetailOpen} 
                onOpenChange={setIsDetailOpen} 
                applicationId={selectedApplication?.id || null}
            />

            <UpdateStatusDialog 
                open={isUpdateStatusOpen} 
                onOpenChange={setIsUpdateStatusOpen} 
                applicationId={selectedApplication?.id || null}
                currentStatus={selectedApplication?.status || null}
            />
        </DashboardLayout>
    );
}
