import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecentLead } from "@/types/dashboard.types";
import { useNavigate } from "react-router-dom";

interface RecentLeadsTableProps {
  leads?: RecentLead[];
  isLoading?: boolean;
}

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

const statusColors: Record<string, string> = {
  New: "bg-info/10 text-info border-info/20",
  Contacted: "bg-primary/10 text-primary border-primary/20",
  Qualified: "bg-warning/10 text-warning border-warning/20",
  Converted: "bg-success/10 text-success border-success/20",
};

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Lead</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(4)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell><Skeleton className="h-5 w-14" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function RecentLeadsTable({ leads, isLoading = false }: RecentLeadsTableProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    );
  }

  const hasLeads = leads && leads.length > 0;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
            <p className="text-sm text-muted-foreground">Latest leads in the pipeline</p>
          </div>
          <Badge
            variant="outline"
            className="font-normal cursor-pointer hover:bg-muted"
            onClick={() => navigate('/leads')}
          >
            View All
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {hasLeads ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.slice(0, 5).map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.firstName}${lead.lastName}`} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {lead.firstName[0]}{lead.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm">{lead.firstName} {lead.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColors[lead.status] || statusColors.New}`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${priorityColors[lead.priority] || priorityColors.Medium}`}>
                      {lead.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <p className="text-sm">No recent leads found</p>
            <p className="text-xs mt-1">New leads will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
