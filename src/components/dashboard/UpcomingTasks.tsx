import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, User, CalendarClock } from "lucide-react";
import type { UpcomingTask } from "@/types/dashboard.types";

interface UpcomingTasksProps {
  tasks?: UpcomingTask[];
  isLoading?: boolean;
}

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

function formatDueDate(dateString: string): string {
  const dueDate = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const dueDateOnly = new Date(dueDate);
  dueDateOnly.setHours(0, 0, 0, 0);

  if (dueDateOnly.getTime() === today.getTime()) {
    return "Today";
  } else if (dueDateOnly.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else if (dueDateOnly < today) {
    return "Overdue";
  } else {
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function TaskSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
          <Skeleton className="h-4 w-4 mt-1 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-14" />
        </div>
      ))}
    </div>
  );
}

export function UpcomingTasks({ tasks, isLoading = false }: UpcomingTasksProps) {
  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <TaskSkeleton />
        </CardContent>
      </Card>
    );
  }

  const hasTasks = tasks && tasks.length > 0;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
            <p className="text-sm text-muted-foreground">Tasks that need attention</p>
          </div>
          <Badge variant="outline" className="font-normal cursor-pointer hover:bg-muted">
            View All
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasTasks ? (
          tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const dueLabel = formatDueDate(task.dueDate);
            const isOverdue = dueLabel === 'Overdue';

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 ${isCompleted ? "opacity-60" : ""
                  }`}
              >
                <Checkbox checked={isCompleted} className="mt-1" />
                <div className="flex-1 space-y-1">
                  <p className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive' : ''}`}>
                      {isOverdue ? <CalendarClock className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {dueLabel}
                    </div>
                    {task.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignedTo.name}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={priorityColors[task.priority] || priorityColors.Medium}>
                  {task.priority}
                </Badge>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <CalendarClock className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No upcoming tasks</p>
            <p className="text-sm mt-1">All caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
