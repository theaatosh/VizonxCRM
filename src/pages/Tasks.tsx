import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, User, Clock, Search, Filter } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Follow up with Sarah Johnson regarding UK visa documents",
    priority: "High",
    dueDate: "Today",
    assignee: "John Smith",
    category: "Follow-up",
    completed: false,
  },
  {
    id: 2,
    title: "Prepare scholarship application for Michael Chen",
    priority: "High",
    dueDate: "Today",
    assignee: "Emma Wilson",
    category: "Application",
    completed: false,
  },
  {
    id: 3,
    title: "Review Canada study permit requirements",
    priority: "Medium",
    dueDate: "Tomorrow",
    assignee: "David Brown",
    category: "Research",
    completed: false,
  },
  {
    id: 4,
    title: "Schedule counseling session with new leads",
    priority: "Medium",
    dueDate: "Jan 18",
    assignee: "John Smith",
    category: "Meeting",
    completed: false,
  },
  {
    id: 5,
    title: "Update Germany university database",
    priority: "Low",
    dueDate: "Jan 19",
    assignee: "Admin",
    category: "Admin",
    completed: true,
  },
  {
    id: 6,
    title: "Send welcome emails to new applicants",
    priority: "Low",
    dueDate: "Jan 19",
    assignee: "Emma Wilson",
    category: "Communication",
    completed: true,
  },
  {
    id: 7,
    title: "Prepare monthly visa success report",
    priority: "Medium",
    dueDate: "Jan 20",
    assignee: "Admin",
    category: "Report",
    completed: false,
  },
];

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

const categoryColors: Record<string, string> = {
  "Follow-up": "bg-info/10 text-info",
  Application: "bg-primary/10 text-primary",
  Research: "bg-accent text-accent-foreground",
  Meeting: "bg-warning/10 text-warning",
  Admin: "bg-muted text-muted-foreground",
  Communication: "bg-success/10 text-success",
  Report: "bg-primary/10 text-primary",
};

const Tasks = () => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <DashboardLayout title="Tasks" subtitle="Manage team tasks and deadlines">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.priority === "High" && !t.completed).length}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.dueDate === "Today").length}</p>
                <p className="text-sm text-muted-foreground">Due Today</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Checkbox checked className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-9 w-[200px]" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <TabsContent value="pending">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <Checkbox className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-medium text-foreground">{task.title}</p>
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {task.dueDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {task.assignee}
                      </div>
                      <Badge variant="secondary" className={categoryColors[task.category]}>
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 opacity-60"
                >
                  <Checkbox checked className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-foreground line-through">{task.title}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {task.dueDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Tasks;
