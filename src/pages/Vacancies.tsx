import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, Calendar, Users, Building } from "lucide-react";

const vacancies = [
  {
    id: 1,
    title: "MSc Computer Science",
    institution: "University of Oxford",
    country: "United Kingdom",
    type: "University Program",
    deadline: "Mar 15, 2024",
    spots: 50,
    applied: 32,
    status: "Open",
  },
  {
    id: 2,
    title: "MBA Program",
    institution: "University of Toronto",
    country: "Canada",
    type: "University Program",
    deadline: "Feb 28, 2024",
    spots: 30,
    applied: 28,
    status: "Open",
  },
  {
    id: 3,
    title: "Graduate Research Assistant",
    institution: "MIT",
    country: "USA",
    type: "Job",
    deadline: "Jan 31, 2024",
    spots: 5,
    applied: 5,
    status: "Closed",
  },
  {
    id: 4,
    title: "MS Data Science",
    institution: "Technical University of Munich",
    country: "Germany",
    type: "University Program",
    deadline: "Apr 30, 2024",
    spots: 40,
    applied: 15,
    status: "Open",
  },
  {
    id: 5,
    title: "Software Engineer Intern",
    institution: "Google",
    country: "Ireland",
    type: "Job",
    deadline: "Feb 15, 2024",
    spots: 10,
    applied: 8,
    status: "Open",
  },
  {
    id: 6,
    title: "PhD in AI Research",
    institution: "Stanford University",
    country: "USA",
    type: "University Program",
    deadline: "Dec 15, 2023",
    spots: 8,
    applied: 8,
    status: "Closed",
  },
];

const statusColors: Record<string, string> = {
  Open: "bg-success/10 text-success border-success/20",
  Closed: "bg-muted text-muted-foreground border-muted",
};

const typeColors: Record<string, string> = {
  "University Program": "bg-primary/10 text-primary",
  Job: "bg-warning/10 text-warning",
};

const Vacancies = () => {
  return (
    <DashboardLayout title="Vacancies" subtitle="Manage university programs and job listings">
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">All Vacancies</CardTitle>
              <p className="text-sm text-muted-foreground">Programs and opportunities</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search vacancies..." className="pl-9 w-[250px]" />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Vacancy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vacancies.map((vacancy) => (
              <Card key={vacancy.id} className="border border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className={typeColors[vacancy.type]}>
                        {vacancy.type}
                      </Badge>
                      <Badge variant="outline" className={statusColors[vacancy.status]}>
                        {vacancy.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{vacancy.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {vacancy.institution}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{vacancy.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Deadline: {vacancy.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {vacancy.applied}/{vacancy.spots} spots filled
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(vacancy.applied / vacancy.spots) * 100}%` }}
                      />
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

export default Vacancies;
