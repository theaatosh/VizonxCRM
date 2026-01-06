import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const leads = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 234 567 890",
    country: "United Kingdom",
    status: "Hot",
    source: "Website",
    counsellor: "John Smith",
    followUp: "2024-01-18",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 345 678 901",
    country: "Canada",
    status: "Warm",
    source: "Referral",
    counsellor: "Emma Wilson",
    followUp: "2024-01-19",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya.s@email.com",
    phone: "+91 98765 43210",
    country: "Australia",
    status: "Cold",
    source: "Social Media",
    counsellor: "David Brown",
    followUp: "2024-01-20",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    email: "ahmed.h@email.com",
    phone: "+971 50 123 4567",
    country: "Germany",
    status: "Hot",
    source: "Exhibition",
    counsellor: "John Smith",
    followUp: "2024-01-17",
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.w@email.com",
    phone: "+86 138 0000 0000",
    country: "USA",
    status: "Warm",
    source: "Website",
    counsellor: "Emma Wilson",
    followUp: "2024-01-21",
    createdAt: "2024-01-11",
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    email: "carlos.r@email.com",
    phone: "+34 612 345 678",
    country: "Spain",
    status: "New",
    source: "Partner Agency",
    counsellor: "Unassigned",
    followUp: "2024-01-22",
    createdAt: "2024-01-16",
  },
  {
    id: 7,
    name: "Emma Thompson",
    email: "emma.t@email.com",
    phone: "+44 7911 123456",
    country: "Ireland",
    status: "Converted",
    source: "Referral",
    counsellor: "David Brown",
    followUp: "-",
    createdAt: "2024-01-08",
  },
];

const statusColors: Record<string, string> = {
  Hot: "bg-destructive/10 text-destructive border-destructive/20",
  Warm: "bg-warning/10 text-warning border-warning/20",
  Cold: "bg-info/10 text-info border-info/20",
  New: "bg-primary/10 text-primary border-primary/20",
  Converted: "bg-success/10 text-success border-success/20",
};

const Leads = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout title="Leads" subtitle="Manage and track your leads">
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">All Leads</CardTitle>
              <p className="text-sm text-muted-foreground">Total: {leads.length} leads</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Counsellor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counsellors</SelectItem>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="emma">Emma Wilson</SelectItem>
                  <SelectItem value="david">David Brown</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Lead</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Counsellor</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
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
                    <TableCell className="text-muted-foreground">{lead.followUp}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Leads;
