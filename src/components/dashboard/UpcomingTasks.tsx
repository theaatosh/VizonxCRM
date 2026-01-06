import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, User } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Follow up with Sarah Johnson",
    priority: "High",
    dueDate: "Today",
    assignee: "John Smith",
    completed: false,
  },
  {
    id: 2,
    title: "Prepare UK visa documents",
    priority: "High",
    dueDate: "Today",
    assignee: "Emma Wilson",
    completed: false,
  },
  {
    id: 3,
    title: "Schedule appointment - Michael Chen",
    priority: "Medium",
    dueDate: "Tomorrow",
    assignee: "David Brown",
    completed: false,
  },
  {
    id: 4,
    title: "Update scholarship database",
    priority: "Low",
    dueDate: "Jan 18",
    assignee: "Admin",
    completed: true,
  },
  {
    id: 5,
    title: "Review Germany university list",
    priority: "Medium",
    dueDate: "Jan 19",
    assignee: "John Smith",
    completed: false,
  },
];

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

export function UpcomingTasks() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
            <p className="text-sm text-muted-foreground">Tasks that need attention</p>
          </div>
          <Badge variant="outline" className="font-normal">
            View All
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            <Checkbox checked={task.completed} className="mt-1" />
            <div className="flex-1 space-y-1">
              <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.title}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.dueDate}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {task.assignee}
                </div>
              </div>
            </div>
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
