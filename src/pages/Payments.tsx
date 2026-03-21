import { useState } from 'react';
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
import { usePayments } from '@/hooks/usePayments';
import { PaymentFormDialog } from '@/components/payments/PaymentFormDialog';
import { DeletePaymentDialog } from '@/components/payments/DeletePaymentDialog';
import { PaymentFilters } from '@/components/payments/PaymentFilters';
import type { Payment, PaymentStatus, PaymentFilters as PaymentFiltersType } from '@/types/payment.types';
import { format } from 'date-fns';

const statusColors: Record<PaymentStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Completed: 'bg-green-100 text-green-700 border-green-200',
    Failed: 'bg-red-100 text-red-700 border-red-200',
    Refunded: 'bg-gray-100 text-gray-700 border-gray-200',
    PartiallyPaid: 'bg-blue-100 text-blue-700 border-blue-200',
    Overdue: 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function Payments() {
    const [filters, setFilters] = useState<PaymentFiltersType>({
        search: '',
        page: 1,
        limit: 10,
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const { data: paymentsData, isLoading } = usePayments(filters);

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
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="shadow-sm border-none bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-yellow-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground mt-1">4 payments due this week</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground mt-1">98% collection rate</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-none bg-orange-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground mt-1">Totaling $1,250.00</p>
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
                                            <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                            <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                            <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                            <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : !paymentsData?.data || paymentsData.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-64 text-center">
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
