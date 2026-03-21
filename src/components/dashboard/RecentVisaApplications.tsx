import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecentVisaApplication } from "@/types/dashboard.types";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface RecentVisaApplicationsProps {
  applications?: RecentVisaApplication[];
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  UnderReview: "bg-info/10 text-info border-info/20",
  Approved: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
};

export function RecentVisaApplications({ applications, isLoading = false }: RecentVisaApplicationsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-48" />
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

  const hasApps = applications && applications.length > 0;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Visa Applications</CardTitle>
            <p className="text-sm text-muted-foreground">Latest filings and updates</p>
          </div>
          <Badge
            variant="outline"
            className="font-normal cursor-pointer hover:bg-muted"
            onClick={() => navigate('/visas')}
          >
            View All
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {hasApps ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.slice(0, 5).map((app) => (
                <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/applicants/${app.studentId}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student.firstName}`} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {app.student.firstName[0]}{app.student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm">{app.student.firstName} {app.student.lastName}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{app.visaType.name}</TableCell>
                  <TableCell className="text-xs">{app.destinationCountry}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`text-xs ${statusColors[app.status] || "bg-muted text-muted-foreground"}`}>
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <p className="text-sm">No recent applications found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
