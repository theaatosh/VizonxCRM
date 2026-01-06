import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Award, Calendar, DollarSign, GraduationCap } from "lucide-react";

const scholarships = [
  {
    id: 1,
    name: "Chevening Scholarship",
    country: "United Kingdom",
    flag: "🇬🇧",
    amount: "Full Funding",
    deadline: "Nov 2, 2024",
    eligibility: "Master's degree applicants",
    coverage: ["Tuition", "Living expenses", "Airfare", "Visa"],
    status: "Open",
  },
  {
    id: 2,
    name: "Fulbright Program",
    country: "United States",
    flag: "🇺🇸",
    amount: "Full Funding",
    deadline: "Oct 15, 2024",
    eligibility: "Graduate students",
    coverage: ["Tuition", "Stipend", "Health insurance", "Travel"],
    status: "Open",
  },
  {
    id: 3,
    name: "DAAD Scholarship",
    country: "Germany",
    flag: "🇩🇪",
    amount: "€1,200/month",
    deadline: "Sep 30, 2024",
    eligibility: "All degree levels",
    coverage: ["Monthly stipend", "Insurance", "Travel allowance"],
    status: "Open",
  },
  {
    id: 4,
    name: "Australia Awards",
    country: "Australia",
    flag: "🇦🇺",
    amount: "Full Funding",
    deadline: "Apr 30, 2024",
    eligibility: "Developing country citizens",
    coverage: ["Tuition", "Airfare", "Living stipend", "Health cover"],
    status: "Closed",
  },
  {
    id: 5,
    name: "Vanier Canada Graduate",
    country: "Canada",
    flag: "🇨🇦",
    amount: "CAD 50,000/year",
    deadline: "Nov 1, 2024",
    eligibility: "PhD candidates",
    coverage: ["Annual stipend for 3 years"],
    status: "Open",
  },
  {
    id: 6,
    name: "Government of Ireland",
    country: "Ireland",
    flag: "🇮🇪",
    amount: "€18,500/year",
    deadline: "Oct 21, 2024",
    eligibility: "PhD applicants",
    coverage: ["Stipend", "Fees contribution", "Research expenses"],
    status: "Open",
  },
];

const statusColors: Record<string, string> = {
  Open: "bg-success/10 text-success border-success/20",
  Closed: "bg-muted text-muted-foreground",
  "Coming Soon": "bg-warning/10 text-warning border-warning/20",
};

const Scholarships = () => {
  return (
    <DashboardLayout title="Scholarships" subtitle="Scholarship opportunities database">
      <Card className="shadow-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Scholarship Database</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {scholarships.filter((s) => s.status === "Open").length} active opportunities
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search scholarships..." className="pl-9 w-[250px]" />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Scholarship
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="shadow-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{scholarship.flag}</span>
                  <div>
                    <CardTitle className="text-base">{scholarship.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{scholarship.country}</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusColors[scholarship.status]}>
                  {scholarship.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium">{scholarship.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{scholarship.deadline}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Coverage</p>
                <div className="flex flex-wrap gap-1">
                  {scholarship.coverage.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <Button variant="outline" className="w-full" disabled={scholarship.status === "Closed"}>
                  {scholarship.status === "Closed" ? "Applications Closed" : "View Details"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Scholarships;
