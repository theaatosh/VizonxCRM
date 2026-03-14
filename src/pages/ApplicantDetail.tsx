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
    CreditCard
} from 'lucide-react';
import { useStudent, useStudentDocuments } from '@/hooks/useStudents';
import { ApplicantFormDialog } from '@/components/applicants/ApplicantFormDialog';
import { DeleteApplicantDialog } from '@/components/applicants/DeleteApplicantDialog';
import { useState } from 'react';
import type { StudentStatus, StudentPriority } from '@/types/student.types';

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

const ApplicantDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { data: applicant, isLoading, isError, error } = useStudent(id || '');

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
                        value="payment" 
                        className="flex items-center gap-2 px-6 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all font-medium"
                    >
                        <CreditCard className="h-4 w-4" />
                        Payment
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

                                    {/* Academic Records */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                            Academic Records
                                        </h3>
                                        <div className="p-6 rounded-xl bg-muted/30 border border-dashed">
                                            {applicant.academicRecords && Object.keys(applicant.academicRecords).length > 0 ? (
                                                <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                                                    {JSON.stringify(applicant.academicRecords, null, 2)}
                                                </pre>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                                                    <p className="text-muted-foreground text-sm">No academic records available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Separator className="opacity-50" />

                                    {/* Test Scores */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            Test Scores
                                        </h3>
                                        <div className="p-6 rounded-xl bg-muted/30 border border-dashed">
                                            {applicant.testScores && Object.keys(applicant.testScores).length > 0 ? (
                                                <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                                                    {JSON.stringify(applicant.testScores, null, 2)}
                                                </pre>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                                                    <p className="text-muted-foreground text-sm">No test scores available</p>
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
                                            {new Date(applicant.createdAt).toLocaleDateString(undefined, {
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
                        <CardHeader className="text-center py-10">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-2xl">Applicant Documents</CardTitle>
                            <CardDescription>
                                Document management for this applicant will appear here soon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10 text-center">
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                You currently have no documents uploaded for this applicant. This section is being prepared for upcoming features.
                            </p>
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
        </DashboardLayout>
    );
};

export default ApplicantDetail;
