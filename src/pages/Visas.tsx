import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Plane, Clock, CheckCircle, XCircle } from "lucide-react";

const visaApplications = [
  {
    id: 1,
    applicant: "Sarah Johnson",
    country: "United Kingdom",
    visaType: "Student Visa (Tier 4)",
    status: "Approved",
    submittedDate: "2024-01-05",
    decisionDate: "2024-01-12",
  },
  {
    id: 2,
    applicant: "Michael Chen",
    country: "Canada",
    visaType: "Study Permit",
    status: "Pending",
    submittedDate: "2024-01-10",
    decisionDate: "-",
  },
  {
    id: 3,
    applicant: "Priya Sharma",
    country: "Australia",
    visaType: "Student Visa (Subclass 500)",
    status: "In Process",
    submittedDate: "2024-01-08",
    decisionDate: "-",
  },
  {
    id: 4,
    applicant: "Ahmed Hassan",
    country: "Germany",
    visaType: "National Visa (Type D)",
    status: "Approved",
    submittedDate: "2024-01-02",
    decisionDate: "2024-01-14",
  },
  {
    id: 5,
    applicant: "Lisa Wang",
    country: "USA",
    visaType: "F-1 Student Visa",
    status: "Rejected",
    submittedDate: "2023-12-20",
    decisionDate: "2024-01-08",
  },
  {
    id: 6,
    applicant: "Carlos Rodriguez",
    country: "Ireland",
    visaType: "Study Visa",
    status: "Pending",
    submittedDate: "2024-01-14",
    decisionDate: "-",
  },
];

const countryStats = [
  { country: "United Kingdom", total: 45, approved: 32, pending: 10, rejected: 3, flag: "🇬🇧" },
  { country: "Canada", total: 38, approved: 28, pending: 8, rejected: 2, flag: "🇨🇦" },
  { country: "Australia", total: 29, approved: 20, pending: 7, rejected: 2, flag: "🇦🇺" },
  { country: "USA", total: 35, approved: 22, pending: 9, rejected: 4, flag: "🇺🇸" },
  { country: "Germany", total: 22, approved: 18, pending: 3, rejected: 1, flag: "🇩🇪" },
  { country: "Ireland", total: 18, approved: 14, pending: 4, rejected: 0, flag: "🇮🇪" },
];

const statusColors: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  "In Process": "bg-info/10 text-info border-info/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle className="h-4 w-4 text-success" />,
  Pending: <Clock className="h-4 w-4 text-warning" />,
  "In Process": <Plane className="h-4 w-4 text-info" />,
  Rejected: <XCircle className="h-4 w-4 text-destructive" />,
};

const Visas = () => {
  return (
    <DashboardLayout title="Visas" subtitle="Track visa applications and status">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Plane className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">67</p>
                <p className="text-sm text-muted-foreground">In Process</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="countries">By Country</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg font-semibold">Visa Applications</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search applications..." className="pl-9 w-[250px]" />
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Application
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visaApplications.map((visa) => (
                  <div
                    key={visa.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${visa.applicant}`} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {visa.applicant
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{visa.applicant}</p>
                        <p className="text-sm text-muted-foreground">{visa.visaType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">{visa.country}</p>
                        <p className="text-xs text-muted-foreground">Submitted: {visa.submittedDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcons[visa.status]}
                        <Badge variant="outline" className={statusColors[visa.status]}>
                          {visa.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Visa Applications by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {countryStats.map((country) => (
                  <Card key={country.country} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <p className="font-semibold">{country.country}</p>
                          <p className="text-sm text-muted-foreground">{country.total} total applications</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-success/10 p-2">
                          <p className="text-lg font-bold text-success">{country.approved}</p>
                          <p className="text-xs text-muted-foreground">Approved</p>
                        </div>
                        <div className="rounded-lg bg-warning/10 p-2">
                          <p className="text-lg font-bold text-warning">{country.pending}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                        <div className="rounded-lg bg-destructive/10 p-2">
                          <p className="text-lg font-bold text-destructive">{country.rejected}</p>
                          <p className="text-xs text-muted-foreground">Rejected</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Visas;
