import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecentPayment } from "@/types/dashboard.types";
import { format } from "date-fns";

interface RecentPaymentsProps {
  payments?: RecentPayment[];
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20",
  PartiallyPaid: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-info/10 text-info border-info/20",
  Overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentPayments({ payments, isLoading = false }: RecentPaymentsProps) {
  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasPayments = payments && payments.length > 0;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
          <p className="text-sm text-muted-foreground">Latest financial transactions</p>
        </div>
      </CardHeader>
      <CardContent>
        {hasPayments ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Inverse</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.slice(0, 5).map((payment) => (
                <TableRow key={payment.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs font-mono">{payment.invoiceNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{payment.student.firstName} {payment.student.lastName}</span>
                      <span className="text-[10px] text-muted-foreground">{format(new Date(payment.paymentDate), 'MMM d, yyyy')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">${Number(payment.paidAmount).toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground">Total: ${Number(payment.totalAmount).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`text-[10px] uppercase ${statusColors[payment.status] || "bg-muted text-muted-foreground"}`}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <p className="text-sm">No recent payments found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
