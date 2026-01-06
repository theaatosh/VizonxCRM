import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, FileText, Send, CheckCircle, ArrowRight } from "lucide-react";

const stages = [
  {
    id: 1,
    name: "Inquiry",
    icon: MessageSquare,
    color: "bg-muted",
    textColor: "text-muted-foreground",
    count: 24,
    leads: [
      { name: "John Doe", country: "USA", date: "2 hours ago" },
      { name: "Jane Smith", country: "UK", date: "5 hours ago" },
      { name: "Alex Wong", country: "Canada", date: "1 day ago" },
    ],
  },
  {
    id: 2,
    name: "Documentation",
    icon: FileText,
    color: "bg-warning/10",
    textColor: "text-warning",
    count: 18,
    leads: [
      { name: "Sarah Lee", country: "Australia", date: "1 day ago" },
      { name: "Mike Chen", country: "Germany", date: "2 days ago" },
    ],
  },
  {
    id: 3,
    name: "Application",
    icon: Send,
    color: "bg-info/10",
    textColor: "text-info",
    count: 15,
    leads: [
      { name: "Emma Wilson", country: "Ireland", date: "3 days ago" },
      { name: "David Kim", country: "UK", date: "4 days ago" },
      { name: "Lisa Park", country: "Canada", date: "5 days ago" },
    ],
  },
  {
    id: 4,
    name: "Visa Processing",
    icon: CheckCircle,
    color: "bg-success/10",
    textColor: "text-success",
    count: 12,
    leads: [
      { name: "Tom Brown", country: "USA", date: "1 week ago" },
      { name: "Anna Garcia", country: "Spain", date: "1 week ago" },
    ],
  },
];

const Workflow = () => {
  return (
    <DashboardLayout title="Workflow" subtitle="Visual pipeline management">
      {/* Pipeline Overview */}
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Application Pipeline</CardTitle>
          <p className="text-sm text-muted-foreground">Track leads through each stage</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-8">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${stage.color} ${stage.textColor}`}
                  >
                    <stage.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-2 text-sm font-medium">{stage.name}</p>
                  <Badge variant="secondary" className="mt-1">
                    {stage.count}
                  </Badge>
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className="mx-4 h-5 w-5 text-muted-foreground hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stage.color}`}>
                    <stage.icon className={`h-4 w-4 ${stage.textColor}`} />
                  </div>
                  <CardTitle className="text-base font-semibold">{stage.name}</CardTitle>
                </div>
                <Badge variant="outline">{stage.count}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {stage.leads.map((lead, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border p-3 bg-background hover:bg-muted/50 transition-colors cursor-pointer"
                >
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.country}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{lead.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Workflow;
