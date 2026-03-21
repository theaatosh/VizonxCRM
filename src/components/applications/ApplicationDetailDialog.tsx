import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
    Calendar, 
    User, 
    BookOpen, 
    Building2, 
    Clock, 
    DollarSign,
    FileText,
    StickyNote,
    GraduationCap,
    Loader2,
    XCircle
} from 'lucide-react';
import { useCourseApplicationDetail } from '../../hooks/useCourseApplications';
import type { CourseApplication, ApplicationStatus } from '@/types/course-application.types';
import { format } from 'date-fns';

interface ApplicationDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicationId: string | null;
}

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

export function ApplicationDetailDialog({ 
    open, 
    onOpenChange, 
    applicationId 
}: ApplicationDetailDialogProps) {
    const { data: application, isLoading } = useCourseApplicationDetail(applicationId || '');

    if (!applicationId) return null;

    const DetailItem = ({ icon: Icon, label, value, color }: any) => (
        <div className="flex items-start gap-3 py-2">
            <div className={`mt-0.5 p-1.5 rounded-lg ${color || 'bg-muted text-muted-foreground'}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold uppercase">{label}</p>
                <p className="text-sm font-medium text-foreground">{value || '-'}</p>
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                Application Details
                                {application?.status && (
                                    <Badge 
                                        variant="outline" 
                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ml-2 ${statusColors[application.status] || ''}`}
                                    >
                                        {application.status.replace(/([A-Z])/g, ' $1').trim()}
                                    </Badge>
                                )}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh] relative min-h-[400px]">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm font-medium text-muted-foreground">Loading details...</p>
                            </div>
                        </div>
                    ) : application ? (
                        <>
                            {/* Student & Course Section */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                        <User className="h-3 w-3" />
                                        Student Information
                                    </h4>
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                        <DetailItem 
                                            icon={User} 
                                            label="Name" 
                                            value={`${application.student?.firstName} ${application.student?.lastName}`} 
                                        />
                                        <DetailItem 
                                            icon={FileText} 
                                            label="Email" 
                                            value={application.student?.email} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                        <BookOpen className="h-3 w-3" />
                                        Course & University
                                    </h4>
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                        <DetailItem 
                                            icon={GraduationCap} 
                                            label="Course" 
                                            value={application.course?.name} 
                                        />
                                        <DetailItem 
                                            icon={Building2} 
                                            label="University" 
                                            value={application.university?.name} 
                                        />
                                        <DetailItem 
                                            icon={Clock} 
                                            label="Intake Period" 
                                            value={application.intakePeriod} 
                                            color="bg-primary/10 text-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dates & Fees Section */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        Key Dates
                                    </h4>
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                        <DetailItem 
                                            icon={Calendar} 
                                            label="Submission Date" 
                                            value={application.submissionDate ? format(new Date(application.submissionDate), 'PPP') : '-'} 
                                        />
                                        <DetailItem 
                                            icon={Calendar} 
                                            label="Decision Date" 
                                            value={application.decisionDate ? format(new Date(application.decisionDate), 'PPP') : '-'} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="h-3 w-3" />
                                        Fees & Financials
                                    </h4>
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                        <DetailItem 
                                            icon={DollarSign} 
                                            label="Application Fee" 
                                            value={application.applicationFee ? `$${application.applicationFee}` : 'Waived/None'} 
                                            color="bg-green-100 text-green-700"
                                        />
                                        <DetailItem 
                                            icon={DollarSign} 
                                            label="Course Fees" 
                                            value={application.course?.fees ? `$${application.course.fees}` : '-'} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="md:col-span-2" />

                            {/* Notes Section */}
                            <div className="md:col-span-2 space-y-4 pb-4">
                                <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                    <StickyNote className="h-3 w-3" />
                                    Notes & Comments
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">General Notes</p>
                                        <p className="text-sm italic">{application.notes?.text || 'No general notes provided.'}</p>
                                    </div>
                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2">
                                        <p className="text-[10px] uppercase font-bold text-primary">Counselor Note</p>
                                        <p className="text-sm font-medium">{application.notes?.counselorNote || 'No counselor notes available.'}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="col-span-2 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                            <div className="p-4 rounded-full bg-red-100 text-red-600">
                                <XCircle className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-semibold">Failed to load application</h4>
                                <p className="text-sm text-muted-foreground italic">
                                    The application record could not be retrieved. Please try again or contact support.
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                                Close
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
