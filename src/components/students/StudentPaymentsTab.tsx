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
import { 
    CreditCard, 
    Loader2, 
    DollarSign, 
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Receipt
} from 'lucide-react';
import { useStudentPaymentHistory } from '@/hooks/usePayments';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { PaymentStatus } from '@/types/payment.types';

interface StudentPaymentsTabProps {
    studentId: string;
}

const statusColors: Record<PaymentStatus, { bg: string, text: string, icon: any }> = {
    Pending: { bg: 'bg-warning/10', text: 'text-warning border-warning/20', icon: Clock },
    Completed: { bg: 'bg-success/10', text: 'text-success border-success/20', icon: CheckCircle2 },
    Failed: { bg: 'bg-destructive/10', text: 'text-destructive border-destructive/20', icon: XCircle },
    Refunded: { bg: 'bg-info/10', text: 'text-info border-info/20', icon: ArrowUpRight },
    PartiallyPaid: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 border-indigo-500/20', icon: AlertCircle },
    Overdue: { bg: 'bg-red-500/10', text: 'text-red-600 border-red-500/20', icon: AlertCircle },
};

export function StudentPaymentsTab({ studentId }: StudentPaymentsTabProps) {
    const { data: paymentsData, isLoading } = useStudentPaymentHistory(studentId);

    const payments = useMemo(() => paymentsData?.data || [], [paymentsData]);

    const summary = useMemo(() => {
        return payments.reduce((acc, payment) => {
            const total = Number(payment.totalAmount) || 0;
            const paid = Number(payment.paidAmount) || 0;
            const remaining = Number(payment.remainingAmount) || 0;
            
            acc.totalAmount += total;
            acc.totalPaid += paid;
            acc.dueBalance += remaining;
            
            return acc;
        }, { totalAmount: 0, totalPaid: 0, dueBalance: 0 });
    }, [payments]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium">Fetching payment records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-sm bg-primary/5 border-primary/10 overflow-hidden relative group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Receipt className="h-12 w-12 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-primary/70 font-bold uppercase tracking-wider text-[10px]">Total Amount to be Paid</CardDescription>
                        <CardTitle className="text-2xl font-bold text-primary flex items-baseline gap-1">
                            <span className="text-sm font-medium">$</span>
                            {summary.totalAmount.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-full opacity-60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-success/5 border-success/10 overflow-hidden relative group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <CheckCircle2 className="h-12 w-12 text-success" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-success/70 font-bold uppercase tracking-wider text-[10px]">Total Paid</CardDescription>
                        <CardTitle className="text-2xl font-bold text-success flex items-baseline gap-1">
                            <span className="text-sm font-medium">$</span>
                            {summary.totalPaid.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-1.5 w-full bg-success/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-success opacity-60 transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (summary.totalPaid / (summary.totalAmount || 1)) * 100)}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-destructive/5 border-destructive/10 overflow-hidden relative group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-destructive/70 font-bold uppercase tracking-wider text-[10px]">Due Balance</CardDescription>
                        <CardTitle className="text-2xl font-bold text-destructive flex items-baseline gap-1">
                            <span className="text-sm font-medium">$</span>
                            {summary.dueBalance.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-1.5 w-full bg-destructive/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-destructive opacity-60 transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (summary.dueBalance / (summary.totalAmount || 1)) * 100)}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment History Table */}
            <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-primary" />
                                Payment History
                            </CardTitle>
                            <CardDescription>Detailed transaction logs for this student</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                            {payments.length} Transactions
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {payments.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-muted/20">
                                <CreditCard className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Transactions Found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                This student hasn't made any payments yet. Once a payment is recorded, it will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-b-border/50">
                                        <TableHead className="font-bold py-4">Invoice & Service</TableHead>
                                        <TableHead className="font-bold py-4">Amount</TableHead>
                                        <TableHead className="font-bold py-4">Status</TableHead>
                                        <TableHead className="font-bold py-4">Dates</TableHead>
                                        <TableHead className="font-bold py-4 text-right pr-6">Method</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((payment) => {
                                        const StatusIcon = statusColors[payment.status]?.icon || CreditCard;
                                        return (
                                            <TableRow 
                                                key={payment.id} 
                                                className="group hover:bg-primary/[0.02] transition-colors border-b-border/50"
                                            >
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                                                            {payment.invoiceNumber}
                                                            {payment.paymentType === 'Full' && (
                                                                <Badge variant="outline" className="text-[8px] h-4 py-0 font-normal">FULL</Badge>
                                                            )}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                            <DollarSign className="h-3 w-3" />
                                                            {payment.service?.name || 'Administrative Fee'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-bold flex items-baseline gap-1">
                                                            <span className="text-[10px] text-muted-foreground font-medium">{payment.currency}</span>
                                                            {payment.totalAmount.toLocaleString()}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                            <span className="text-success font-medium">Paid: {payment.paidAmount.toLocaleString()}</span>
                                                            {payment.remainingAmount > 0 && (
                                                                <span className="text-destructive font-medium ml-1">Due: {payment.remainingAmount.toLocaleString()}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 group-hover:scale-105 flex items-center w-fit gap-1.5 ${statusColors[payment.status]?.bg} ${statusColors[payment.status]?.text}`}
                                                    >
                                                        <StatusIcon className="h-3 w-3" />
                                                        {payment.status.replace(/([A-Z])/g, ' $1').trim()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col gap-1 text-xs">
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Calendar className="h-3 w-3 text-primary/60" />
                                                            Paid: {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                                                        </div>
                                                        {payment.dueDate && (
                                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                                <Clock className="h-3 w-3 text-destructive/60" />
                                                                Due: {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-right pr-6">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Badge variant="secondary" className="font-semibold text-[10px] px-2 py-0.5">
                                                            {payment.paymentMethod}
                                                        </Badge>
                                                        {payment.transactionReference && (
                                                            <span className="text-[9px] text-muted-foreground font-mono">
                                                                REF: {payment.transactionReference}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
