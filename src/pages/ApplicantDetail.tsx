import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    User,
    GraduationCap,
    FileText,
    Edit,
    Trash2
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
    const { data: documents, isLoading: docsLoading } = useStudentDocuments(id || '');

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

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Profile Card */}
                <Card className="shadow-card lg:col-span-2">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                                    <AvatarImage
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.firstName}${applicant.lastName}`}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {getInitials(applicant.firstName, applicant.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">
                                        {applicant.firstName} {applicant.lastName}
                                    </CardTitle>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className={statusColors[applicant.status]}>
                                            {applicant.status}
                                        </Badge>
                                        <Badge variant="outline" className={priorityColors[applicant.priority]}>
                                            {applicant.priority} Priority
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditDialogOpen(true)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Contact Information */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Contact Information
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="font-medium">{applicant.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p className="font-medium">{applicant.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Academic Records */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                Academic Records
                            </h3>
                            <div className="p-4 rounded-lg bg-muted/50">
                                {applicant.academicRecords && Object.keys(applicant.academicRecords).length > 0 ? (
                                    <pre className="text-sm whitespace-pre-wrap">
                                        {JSON.stringify(applicant.academicRecords, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No academic records available</p>
                                )}
                            </div>
                        </div>

                        {/* Test Scores */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Test Scores
                            </h3>
                            <div className="p-4 rounded-lg bg-muted/50">
                                {applicant.testScores && Object.keys(applicant.testScores).length > 0 ? (
                                    <pre className="text-sm whitespace-pre-wrap">
                                        {JSON.stringify(applicant.testScores, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No test scores available</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Side Cards */}
                <div className="space-y-6">
                    {/* Timeline Card */}
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Created</span>
                                <span className="font-medium">
                                    {new Date(applicant.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Last Updated</span>
                                <span className="font-medium">
                                    {new Date(applicant.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents Card */}
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {docsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : documents && documents.length > 0 ? (
                                <ul className="space-y-2">
                                    {documents.map((doc) => (
                                        <li
                                            key={doc.id}
                                            className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm"
                                        >
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span>{doc.documentType}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-sm">No documents uploaded</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

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
