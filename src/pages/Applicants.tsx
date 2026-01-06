import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Mail, Phone, MapPin } from "lucide-react";

const applicants = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 234 567 890",
    country: "United Kingdom",
    university: "University of Oxford",
    program: "MSc Computer Science",
    stage: "Visa Applied",
    progress: 80,
    intake: "Sep 2024",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 345 678 901",
    country: "Canada",
    university: "University of Toronto",
    program: "MBA",
    stage: "Documentation",
    progress: 45,
    intake: "Jan 2025",
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya.s@email.com",
    phone: "+91 98765 43210",
    country: "Australia",
    university: "University of Melbourne",
    program: "MS Data Science",
    stage: "Application Submitted",
    progress: 60,
    intake: "Feb 2025",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    email: "ahmed.h@email.com",
    phone: "+971 50 123 4567",
    country: "Germany",
    university: "Technical University of Munich",
    program: "MSc Engineering",
    stage: "Offer Received",
    progress: 70,
    intake: "Oct 2024",
  },
];

const stageColors: Record<string, string> = {
  Inquiry: "bg-muted text-muted-foreground",
  Documentation: "bg-warning/10 text-warning border-warning/20",
  "Application Submitted": "bg-info/10 text-info border-info/20",
  "Offer Received": "bg-primary/10 text-primary border-primary/20",
  "Visa Applied": "bg-success/10 text-success border-success/20",
};

const Applicants = () => {
  return (
    <DashboardLayout title="Applicants" subtitle="Manage student applications">
      <Card className="shadow-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">All Applicants</CardTitle>
              <p className="text-sm text-muted-foreground">Track application progress</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search applicants..." className="pl-9 w-[250px]" />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Applicant
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {applicants.map((applicant) => (
              <Card key={applicant.id} className="border border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-primary/5 to-accent p-4 border-b border-border">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{applicant.name}</h3>
                            <p className="text-sm text-muted-foreground">{applicant.program}</p>
                          </div>
                          <Badge variant="outline" className={stageColors[applicant.stage]}>
                            {applicant.stage}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{applicant.university}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{applicant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{applicant.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Application Progress</span>
                        <span className="font-medium">{applicant.progress}%</span>
                      </div>
                      <Progress value={applicant.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Target Intake: </span>
                        <span className="font-medium">{applicant.intake}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Applicants;
