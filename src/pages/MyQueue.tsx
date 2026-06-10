import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermissions } from "@/contexts/PermissionContext";
import { useQueues, useUpdateQueueItemStatus } from "@/hooks/useQueue";
import { queueService } from "@/services/queue.service";
import { useQuery, useQueries } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";
import { Search, Clock, Loader2, CheckCircle, SkipForward, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QueueItem, QueueItemStatus } from "@/types/queue.types";

const statusColors: Record<QueueItemStatus, string> = {
  Waiting: "bg-muted text-muted-foreground border-muted",
  Assigned: "bg-info/10 text-info border-info/20",
  InProgress: "bg-warning/10 text-warning border-warning/20",
  Completed: "bg-success/10 text-success border-success/20",
  Skipped: "bg-destructive/10 text-destructive border-destructive/20",
  Reassigned: "bg-muted text-muted-foreground border-muted",
};

const statusDotColors: Record<QueueItemStatus, string> = {
  Waiting: "bg-muted-foreground",
  Assigned: "bg-info",
  InProgress: "bg-warning",
  Completed: "bg-success",
  Skipped: "bg-destructive",
  Reassigned: "bg-muted-foreground",
};

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-success/10 text-success border-success/20",
};

const Play = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const MyQueue = () => {
  const { user } = usePermissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQueueId, setSelectedQueueId] = useState<string>("all");

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["staff", "by-user", user?.id],
    queryFn: () => staffService.getByUserId(user!.id),
    enabled: !!user?.id,
  });

  const { data: queuesData, isLoading: isLoadingQueues } = useQueues();
  const queues = useMemo(() => queuesData?.data || [], [queuesData?.data]);

  const queueItemQueries = useQueries({
    queries: queues.map((queue) => ({
      queryKey: ["my-queue-items", queue.id, profile?.id],
      queryFn: () => queueService.getItems(queue.id, { assignedTo: profile?.id, limit: 1000 }),
      enabled: !!profile?.id,
    })),
  });

  const allItems = useMemo(() => {
    const items: (QueueItem & { queueName?: string })[] = [];
    queueItemQueries.forEach((query, index) => {
      if (query.data?.data) {
        query.data.data.forEach((item) => {
          items.push({ ...item, queueName: queues[index]?.name });
        });
      }
    });
    return items;
  }, [queueItemQueries, queues]);

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (selectedQueueId !== "all") {
      items = items.filter((item) => item.queueId === selectedQueueId);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.lead?.firstName?.toLowerCase().includes(q) ||
          item.lead?.lastName?.toLowerCase().includes(q) ||
          item.lead?.email?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, selectedQueueId, searchQuery]);

  const updateStatus = useUpdateQueueItemStatus();

  const handleStatusUpdate = (item: QueueItem, newStatus: QueueItemStatus) => {
    const queueId = item.queueId;
    if (queueId) {
      updateStatus.mutate({ queueId, itemId: item.id, status: newStatus });
    }
  };

  const formatWaitTime = (enteredAt?: string, assignedAt?: string) => {
    if (!enteredAt) return "-";
    const from = new Date(enteredAt);
    const to = assignedAt ? new Date(assignedAt) : new Date();
    const diffMs = to.getTime() - from.getTime();
    if (diffMs < 0) return "0m";
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const isLoading = isLoadingProfile || isLoadingQueues || queueItemQueries.some((q) => q.isLoading);

  if (!isLoading && !profile) {
    return (
      <DashboardLayout title="My Queue" subtitle="View your assigned leads">
        <div className="py-12 text-center">
          <p className="text-destructive">
            No staff profile found for your account. Please contact an administrator.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Queue" subtitle="View and manage your assigned leads">
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg font-semibold">Assigned Items</CardTitle>
              {!isLoading && (
                <span className="text-sm text-muted-foreground">
                  {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[220px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedQueueId("all")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                selectedQueueId === "all"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              All Queues
            </button>
            {queues.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQueueId(q.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                  selectedQueueId === q.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {q.name}
              </button>
            ))}
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Lead</TableHead>
                  <TableHead>Queue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <List className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchQuery
                            ? "No items matching your search."
                            : "No items assigned to you yet."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {item.lead
                                ? getInitials(`${item.lead.firstName} ${item.lead.lastName}`)
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {item.lead
                                ? `${item.lead.firstName} ${item.lead.lastName}`
                                : "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.lead?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.queueName || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityColors[item.priority]}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[item.status]}>
                          <span
                            className={cn(
                              "mr-1.5 h-2 w-2 rounded-full inline-block",
                              statusDotColors[item.status]
                            )}
                          />
                          {item.status === "InProgress" ? "In Progress" : item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatWaitTime(item.enteredAt, item.assignedAt || undefined)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {item.status === "Assigned" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleStatusUpdate(item, "InProgress")}
                                title="Start"
                                disabled={updateStatus.isPending}
                              >
                                <Play className="h-3.5 w-3.5 text-warning" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleStatusUpdate(item, "Skipped")}
                                title="Skip"
                                disabled={updateStatus.isPending}
                              >
                                <SkipForward className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </>
                          )}
                          {item.status === "InProgress" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleStatusUpdate(item, "Completed")}
                              title="Complete"
                              disabled={updateStatus.isPending}
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-success" />
                            </Button>
                          )}
                          {item.status !== "Assigned" && item.status !== "InProgress" && (
                            <span className="text-xs text-muted-foreground italic">-</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MyQueue;
