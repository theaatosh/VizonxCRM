import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLead } from "@/hooks/useLeads";
import { AssignmentSection } from "@/components/assignment/AssignmentSection";
import {
    ArrowLeft,
    Mail,
    Phone,
    Globe,
    BookOpen,
    GraduationCap,
    Calendar,
    User,
} from "lucide-react";
import type { LeadStatus, LeadPriority } from "@/types/lead.types";

const statusColors: Record<LeadStatus, string> = {
    New: "bg-primary/10 text-primary border-primary/20",
    Contacted: "bg-warning/10 text-warning border-warning/20",
    Qualified: "bg-info/10 text-info border-info/20",
    Converted: "bg-success/10 text-success border-success/20",
    NotInterested: "bg-muted text-muted-foreground border-muted",
    NotReachable: "bg-destructive/10 text-destructive border-destructive/20",
};

const priorityColors: Record<LeadPriority, string> = {
    High: "bg-destructive/10 text-destructive border-destructive/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Low: "bg-success/10 text-success border-success/20",
};

const LeadDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: lead, isLoading, isError } = useLead(id || '');

    const getInitials = () => {
        if (!lead) return '?';
        return `${lead.firstName?.[0] || ''}${lead.lastName?.[0] || ''}`.toUpperCase();
    };

    const getFullName = () => {
        if (!lead) return 'Unknown';
        return `${lead.firstName} ${lead.lastName}`;
    };

    if (isLoading) {
        return (
            <DashboardLayout title="Lead Details" subtitle="Loading...">
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError || !lead) {
        return (
            <DashboardLayout title="Lead Details" subtitle="Error">
                <div className="py-12 text-center">
                    <p className="text-destructive">Failed to load lead details.</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/leads')}>
                        Back to Leads
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title={getFullName()}
            subtitle="Lead Details"
        >
            <Button
                variant="ghost"
                className="mb-6 gap-2"
                onClick={() => navigate('/leads')}
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Leads
            </Button>

            {/* Profile Section */}
            <div className="grid gap-6 md:grid-cols-3 mb-6">
                <Card className="shadow-card md:col-span-1">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getFullName()}`} />
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold">{getFullName()}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={statusColors[lead.status]}>
                                    {lead.status}
                                </Badge>
                                <Badge variant="outline" className={priorityColors[lead.priority]}>
                                    {lead.priority}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-3 mt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {lead.email}
                            </div>
                            {lead.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    {lead.phone}
                                </div>
                            )}
                            {lead.source && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Globe className="h-4 w-4" />
                                    Source: {lead.source}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Created: {new Date(lead.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>

                        {lead.assignedUser && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>Assigned to: <strong>{lead.assignedUser.name}</strong></span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    {/* Academics */}
                    <Card className="shadow-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Academic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lead.academicBackground ? (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Academic Background</p>
                                        <p className="text-sm mt-1">{lead.academicBackground}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No academic information provided</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Study Interests */}
                    <Card className="shadow-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                Study Interests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lead.studyInterests ? (
                                <p className="text-sm">{lead.studyInterests}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">No study interests specified</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Assignment Section */}
                    <AssignmentSection lead={lead} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LeadDetail;
