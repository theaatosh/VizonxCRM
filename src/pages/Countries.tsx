import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Clock, DollarSign } from "lucide-react";

const countries = [
  {
    id: 1,
    name: "United Kingdom",
    flag: "🇬🇧",
    visaTypes: ["Tier 4 Student", "Visitor", "Work"],
    processingTime: "3-4 weeks",
    avgCost: "£348",
    requirements: ["Valid passport", "CAS letter", "Financial proof", "English proficiency"],
    universities: 142,
    activeApplications: 45,
  },
  {
    id: 2,
    name: "Canada",
    flag: "🇨🇦",
    visaTypes: ["Study Permit", "Work Permit", "Visitor"],
    processingTime: "8-12 weeks",
    avgCost: "CAD 150",
    requirements: ["Letter of acceptance", "Financial proof", "Medical exam", "Police certificate"],
    universities: 98,
    activeApplications: 38,
  },
  {
    id: 3,
    name: "Australia",
    flag: "🇦🇺",
    visaTypes: ["Subclass 500", "Subclass 485", "Visitor"],
    processingTime: "4-6 weeks",
    avgCost: "AUD 650",
    requirements: ["CoE", "GTE statement", "Health insurance", "Financial capacity"],
    universities: 43,
    activeApplications: 29,
  },
  {
    id: 4,
    name: "United States",
    flag: "🇺🇸",
    visaTypes: ["F-1 Student", "J-1 Exchange", "B1/B2"],
    processingTime: "3-5 weeks",
    avgCost: "$185",
    requirements: ["I-20 form", "SEVIS fee", "DS-160", "Interview"],
    universities: 268,
    activeApplications: 35,
  },
  {
    id: 5,
    name: "Germany",
    flag: "🇩🇪",
    visaTypes: ["National Visa (D)", "Schengen", "Job Seeker"],
    processingTime: "6-8 weeks",
    avgCost: "€75",
    requirements: ["Admission letter", "Blocked account", "Health insurance", "Motivation letter"],
    universities: 86,
    activeApplications: 22,
  },
  {
    id: 6,
    name: "Ireland",
    flag: "🇮🇪",
    visaTypes: ["Study Visa", "Short Stay C", "Long Stay D"],
    processingTime: "8 weeks",
    avgCost: "€60",
    requirements: ["Acceptance letter", "Fee payment proof", "Medical insurance", "Financial proof"],
    universities: 34,
    activeApplications: 18,
  },
];

const Countries = () => {
  return (
    <DashboardLayout title="Countries" subtitle="Visa requirements and information">
      <Card className="shadow-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Countries Database</CardTitle>
              <p className="text-sm text-muted-foreground">Visa types and requirements by country</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search countries..." className="pl-9 w-[200px]" />
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Country
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <Card key={country.id} className="shadow-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent pb-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{country.flag}</span>
                <div>
                  <CardTitle className="text-lg">{country.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{country.universities} universities</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Visa Types</p>
                <div className="flex flex-wrap gap-2">
                  {country.visaTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Processing</p>
                    <p className="font-medium">{country.processingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Visa Fee</p>
                    <p className="font-medium">{country.avgCost}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Key Requirements
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {country.requirements.slice(0, 3).map((req) => (
                    <li key={req} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {country.activeApplications} active applications
                </Badge>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Countries;
