import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    User,
    GraduationCap,
    FileText,
    Edit,
    Trash2,
    CreditCard,
    File,
    Download,
    Eye,
    ExternalLink,
    MoreVertical,
    Briefcase,
    BookOpen,
    ClipboardList,
    UserMinus,
    Loader2,
    Globe,
    Plus,
    UserCheck,
    Shield,
    CheckCircle2
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudent, useStudentDocuments } from '@/hooks/useStudents';
import { useUnenrollStudent } from '@/hooks/useClasses';
import { ApplicantFormDialog } from '@/components/applicants/ApplicantFormDialog';
import { DeleteApplicantDialog } from '@/components/applicants/DeleteApplicantDialog';
import { DocumentUploadDialog } from '@/components/applicants/DocumentUploadDialog';
import { AssignClassDialog } from '@/components/applicants/AssignClassDialog';
import { AssignTestDialog } from '@/components/applicants/AssignTestDialog';
import { VisaApplicationDialog } from '@/components/applicants/VisaApplicationDialog';
import { useStudentVisaApplications, useDeleteVisaApplication } from '@/hooks/useVisaApplications';
import { StudentApplicationsTab } from '@/components/students/StudentApplicationsTab';
import { useState } from 'react';
import type { StudentStatus, StudentPriority } from '@/types/student.types';

// Action colors
const statusColors: Record<StudentStatus, string> = {
    Prospective: 'bg-info/10 text-info border-info/20',
    Enrolled: 'bg-success/10 text-success border-success/20',
    Alumni: 'bg-muted text-muted-foreground border-muted',
};

const FILE_BASE_URL = 'http://crmapi.vizon-x.com/uploads';

// Priority colors
const priorityColors: Record<StudentPriority, string> = {
    High: 'bg-destructive/10 text-destructive border-destructive/20',
    Medium: 'bg-warning/10 text-warning border-warning/20',
    Low: 'bg-muted text-muted-foreground border-muted',
};

const ApplicantDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [assignClassDialogOpen, setAssignClassDialogOpen] = useState(false);
    const [assignTestDialogOpen, setAssignTestDialogOpen] = useState(false);
    const [visaApplicationDialogOpen, setVisaApplicationDialogOpen] = useState(false);

    const { data: applicant, isLoading, isError, error } = useStudent(id || '');
    const { mutate: unenroll, isPending: isUnenrolling } = useUnenrollStudent();
    const { data: visaApplicationsData, isLoading: isLoadingVisas } = useStudentVisaApplications(id || '');
    const { mutate: deleteVisaApplication } = useDeleteVisaApplication();

    // Helper to get full file URL
    const getFileUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${FILE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    // Helper to get initials
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    // Handle delete success
    const handleDeleteSuccess = () => {
        setDeleteDialogOpen(false);
        navigate('/applicants');
    };

    if (isLoading) {
        return (
            <DashboardLayout title="Applicant Details" subtitle="Loading...">
                <div className="space-y-6">
                    <Skeleton className="h-10 w-32" />
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="space-y-3 flex-1">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    if (isError || !applicant) {
        return (
            <DashboardLayout title="Applicant Details" subtitle="Error loading applicant">
                <Card className="shadow-card">
                    <CardContent className="p-8 text-center">
                        <p className="text-destructive mb-4">
                            {error?.message || 'Failed to load applicant details'}
                        </p>
                        <Button onClick={() => navigate('/applicants')} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Applicants
                        </Button>
                    </CardContent>
                </Card>
            </DashboardLayout>
        );
    }

    // Helper to render raw data beautifully
    const renderFormattedData = (data: any, icon: React.ReactNode) => {
        if (!data) return null;
        
        // Handle "raw" field if present, or "academicBackground" / "testScores" naming from forms
        const rawContent = data.raw || (typeof data === 'string' ? data : null);
        
        if (typeof rawContent === 'string' && rawContent.trim() !== '') {
            const lines = rawContent.split('\n').filter(line => line.trim() !== '');
            if (lines.length > 0) {
                return (
                    <div className="space-y-3">
                        {lines.map((line, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-background/60 border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-200">
                                <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                                    {icon}
                                </div>
                                <p className="text-sm font-medium text-foreground/90 leading-relaxed pt-0.5">{line}</p>
                            </div>
                        ))}
                    </div>
                );
            }
        }
        
        // Fallback for objects that aren't strings
        if (typeof data === 'object' && Object.keys(data).length > 0) {
            return (
                <div className="p-4 rounded-xl bg-muted/20 border font-mono text-xs overflow-auto max-h-[200px]">
                    {JSON.stringify(data, null, 2)}
                </div>
            );
        }
        
        return null;
    };

    return (
        <DashboardLayout
            title={`${applicant.firstName} ${applicant.lastName}`}
            subtitle="Applicant Profile"
        >
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-6 gap-2"
                onClick={() => navigate('/applicants')}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Applicants
            </Button>

            {/* Profile Header */}
            <Card className="mb-6 shadow-card overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background" />
                <CardContent className="relative pt-0 px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between -mt-10 gap-6">
                        <div className="flex items-end gap-6">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-xl rounded-2xl">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.firstName}${applicant.lastName}`}
                                />
                                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                                    {getInitials(applicant.firstName, applicant.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="mb-2">
                                <CardTitle className="text-3xl font-bold">
                                    {applicant.firstName} {applicant.lastName}
                                </CardTitle>
                                <div className="flex gap-2 mt-3">
                                    <Badge variant="outline" className={`${statusColors[applicant.status]} border-2`}>
                                        {applicant.status}
                                    </Badge>
                                    <Badge variant="outline" className={`${priorityColors[applicant.priority]} border-2`}>
                                        {applicant.priority} Priority
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-2">
                            <Button
                                variant="outline"
                                className="shadow-sm gap-2"
                                onClick={() => setEditDialogOpen(true)}
                            >
                                <Edit className="h-4 w-4" />
                                Edit Profile
                            </Button>
                            <Button
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10 border-destructive/20 shadow-sm gap-2"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-muted/50 p-1 text-muted-foreground w-auto shadow-sm">
                    <TabsTrigger 
                        value="profile" 
                        className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
                    >
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger 
                        value="documents" 
                        className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
                    >
                        <FileText className="h-4 w-4" />
                        Documents
                    </TabsTrigger>
                    <TabsTrigger 
                        value="service" 
                        className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
                    >
                        <Briefcase className="h-4 w-4" />
                        Service
                    </TabsTrigger>
                    <TabsTrigger 
                        value="payment" 
                        className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
                    >
                        <CreditCard className="h-4 w-4" />
                        Payment
                    </TabsTrigger>
                    <TabsTrigger 
                        value="visa" 
                        className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
                    >
                        <Globe className="h-4 w-4" />
                        Visa
                    </TabsTrigger>
                    <TabsTrigger 
                        value="applications" 
                        className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
                    >
                        <GraduationCap className="h-4 w-4" />
                        Applications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Profile Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Personal Details
                                    </CardTitle>
                                    <CardDescription>Contact information and bio</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Contact Information */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-4 p-4 rounded-xl border bg-background/50 hover:border-primary/50 transition-colors shadow-sm">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Address</p>
                                                <p className="font-semibold text-foreground">{applicant.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-xl border bg-background/50 hover:border-primary/50 transition-colors shadow-sm">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone Number</p>
                                                <p className="font-semibold text-foreground">{applicant.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="opacity-50" />

                                    {/* Assigned Counselor */}
                                    {applicant.assignedCounselor && (
                                        <>
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <UserCheck className="h-5 w-5 text-primary" />
                                                    Assigned Counselor
                                                </h3>
                                                <div className="flex items-center gap-4 p-4 rounded-xl border bg-success/5 border-success/20 shadow-sm">
                                                    <div className="p-2.5 rounded-lg bg-success/10">
                                                        <Shield className="h-5 w-5 text-success" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground text-base">{applicant.assignedCounselor.name}</p>
                                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                                                            {applicant.assignedCounselor.role?.name || 'COUNSELOR'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator className="opacity-50" />
                                        </>
                                    )}

                                    {/* Academic Records */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                            Academic Records
                                        </h3>
                                        <div className="p-1 rounded-xl">
                                            {renderFormattedData(applicant.academicRecords, <CheckCircle2 className="h-3.5 w-3.5 text-primary" />) || (
                                                <div className="text-center py-8 bg-muted/10 border border-dashed rounded-xl">
                                                    <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                                                    <p className="text-muted-foreground text-sm">No academic records found</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Separator className="opacity-50" />

                                    {/* Test Scores */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <ClipboardList className="h-5 w-5 text-primary" />
                                            Test Scores
                                        </h3>
                                        <div className="p-1 rounded-xl">
                                            {renderFormattedData(applicant.testScores, <CheckCircle2 className="h-3.5 w-3.5 text-primary" />) || (
                                                <div className="text-center py-8 bg-muted/10 border border-dashed rounded-xl">
                                                    <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                                                    <p className="text-muted-foreground text-sm">No test scores found</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Side Info */}
                        <div className="space-y-6">
                            <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                                        <span className="text-sm text-muted-foreground">Created On</span>
                                        <span className="text-sm font-semibold">
                                            {new Date(applicant.createdDate).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                                        <span className="text-sm text-muted-foreground">Last Modified</span>
                                        <span className="text-sm font-semibold">
                                            {new Date(applicant.updatedAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="documents" className="animate-in fade-in-50 duration-300">
                    <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Documents
                                </CardTitle>
                                <CardDescription>Manage and view uploaded files</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2" onClick={() => setUploadDialogOpen(true)}>
                                <FileText className="h-4 w-4" />
                                Upload New
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {!applicant.documents || applicant.documents.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold">No Documents</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        There are no documents uploaded for this applicant yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {applicant.documents.map((doc) => (
                                        <Card key={doc.id} className="group border bg-background/50 hover:border-primary/50 transition-all shadow-sm">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors">
                                                        <File className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm truncate uppercase tracking-tight">
                                                            {doc.documentType}
                                                        </h4>
                                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => window.open(getFileUrl(doc.filePath), '_blank')}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {
                                                                const link = document.createElement('a');
                                                                link.href = getFileUrl(doc.filePath);
                                                                link.setAttribute('download', doc.filePath.split('/').pop() || 'document');
                                                                link.click();
                                                            }}>
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Download
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2">
                                                    <Button variant="secondary" size="sm" className="w-full text-xs h-8 gap-1.5" onClick={() => window.open(getFileUrl(doc.filePath), '_blank')}>
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                        Preview
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="service" className="animate-in fade-in-50 duration-300 space-y-6">
                    {/* Academic Classes Table */}
                    <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    Academic Classes
                                </CardTitle>
                                <CardDescription>Classes enrolled by the student</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    {applicant.classEnrollments?.length || 0} enrolled
                                </Badge>
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setAssignClassDialogOpen(true)}>
                                    <BookOpen className="h-4 w-4" />
                                    Assign Class
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-xl border border-muted-foreground/10 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="font-semibold">Class Name</TableHead>
                                            <TableHead className="font-semibold">Instructor</TableHead>
                                            <TableHead className="font-semibold">Schedule</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!applicant.classEnrollments?.length ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                    No classes assigned yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            applicant.classEnrollments.map((enrollment: any) => {
                                                const cls = enrollment.class;
                                                return (
                                                    <TableRow key={enrollment.id}>
                                                        <TableCell className="font-medium">{cls.name}</TableCell>
                                                        <TableCell>{(typeof cls.instructor === 'object' ? cls.instructor?.name : cls.instructor) || cls.instructorName || 'N/A'}</TableCell>
                                                        <TableCell className="max-w-[200px] truncate">
                                                            {Array.isArray(cls.schedule) && cls.schedule.length > 0 
                                                                ? cls.schedule.map((s: any) => `${s.day.substring(0, 3)}`).join(', ') 
                                                                : (cls.schedule && typeof cls.schedule === 'object' && Array.isArray(cls.schedule.days))
                                                                    ? cls.schedule.days.map((d: string) => d.substring(0, 3)).join(', ')
                                                                    : 'Flexible'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className={`
                                                                ${enrollment.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-muted/50'}
                                                            `}>
                                                                {enrollment.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                                                                onClick={() => unenroll({ classId: cls.id, studentId: applicant.id })}
                                                                disabled={isUnenrolling}
                                                            >
                                                                {isUnenrolling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserMinus className="h-3.5 w-3.5" />}
                                                                Unassign
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Testing Systems Table */}
                    <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    Testing Systems
                                </CardTitle>
                                <CardDescription>Test registration and results</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                                    {applicant.testAssignments?.length || 0} Registered
                                </Badge>
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setAssignTestDialogOpen(true)}>
                                    <ClipboardList className="h-4 w-4" />
                                    Assign Test
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-xl border border-muted-foreground/10 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="font-semibold">Test Name</TableHead>
                                            <TableHead className="font-semibold">Type</TableHead>
                                            <TableHead className="font-semibold">Date</TableHead>
                                            <TableHead className="font-semibold">Score/Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!applicant.testAssignments?.length ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                    No test records found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            applicant.testAssignments.map((assignment: any) => {
                                                const test = assignment.test;
                                                return (
                                                    <TableRow key={assignment.id}>
                                                        <TableCell className="font-medium">{test.name}</TableCell>
                                                        <TableCell>{test.type}</TableCell>
                                                        <TableCell>{new Date(assignment.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            {assignment.score ? (
                                                                <Badge className="bg-primary text-primary-foreground">{assignment.score}</Badge>
                                                            ) : (
                                                                <Badge variant="secondary">{assignment.status}</Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment" className="animate-in fade-in-50 duration-300">
                    <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="text-center py-10">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-2xl">Payment & Billing</CardTitle>
                            <CardDescription>
                                Track application fees and payment history.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10 text-center">
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Payment tracking functionality is currently under development. Check back soon for updates on transaction history.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="visa" className="animate-in fade-in-50 duration-300 space-y-6">
                    <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    Visa Applications
                                </CardTitle>
                                <CardDescription>Manage visa applications for this student</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => setVisaApplicationDialogOpen(true)}>
                                <Plus className="h-4 w-4" />
                                Create Application
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isLoadingVisas ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : !visaApplicationsData?.data || visaApplicationsData.data.length === 0 ? (
                                <div className="text-center py-12 border border-dashed rounded-xl bg-muted/20">
                                    <Globe className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                                    <p className="text-muted-foreground text-sm">No visa applications found</p>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-muted-foreground/10 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="font-semibold">Visa Type</TableHead>
                                                <TableHead className="font-semibold">Destination</TableHead>
                                                <TableHead className="font-semibold">Status</TableHead>
                                                <TableHead className="font-semibold text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visaApplicationsData.data.map((visa) => (
                                                <TableRow key={visa.id}>
                                                    <TableCell className="font-medium">{visa.visaType?.name || 'Unknown Type'}</TableCell>
                                                    <TableCell>{visa.destinationCountry}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                                                            {visa.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => {
                                                                if (window.confirm('Are you sure you want to delete this visa application?')) {
                                                                    deleteVisaApplication(visa.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="applications" className="animate-in fade-in-50 duration-300">
                    <StudentApplicationsTab studentId={id || ''} />
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <ApplicantFormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                applicant={applicant}
            />

            <DeleteApplicantDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) {
                        // If closed after deletion, navigate back
                    }
                }}
                applicant={applicant}
            />

            <DocumentUploadDialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
                studentId={applicant.id}
            />

            <AssignClassDialog 
                open={assignClassDialogOpen} 
                onOpenChange={setAssignClassDialogOpen} 
                studentId={id || ''} 
            />

            <AssignTestDialog 
                open={assignTestDialogOpen} 
                onOpenChange={setAssignTestDialogOpen} 
                studentId={id || ''} 
            />

            <VisaApplicationDialog
                open={visaApplicationDialogOpen}
                onOpenChange={setVisaApplicationDialogOpen}
                studentId={id || ''}
                courseApplications={applicant?.courseApplications}
            />
        </DashboardLayout>
    );
};

export default ApplicantDetail;
