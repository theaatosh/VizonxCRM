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
    Receipt,
    RefreshCw
} from 'lucide-react';
import { useStudentPaymentHistory, usePaymentCycles, usePendingPayments } from '@/hooks/usePayments';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { PaymentStatus, Payment } from '@/types/payment.types';

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
    const { data: cyclesData, isLoading: isLoadingCycles } = usePaymentCycles(studentId);
    const { data: pendingPayments, isLoading: isLoadingPending } = usePendingPayments(studentId);
    const { data: historyData, isLoading: isLoadingHistory } = useStudentPaymentHistory(studentId);

    const historyPayments = useMemo(() => historyData?.data || [], [historyData]);

    // Group history by cycle
    const groupedHistory = useMemo(() => {
        const groups: Record<number, Payment[]> = {};
        historyPayments.forEach(payment => {
            const cycle = payment.paymentCycle || 1;
            if (!groups[cycle]) groups[cycle] = [];
            groups[cycle].push(payment);
        });
        return groups;
    }, [historyPayments]);

    if (isLoadingCycles || isLoadingPending || isLoadingHistory) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium">Fetching payment cycles and history...</p>
            </div>
        );
    }

    const totalAmount = (cyclesData?.totalPaid || 0) + (cyclesData?.remainingAmount || 0);
    const progressPercent = totalAmount > 0 ? Math.min(100, ((cyclesData?.totalPaid || 0) / totalAmount) * 100) : 0;
    const remainingPercent = totalAmount > 0 ? Math.min(100, ((cyclesData?.remainingAmount || 0) / totalAmount) * 100) : 0;

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Cycle Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-none shadow-sm bg-primary/5 border-primary/10 overflow-hidden relative group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <RefreshCw className="h-12 w-12 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-primary/70 font-bold uppercase tracking-wider text-[10px]">Current Cycle</CardDescription>
                        <CardTitle className="text-2xl font-bold text-primary flex items-baseline gap-1">
                            Cycle {cyclesData?.cycleNumber || 1}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={`${statusColors[cyclesData?.status || 'Pending']?.bg} ${statusColors[cyclesData?.status || 'Pending']?.text}`}>
                                {cyclesData?.status || 'Pending'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-success/5 border-success/10 overflow-hidden relative group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <CheckCircle2 className="h-12 w-12 text-success" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-success/70 font-bold uppercase tracking-wider text-[10px]">Cycle Total Paid</CardDescription>
                        <CardTitle className="text-2xl font-bold text-success flex items-baseline gap-1">
                            <span className="text-sm font-medium">$</span>
                            {(cyclesData?.totalPaid || 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-1.5 w-full bg-success/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-success opacity-60 transition-all duration-1000" 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-destructive/5 border-destructive/10 overflow-hidden relative group transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-destructive/70 font-bold uppercase tracking-wider text-[10px]">Cycle Remaining Balance</CardDescription>
                        <CardTitle className="text-2xl font-bold text-destructive flex items-baseline gap-1">
                            <span className="text-sm font-medium">$</span>
                            {(cyclesData?.remainingAmount || 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-1.5 w-full bg-destructive/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-destructive opacity-60 transition-all duration-1000" 
                                style={{ width: `${remainingPercent}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Installments */}
            {pendingPayments && pendingPayments.length > 0 && (
                <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm overflow-hidden border-l-4 border-l-warning">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-warning" />
                                    Pending Installments (Active Cycle)
                                </CardTitle>
                                <CardDescription>Unpaid payments for the current cycle</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-b-border/50">
                                        <TableHead className="font-bold py-4">Invoice & Service</TableHead>
                                        <TableHead className="font-bold py-4">Total Amount</TableHead>
                                        <TableHead className="font-bold py-4">Paid</TableHead>
                                        <TableHead className="font-bold py-4">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingPayments.map((payment) => (
                                        <TableRow key={payment.id} className="group hover:bg-warning/5 transition-colors border-b-border/50">
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-foreground flex items-center gap-2">
                                                        {payment.invoiceNumber}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {payment.service?.name || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 font-bold">
                                                ${payment.totalAmount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="py-4 text-success font-medium">
                                                ${payment.paidAmount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className={`${statusColors[payment.status]?.bg} ${statusColors[payment.status]?.text}`}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment History Grouped by Cycle */}
            <Card className="shadow-card border-none bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-primary" />
                                Payment History Logs
                            </CardTitle>
                            <CardDescription>Comprehensive transaction history grouped by cycle</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 px-4 pb-4">
                    {Object.keys(groupedHistory).length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-muted/20">
                                <CreditCard className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Transactions Found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                This student hasn't made any payments yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8 mt-4">
                            {Object.entries(groupedHistory).sort(([a], [b]) => Number(b) - Number(a)).map(([cycle, payments]) => (
                                <div key={cycle} className="border border-border/50 rounded-xl overflow-hidden">
                                    <div className="bg-muted/30 px-4 py-3 border-b border-border/50 flex justify-between items-center">
                                        <h4 className="font-bold text-foreground flex items-center gap-2">
                                            <RefreshCw className="h-4 w-4 text-primary" />
                                            Cycle {cycle}
                                        </h4>
                                        <Badge variant="secondary">{payments.length} Payments</Badge>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="font-bold">Invoice</TableHead>
                                                    <TableHead className="font-bold">Amount</TableHead>
                                                    <TableHead className="font-bold">Status</TableHead>
                                                    <TableHead className="font-bold">Date</TableHead>
                                                    <TableHead className="font-bold text-right">Method</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {payments.map((payment) => {
                                                    const StatusIcon = statusColors[payment.status]?.icon || CreditCard;
                                                    return (
                                                        <TableRow key={payment.id} className="group hover:bg-primary/[0.02] border-b-border/50">
                                                            <TableCell>
                                                                <div className="font-bold text-foreground">{payment.invoiceNumber}</div>
                                                                <div className="text-xs text-muted-foreground">{payment.service?.name || '-'}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-sm font-bold">${payment.totalAmount.toLocaleString()}</div>
                                                                <div className="text-[10px] text-success">Paid: ${payment.paidAmount.toLocaleString()}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] ${statusColors[payment.status]?.bg} ${statusColors[payment.status]?.text}`}>
                                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                                    {payment.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Badge variant="secondary" className="font-semibold text-[10px]">
                                                                    {payment.paymentMethod}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
