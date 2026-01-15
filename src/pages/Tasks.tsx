import { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  Briefcase,
  GraduationCap,
  Edit,
  Trash2
} from "lucide-react";
import { useTasks, useDeleteTask, useUpdateTask } from "@/hooks/useTasks";
import { Task, TaskPriority, TaskStatus, RelatedEntityType } from "@/types/task.types";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasksResponse, isLoading } = useTasks({
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const tasks = tasksResponse?.data || [];

  // Filter tasks based on search
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter((t) => t.status !== TaskStatus.COMPLETED);
  const completedTasks = filteredTasks.filter((t) => t.status === TaskStatus.COMPLETED);

  // Stats Calculation from ALL fetched tasks (not filtered by search for accurate stats)
  const allTasks = tasks;
  const today = new Date().toISOString().split('T')[0];

  const stats = {
    pending: allTasks.filter(t => t.status !== TaskStatus.COMPLETED).length,
    highPriority: allTasks.filter(t => t.priority === TaskPriority.HIGH && t.status !== TaskStatus.COMPLETED).length,
    dueToday: allTasks.filter(t => t.dueDate?.startsWith(today) && t.status !== TaskStatus.COMPLETED).length,
    completed: allTasks.filter(t => t.status === TaskStatus.COMPLETED).length
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsCreateOpen(true);
  };

  const handleToggleComplete = async (task: Task, isCompleted: boolean) => {
    await updateTask.mutateAsync({
      id: task.id,
      data: {
        status: isCompleted ? TaskStatus.COMPLETED : TaskStatus.PENDING
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this task?")) {
      await deleteTask.mutateAsync(id);
    }
  };

  const handleCreateOpen = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) setEditingTask(null);
  };

  const renderTaskItem = (task: Task, isCompleted: boolean = false) => (
    <div
      key={task.id}
      className={cn(
        "flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 group",
        isCompleted && "opacity-60"
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={(checked) => handleToggleComplete(task, checked as boolean)}
        className="mt-1"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <p className={cn("font-medium text-foreground", isCompleted && "line-through")}>
            {task.title}
          </p>
          <div className="flex items-center gap-2">
            {!isCompleted && (
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            )}
            {/* Edit/Delete Actions */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(task)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(task.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {task.assignedUser?.name || "Unassigned"}
          </div>
          <Badge variant="secondary" className="bg-primary/5 text-primary">
            {task.relatedEntityType === RelatedEntityType.LEAD ? (
              <Briefcase className="mr-1 h-3 w-3" />
            ) : (
              <GraduationCap className="mr-1 h-3 w-3" />
            )}
            {task.relatedEntityType}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Tasks" subtitle="Loading tasks...">
        <div className="p-8 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tasks" subtitle="Manage team tasks and deadlines">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
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
                <p className="text-2xl font-bold">{stats.highPriority}</p>
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
                <p className="text-2xl font-bold">{stats.dueToday}</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
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
              <Input
                placeholder="Search tasks..."
                className="pl-9 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <TabsContent value="pending">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending tasks found.
                </div>
              ) : (
                pendingTasks.map((task) => renderTaskItem(task, false))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No completed tasks found.
                </div>
              ) : (
                completedTasks.map((task) => renderTaskItem(task, true))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TaskFormDialog
        open={isCreateOpen}
        onOpenChange={handleCreateOpen}
        task={editingTask}
      />
    </DashboardLayout>
  );
};

export default Tasks;
