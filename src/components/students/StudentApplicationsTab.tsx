import { useState } from 'react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from '@/components/ui/card';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    MoreVertical, 
    Eye, 
    Clock, 
    Download, 
    Loader2, 
    GraduationCap,
    University,
    Calendar
} from 'lucide-react';
import { useStudentCourseApplications } from '@/hooks/useCourseApplications';
import { ApplicationDetailDialog } from '@/components/applications/ApplicationDetailDialog';
import { UpdateStatusDialog } from '@/components/applications/UpdateStatusDialog';
import { format } from 'date-fns';
import type { CourseApplication, ApplicationStatus } from '@/types/course-application.types';

interface StudentApplicationsTabProps {
    studentId: string;
}

const statusColors: Record<ApplicationStatus, string> = {
    Draft: 'bg-muted text-muted-foreground border-muted',
    Submitted: 'bg-primary/10 text-primary border-primary/20',
    UnderReview: 'bg-warning/10 text-warning border-warning/20',
    Shortlisted: 'bg-success/10 text-success border-success/20',
    OfferReceived: 'bg-info/10 text-info border-info/20',
    Accepted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    Withdrawn: 'bg-muted text-muted-foreground border-muted',
};

export function StudentApplicationsTab({ studentId }: StudentApplicationsTabProps) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<CourseApplication | null>(null);

    const { data: applicationsData, isLoading } = useStudentCourseApplications(studentId);

    const handleViewDetails = (app: CourseApplication) => {
        setSelectedApplication(app);
        setIsDetailOpen(true);
    };

    const handleUpdateStatus = (app: CourseApplication) => {
        setSelectedApplication(app);
        setIsUpdateStatusOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium">Fetching applications...</p>
            </div>
        );
    }

    const applications = applicationsData?.data || [];

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                Course Applications
                            </CardTitle>
                            <CardDescription>Academic applications submitted by this student</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                            {applications.length} Total
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {applications.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-muted/20">
                                <GraduationCap className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Applications Found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                This student hasn't submitted any course applications yet. Once they do, they will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-b-border/50">
                                        <TableHead className="font-bold py-4">Course & University</TableHead>
                                        <TableHead className="font-bold py-4">Intake</TableHead>
                                        <TableHead className="font-bold py-4 text-center">Status</TableHead>
                                        <TableHead className="font-bold py-4 text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((application) => (
                                        <TableRow 
                                            key={application.id} 
                                            className="group hover:bg-primary/[0.02] transition-colors border-b-border/50"
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {application.course?.name || 'N/A'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                        <University className="h-3 w-3" />
                                                        {application.university?.name || 'N/A'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Calendar className="h-4 w-4 text-primary/60" />
                                                    {application.intakePeriod || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mx-auto transition-all duration-300 group-hover:scale-105 ${statusColors[application.status] || ''}`}
                                                >
                                                    {application.status.replace(/([A-Z])/g, ' $1').trim()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-none"
                                                        >
                                                            <MoreVertical className="h-4 w-4 font-bold" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl border-none shadow-2xl p-2 animate-in fade-in-50 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                                                        <DropdownMenuItem 
                                                            onClick={() => handleViewDetails(application)}
                                                            className="gap-2.5 cursor-pointer rounded-xl h-10 px-3 hover:bg-primary/10 hover:text-primary font-medium transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleUpdateStatus(application)}
                                                            className="gap-2.5 cursor-pointer rounded-xl h-10 px-3 hover:bg-primary/10 hover:text-primary font-medium transition-colors"
                                                        >
                                                            <Clock className="h-4 w-4" /> Change Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="gap-2.5 cursor-pointer rounded-xl h-10 px-3 hover:bg-primary/10 hover:text-primary font-medium transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" /> Documents
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

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
        </div>
    );
}
