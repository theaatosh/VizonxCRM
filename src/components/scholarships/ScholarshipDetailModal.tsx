import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scholarship } from "@/types/scholarship.types";
import {
    Award,
    Calendar,
    DollarSign,
    Globe,
    GraduationCap,
    ExternalLink,
    CheckCircle2,
    XCircle,
    FileText
} from "lucide-react";

interface ScholarshipDetailModalProps {
    scholarship: Scholarship | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ScholarshipDetailModal = ({ scholarship, open, onOpenChange }: ScholarshipDetailModalProps) => {
    if (!scholarship) return null;

    const formatCurrency = (amount: string | number, currency: string = 'USD') => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(numAmount);
        } catch {
            return `${currency} ${numAmount}`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isDeadlinePassed = new Date(scholarship.deadline) < new Date();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl mb-2">{scholarship.title}</DialogTitle>
                            <div className="flex gap-2 flex-wrap">
                                <Badge variant={scholarship.status === 'Published' ? "default" : "secondary"}>
                                    {scholarship.status === 'Published' ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Published
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Draft
                                        </>
                                    )}
                                </Badge>
                                {isDeadlinePassed && (
                                    <Badge variant="destructive">
                                        Expired
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    {/* Key Information */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-success" />
                            <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-semibold">{formatCurrency(scholarship.amount, scholarship.currency)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-warning" />
                            <div>
                                <p className="text-sm text-muted-foreground">Deadline</p>
                                <p className="font-semibold">{formatDate(scholarship.deadline)}</p>
                            </div>
                        </div>
                        {scholarship.universityName && (
                            <div className="flex items-center gap-3">
                                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">University</p>
                                    <p className="font-semibold">{scholarship.universityName}</p>
                                </div>
                            </div>
                        )}
                        {scholarship.countryName && (
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Country</p>
                                    <p className="font-semibold">{scholarship.countryName}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Description
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {scholarship.description}
                        </p>
                    </div>

                    {/* Eligibility */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Eligibility Requirements
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {scholarship.eligibility}
                        </p>
                    </div>

                    {/* Application URL */}
                    {scholarship.applicationUrl && (
                        <div className="pt-4 border-t">
                            <Button asChild className="w-full gap-2">
                                <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Apply Now
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
