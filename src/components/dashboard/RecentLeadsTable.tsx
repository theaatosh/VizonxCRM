import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const leads = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    country: "United Kingdom",
    status: "Hot",
    source: "Website",
    counsellor: "John Smith",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    country: "Canada",
    status: "Warm",
    source: "Referral",
    counsellor: "Emma Wilson",
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya.s@email.com",
    country: "Australia",
    status: "Cold",
    source: "Social Media",
    counsellor: "David Brown",
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    email: "ahmed.h@email.com",
    country: "Germany",
    status: "Hot",
    source: "Exhibition",
    counsellor: "John Smith",
    date: "2024-01-12",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.w@email.com",
    country: "USA",
    status: "Warm",
    source: "Website",
    counsellor: "Emma Wilson",
    date: "2024-01-11",
  },
];

const statusColors: Record<string, string> = {
  Hot: "bg-destructive/10 text-destructive border-destructive/20",
  Warm: "bg-warning/10 text-warning border-warning/20",
  Cold: "bg-info/10 text-info border-info/20",
};

export function RecentLeadsTable() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
            <p className="text-sm text-muted-foreground">Latest leads in the pipeline</p>
          </div>
          <Badge variant="outline" className="font-normal">
            View All
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Lead</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Counsellor</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{lead.country}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[lead.status]}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                <TableCell className="text-muted-foreground">{lead.counsellor}</TableCell>
                <TableCell className="text-right text-muted-foreground">{lead.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
