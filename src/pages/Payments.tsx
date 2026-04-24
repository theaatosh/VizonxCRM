import React, { useState } from 'react';
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { 
    Plus, 
    Search, 
    MoreVertical, 
    Edit, 
    Trash2, 
    Download, 
    Filter,
    DollarSign,
    Clock,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { usePayments, usePaymentSummary } from '@/hooks/usePayments';
import { PaymentFormDialog } from '@/components/payments/PaymentFormDialog';
import { DeletePaymentDialog } from '@/components/payments/DeletePaymentDialog';
import { PaymentFilters } from '@/components/payments/PaymentFilters';
import type { Payment, PaymentStatus, PaymentFilters as PaymentFiltersType } from '@/types/payment.types';

const statusColors: Record<PaymentStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Completed: 'bg-green-100 text-green-700 border-green-200',
    Failed: 'bg-red-100 text-red-700 border-red-200',
    Refunded: 'bg-gray-100 text-gray-700 border-gray-200',
    PartiallyPaid: 'bg-blue-100 text-blue-700 border-blue-200',
    Overdue: 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function Payments() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 90),
        to: new Date(),
    });

    const [filters, setFilters] = useState<PaymentFiltersType>({
        search: '',
        page: 1,
        limit: 10,
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const { data: paymentsData, isLoading } = usePayments(filters);
    
    const { data: summaryData, isLoading: isLoadingSummary } = usePaymentSummary({
        fromDate: dateRange?.from?.toISOString(),
        toDate: dateRange?.to?.toISOString(),
    });

    const handleEdit = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsFormOpen(true);
    };

    const handleDelete = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsDeleteDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedPayment(null);
        setIsFormOpen(true);
    };

    return (
        <DashboardLayout 
            title="Payments" 
            subtitle="Manage student billing and transactions"
        >
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Financial Overview</h2>
                    <p className="text-muted-foreground text-sm">Monitor revenue, collection rates, and payment trends.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="shadow-sm border-none bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingSummary ? (
                            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">${summaryData?.metrics.totalRevenue?.toLocaleString() || 0}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(summaryData?.metrics.revenueChange || 0) >= 0 ? '+' : ''}{(summaryData?.metrics.revenueChange || 0).toFixed(1)}% vs previous period
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-yellow-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingSummary ? (
                            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{summaryData?.metrics.totalPendingAmount ? `$${summaryData.metrics.totalPendingAmount.toLocaleString()}` : '$0'}</div>
                                <p className="text-xs text-muted-foreground mt-1">Pending collection</p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingSummary ? (
                            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{summaryData?.metrics.collectionRate?.toFixed(1) || 0}%</div>
                                <p className="text-xs text-muted-foreground mt-1">Of total invoiced amount</p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-orange-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingSummary ? (
                            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{summaryData?.metrics.totalOverdueAmount ? `$${summaryData.metrics.totalOverdueAmount.toLocaleString()}` : '$0'}</div>
                                <p className="text-xs text-muted-foreground mt-1">Immediate attention required</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-7 mb-6">
                <Card className="col-span-1 md:col-span-4 shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Daily Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoadingSummary ? (
                            <div className="w-full h-full bg-muted/20 animate-pulse rounded-xl" />
                        ) : summaryData?.dailyRevenue && summaryData.dailyRevenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={summaryData.dailyRevenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                                        stroke="#888888" 
                                        fontSize={12} 
                                    />
                                    <YAxis 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(value) => `$${value}`} 
                                        stroke="#888888" 
                                        fontSize={12} 
                                        width={60}
                                    />
                                    <RechartsTooltip 
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                                        labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                No revenue data for selected period
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-3 shadow-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Payment Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        {isLoadingSummary ? (
                            <div className="w-full h-full bg-muted/20 animate-pulse rounded-xl" />
                        ) : summaryData?.statusBreakdown && summaryData.statusBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={summaryData.statusBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="totalAmount"
                                        nameKey="status"
                                    >
                                        {summaryData.statusBreakdown.map((entry, index) => {
                                            const colors: Record<string, string> = {
                                                'Completed': '#22c55e',
                                                'Pending': '#eab308',
                                                'Overdue': '#f97316',
                                                'Failed': '#ef4444',
                                                'Refunded': '#6b7280',
                                                'PartiallyPaid': '#3b82f6'
                                            };
                                            return <Cell key={`cell-${index}`} fill={colors[entry.status] || '#94a3b8'} />;
                                        })}
                                    </Pie>
                                    <RechartsTooltip 
                                        formatter={(value: number, name: string, props: any) => [`$${value.toLocaleString()} (${props.payload.percentage.toFixed(1)}%)`, name]}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                No status data for selected period
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-card border-none overflow-hidden">
                <CardHeader className="pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search invoice or student..." 
                                    className="pl-9 h-10 rounded-xl"
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                />
                            </div>
                            <PaymentFilters 
                                filters={filters} 
                                onFiltersChange={setFilters} 
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10 rounded-xl gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                            <Button 
                                onClick={handleAdd}
                                className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20"
                            >
                                <Plus className="h-4 w-4" />
                                Record Payment
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent bg-muted/30">
                                    <TableHead className="w-[120px] font-semibold">Invoice #</TableHead>
                                    <TableHead className="font-semibold">Student</TableHead>
                                    <TableHead className="font-semibold">Service</TableHead>
                                    <TableHead className="font-semibold px-2 text-center">Cycle</TableHead>
                                    <TableHead className="font-semibold text-right">Total</TableHead>
                                    <TableHead className="font-semibold text-right">Paid</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="w-[80px] text-right font-semibold"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-8 bg-muted animate-pulse rounded mx-auto" /></TableCell>
                                            <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                            <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                            <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : !paymentsData?.data || paymentsData.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="p-4 rounded-full bg-muted/30">
                                                    <DollarSign className="h-10 w-10 text-muted-foreground/30" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-semibold text-foreground">No payments found</p>
                                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                                        There are no payment records matching your search or filters.
                                                    </p>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    className="rounded-xl mt-4"
                                                    onClick={handleAdd}
                                                >
                                                    Record First Payment
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paymentsData?.data.map((payment) => (
                                        <TableRow key={payment.id} className="group hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-mono text-xs font-semibold text-primary">
                                                {payment.invoiceNumber}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-foreground">
                                                    {payment.student?.firstName} {payment.student?.lastName}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {payment.service?.name || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                    {payment.paymentCycle || 1}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${payment.totalAmount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-green-600">
                                                ${payment.paidAmount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[payment.status]}`}
                                                >
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {payment.paymentDate ? format(new Date(payment.paymentDate), 'MMM dd, yyyy') : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background shadow-none">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-muted-foreground/10">
                                                        <DropdownMenuItem onClick={() => handleEdit(payment)} className="gap-2 cursor-pointer">
                                                            <Edit className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Download className="h-4 w-4" /> Invoice
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDelete(payment)}
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

                    {/* Pagination UI */}
                    {paymentsData && paymentsData.totalPages > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 sm:order-1">
                                <span>Rows per page</span>
                                <Select
                                    value={filters.limit?.toString()}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, limit: parseInt(value), page: 1 }))}
                                >
                                    <SelectTrigger className="h-8 w-[70px] rounded-lg">
                                        <SelectValue placeholder={filters.limit} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="ml-4 tabular-nums">
                                    Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} - {Math.min((filters.page || 1) * (filters.limit || 10), paymentsData.total)} of {paymentsData.total}
                                </span>
                            </div>

                            <div className="order-1 sm:order-2">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                className={filters.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))} 
                                            />
                                        </PaginationItem>
                                        
                                        {/* Page Numbers Logic */}
                                        {Array.from({ length: paymentsData.totalPages }, (_, i) => i + 1)
                                            .filter(page => {
                                                const currentPage = filters.page || 1;
                                                return page === 1 || 
                                                       page === paymentsData.totalPages || 
                                                       (page >= currentPage - 1 && page <= currentPage + 1);
                                            })
                                            .map((page, index, array) => {
                                                const currentPage = filters.page || 1;
                                                const prevPage = array[index - 1];
                                                
                                                return (
                                                    <React.Fragment key={page}>
                                                        {prevPage && page - prevPage > 1 && (
                                                            <PaginationItem>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        )}
                                                        <PaginationItem>
                                                            <PaginationLink 
                                                                isActive={currentPage === page}
                                                                className="cursor-pointer"
                                                                onClick={() => setFilters(prev => ({ ...prev, page }))}
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    </React.Fragment>
                                                );
                                            })
                                        }

                                        <PaginationItem>
                                            <PaginationNext 
                                                className={filters.page === paymentsData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(paymentsData.totalPages, (prev.page || 1) + 1) }))}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <PaymentFormDialog 
                open={isFormOpen} 
                onOpenChange={setIsFormOpen} 
                payment={selectedPayment} 
            />

            <DeletePaymentDialog 
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                paymentId={selectedPayment?.id || null}
                invoiceNumber={selectedPayment?.invoiceNumber}
            />
        </DashboardLayout>
    );
}
