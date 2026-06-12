import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Search,
    List,
    Clock,
    Users,
    Loader2,
    CheckCircle,
    SkipForward,
    UserPlus,
    RefreshCw,
    Zap,
    Plus,
    BarChart3,
    ArrowRightLeft,
    ToggleLeft,
    ToggleRight,
    MoreHorizontal,
    Pencil,
    Trash2,
    AlertTriangle,
} from "lucide-react";
import {
    useQueues,
    useQueueItems,
    useQueueAnalytics,
    useUpdateQueueItemStatus,
    useAssignQueueItem,
    useAutoAssignQueueItem,
    useReassignQueueItem,
} from "@/hooks/useQueue";
import { useStaffAvailable } from "@/hooks/useStaff";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import type { QueueItem, QueueItemStatus, Queue } from "@/types/queue.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queueService } from "@/services/queue.service";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/error.utils";

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

const TAB_STATUS_MAP: Record<string, QueueItemStatus | undefined> = {
    all: undefined,
    waiting: "Waiting",
    assigned: "Assigned",
    inprogress: "InProgress",
    completed: "Completed",
    skipped: "Skipped",
};

const Play = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const QueueManagement = () => {
    const [selectedQueueId, setSelectedQueueId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Assign dialog
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
    const [selectedStaffProfileId, setSelectedStaffProfileId] = useState<string>("");

    // Reassign dialog
    const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
    const [reassignItem, setReassignItemState] = useState<QueueItem | null>(null);
    const [reassignStaffId, setReassignStaffId] = useState<string>("");
    const [reassignReason, setReassignReason] = useState<string>("");

    // Create queue dialog
    const [createQueueOpen, setCreateQueueOpen] = useState(false);
    const [newQueueType, setNewQueueType] = useState<string>("");
    const [newQueueName, setNewQueueName] = useState<string>("");
    const [newQueueDesc, setNewQueueDesc] = useState<string>("");
    const [newQueueAutoAssign, setNewQueueAutoAssign] = useState(false);

    // Edit queue dialog
    const [editQueueOpen, setEditQueueOpen] = useState(false);
    const [editingQueue, setEditingQueue] = useState<Queue | null>(null);
    const [editQueueName, setEditQueueName] = useState("");
    const [editQueueDesc, setEditQueueDesc] = useState("");
    const [editQueueAutoAssign, setEditQueueAutoAssign] = useState(false);

    // Delete queue dialog
    const [deleteQueueOpen, setDeleteQueueOpen] = useState(false);
    const [deletingQueue, setDeletingQueue] = useState<Queue | null>(null);

    const queryClient = useQueryClient();

    const statusFilter = TAB_STATUS_MAP[activeTab];

    const { data: queuesData, isLoading: isLoadingQueues } = useQueues();
    const { data: itemsData, isLoading: isLoadingItems } = useQueueItems(selectedQueueId, {
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter,
        sortOrder: "desc",
    });
    const { data: analytics, isLoading: isLoadingAnalytics } = useQueueAnalytics();
    const { data: availableStaff } = useStaffAvailable();
    const updateStatus = useUpdateQueueItemStatus();
    const assignItem = useAssignQueueItem();
    const autoAssign = useAutoAssignQueueItem();
    const reassign = useReassignQueueItem();

    const createQueue = useMutation({
        mutationFn: (data: { type: string; name: string; description?: string; autoAssign?: boolean }) =>
            queueService.createQueue(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["queue"] });
            toast.success("Queue created");
            setCreateQueueOpen(false);
            setNewQueueType("");
            setNewQueueName("");
            setNewQueueDesc("");
        },
        onError: (err) => toast.error(`Failed to create queue: ${getApiErrorMessage(err)}`),
    });

    const updateQueueMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string; autoAssign?: boolean } }) =>
            queueService.updateQueue(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["queue"] });
            toast.success("Queue updated");
        },
        onError: (err) => toast.error(`Failed to update queue: ${getApiErrorMessage(err)}`),
    });

    const deleteQueueMutation = useMutation({
        mutationFn: (id: string) => queueService.deleteQueue(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["queue"] });
            toast.success("Queue deleted");
            if (selectedQueueId === deletingQueue?.id) {
                setSelectedQueueId("");
            }
        },
        onError: (err) => toast.error(`Failed to delete queue: ${getApiErrorMessage(err)}`),
    });

    const handleToggleAutoAssign = () => {
        if (selectedQueue) {
            updateQueueMutation.mutate({
                id: selectedQueue.id,
                data: { autoAssign: !selectedQueue.autoAssign },
            });
        }
    };

    const handleDeleteQueue = () => {
        if (deletingQueue) {
            deleteQueueMutation.mutate(deletingQueue.id);
            setDeleteQueueOpen(false);
            setDeletingQueue(null);
        }
    };

    const queues = useMemo(() => queuesData?.data || [], [queuesData?.data]);
    const queueItems = useMemo(() => itemsData?.data || [], [itemsData?.data]);
    const availableCounselors = useMemo(() => availableStaff || [], [availableStaff]);

    const selectedQueue = useMemo(() => queues.find(q => q.id === selectedQueueId), [queues, selectedQueueId]);
    const perQueueAnalytics = useMemo(
        () => analytics?.queues?.find(q => q.queueId === selectedQueueId),
        [analytics, selectedQueueId]
    );

    // Auto-select first queue
    useEffect(() => {
        if (!selectedQueueId && queues.length > 0) {
            setSelectedQueueId(queues[0].id);
        }
    }, [queues, selectedQueueId]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setPage(1);
    };

    const handleQueueChange = (queueId: string) => {
        setSelectedQueueId(queueId);
        setPage(1);
        setActiveTab("all");
    };

    const handleStatusUpdate = (item: QueueItem, newStatus: QueueItemStatus) => {
        if (selectedQueueId) {
            updateStatus.mutate({ queueId: selectedQueueId, itemId: item.id, status: newStatus });
        }
    };

    const handleOpenAssign = (item: QueueItem) => {
        setSelectedItem(item);
        setSelectedStaffProfileId(item.assignedTo || "");
        setAssignDialogOpen(true);
    };

    const handleAssign = () => {
        if (selectedItem && selectedStaffProfileId && selectedQueueId) {
            assignItem.mutate({ queueId: selectedQueueId, itemId: selectedItem.id, staffProfileId: selectedStaffProfileId });
            setAssignDialogOpen(false);
            setSelectedItem(null);
        }
    };

    const handleAutoAssign = (item: QueueItem) => {
        if (selectedQueueId) {
            autoAssign.mutate({ queueId: selectedQueueId, itemId: item.id });
        }
    };

    const handleOpenReassign = (item: QueueItem) => {
        setReassignItemState(item);
        setReassignStaffId("");
        setReassignReason("");
        setReassignDialogOpen(true);
    };

    const handleReassign = () => {
        if (reassignItem && reassignStaffId && reassignReason && selectedQueueId) {
            reassign.mutate({
                queueId: selectedQueueId,
                itemId: reassignItem.id,
                toStaffProfileId: reassignStaffId,
                reason: reassignReason,
            });
            setReassignDialogOpen(false);
            setReassignItemState(null);
        }
    };

    const handleCreateQueue = () => {
        if (newQueueType && newQueueName) {
            createQueue.mutate({
                type: newQueueType,
                name: newQueueName,
                description: newQueueDesc || undefined,
                autoAssign: newQueueAutoAssign,
            });
        }
    };

    const handleOpenEditQueue = (queue: Queue) => {
        setEditingQueue(queue);
        setEditQueueName(queue.name);
        setEditQueueDesc(queue.description || "");
        setEditQueueAutoAssign(queue.autoAssign);
        setEditQueueOpen(true);
    };

    const handleEditQueue = () => {
        if (editingQueue && editQueueName) {
            updateQueueMutation.mutate({
                id: editingQueue.id,
                data: { name: editQueueName, description: editQueueDesc || undefined, autoAssign: editQueueAutoAssign },
            });
            setEditQueueOpen(false);
            setEditingQueue(null);
        }
    };

    const handleOpenDeleteQueue = (queue: Queue) => {
        setDeletingQueue(queue);
        setDeleteQueueOpen(true);
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
        name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const getStaffName = (item: QueueItem) => item.assignedStaff?.user?.name || null;

    const getTabCount = (tab: string) => {
        if (!selectedQueue?.counts) return null;
        const counts = selectedQueue.counts;
        const map: Record<string, number> = {
            waiting: counts.waiting,
            assigned: counts.assigned,
            inprogress: counts.inProgress,
            completed: counts.completed,
        };
        return map[tab] ?? null;
    };

    const renderQueueTable = (items: QueueItem[]) => (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Lead</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Wait Time</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <List className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-muted-foreground">No queue items found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
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
                                <TableCell>
                                    <Badge variant="outline" className={priorityColors[item.priority]}>
                                        {item.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {getStaffName(item) || (
                                        <span className="text-muted-foreground italic">Unassigned</span>
                                    )}
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
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {item.status === "Waiting" && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleOpenAssign(item)}
                                                    title="Manually assign"
                                                >
                                                    <UserPlus className="h-3.5 w-3.5 text-primary" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleAutoAssign(item)}
                                                    title="Auto assign"
                                                    disabled={autoAssign.isPending}
                                                >
                                                    <Zap className="h-3.5 w-3.5 text-info" />
                                                </Button>
                                            </>
                                        )}
                                        {item.status === "Assigned" && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleStatusUpdate(item, "InProgress")}
                                                    title="Start"
                                                >
                                                    <Play className="h-3.5 w-3.5 text-warning" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleOpenReassign(item)}
                                                    title="Reassign"
                                                >
                                                    <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
                                                </Button>
                                            </>
                                        )}
                                        {item.status === "InProgress" && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleStatusUpdate(item, "Completed")}
                                                    title="Complete"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleOpenReassign(item)}
                                                    title="Reassign"
                                                >
                                                    <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
                                                </Button>
                                            </>
                                        )}
                                        {(item.status === "Waiting" || item.status === "Assigned") && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => handleStatusUpdate(item, "Skipped")}
                                                title="Skip"
                                            >
                                                <SkipForward className="h-3.5 w-3.5 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    const existingQueueTypes = queues.map(q => q.type);
    const availableQueueTypes = ["NewLead", "RevisitLead", "ManualAssignment"].filter(
        t => !existingQueueTypes.includes(t as any)
    );

    return (
        <DashboardLayout
            title="Queue Management"
            subtitle="Manage lead queue and assignments"
            action={
                availableQueueTypes.length > 0 ? (
                    <Button size="sm" onClick={() => setCreateQueueOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Queue
                    </Button>
                ) : undefined
            }
        >
            {/* Overview Metrics */}
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="shadow-card">
                    <CardContent className="p-4">
                        {isLoadingAnalytics ? (
                            <Skeleton className="h-12 w-full" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <List className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analytics?.totalItems || 0}</p>
                                    <p className="text-xs text-muted-foreground">Total Items</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="shadow-card">
                    <CardContent className="p-4">
                        {isLoadingAnalytics ? (
                            <Skeleton className="h-12 w-full" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analytics?.waiting || 0}</p>
                                    <p className="text-xs text-muted-foreground">Waiting</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="shadow-card">
                    <CardContent className="p-4">
                        {isLoadingAnalytics ? (
                            <Skeleton className="h-12 w-full" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analytics?.assigned || 0}</p>
                                    <p className="text-xs text-muted-foreground">Assigned</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="shadow-card">
                    <CardContent className="p-4">
                        {isLoadingAnalytics ? (
                            <Skeleton className="h-12 w-full" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{analytics?.completed || 0}</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Queue Selector row */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                {isLoadingQueues ? (
                    <Skeleton className="h-10 w-[220px]" />
                ) : queues.length === 0 ? (
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 px-4 py-2.5">
                        <p className="text-sm text-muted-foreground">No queues yet.</p>
                        <Button size="sm" variant="outline" onClick={() => setCreateQueueOpen(true)}>
                            <Plus className="h-4 w-4 mr-1" /> Create Queue
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2">
                        {queues.map((q) => (
                            <div key={q.id} className="flex items-center">
                                <button
                                    onClick={() => handleQueueChange(q.id)}
                                    className={cn(
                                        "flex items-center gap-2 rounded-l-lg border border-r-0 px-3 py-2 text-sm font-medium transition-all",
                                        selectedQueueId === q.id
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                    )}
                                >
                                    <span>{q.name}</span>
                                    {q.counts && (
                                        <span className={cn(
                                            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                                            selectedQueueId === q.id
                                                ? "bg-primary/20 text-primary"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {q.counts.waiting + q.counts.assigned + q.counts.inProgress}
                                        </span>
                                    )}
                                </button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className={cn(
                                                "flex items-center rounded-r-lg border px-1 py-2 text-sm font-medium transition-all",
                                                selectedQueueId === q.id
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                            )}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenEditQueue(q)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Queue
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => handleOpenDeleteQueue(q)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Queue
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                        {selectedQueue && (
                            <div className="flex items-center gap-2 ml-3 pl-3 border-l">
                                <Switch
                                    checked={selectedQueue.autoAssign}
                                    onCheckedChange={handleToggleAutoAssign}
                                    disabled={updateQueueMutation.isPending}
                                    id="auto-assign-toggle"
                                />
                                <label
                                    htmlFor="auto-assign-toggle"
                                    className="text-xs text-muted-foreground cursor-pointer select-none"
                                >
                                    Auto Assign
                                </label>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Per-queue analytics strip */}
            {perQueueAnalytics && (
                <Card className="shadow-card mb-4">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground">Queue Analytics</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                                    <span className="text-muted-foreground">Waiting:</span>
                                    <span className="font-semibold">{perQueueAnalytics.waiting}</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-info" />
                                    <span className="text-muted-foreground">Assigned:</span>
                                    <span className="font-semibold">{perQueueAnalytics.assigned}</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-warning" />
                                    <span className="text-muted-foreground">In Progress:</span>
                                    <span className="font-semibold">{perQueueAnalytics.inProgress}</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-success" />
                                    <span className="text-muted-foreground">Completed:</span>
                                    <span className="font-semibold">{perQueueAnalytics.completed}</span>
                                </span>
                                {perQueueAnalytics.avgWaitTimeHours > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">Avg wait:</span>
                                        <span className="font-semibold">{perQueueAnalytics.avgWaitTimeHours.toFixed(1)}h</span>
                                    </span>
                                )}
                                {perQueueAnalytics.avgProcessingTimeHours > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">Avg processing:</span>
                                        <span className="font-semibold">{perQueueAnalytics.avgProcessingTimeHours.toFixed(1)}h</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Queue Items Card */}
            <Card className="shadow-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg font-semibold">
                            {selectedQueue ? selectedQueue.name : "Queue Items"}
                        </CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search leads..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                className="pl-9 w-[220px]"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="waiting" className="flex items-center gap-1.5">
                                Waiting
                                {getTabCount("waiting") !== null && (
                                    <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">
                                        {getTabCount("waiting")}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="assigned" className="flex items-center gap-1.5">
                                Assigned
                                {getTabCount("assigned") !== null && (
                                    <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">
                                        {getTabCount("assigned")}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="inprogress" className="flex items-center gap-1.5">
                                In Progress
                                {getTabCount("inprogress") !== null && (
                                    <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">
                                        {getTabCount("inprogress")}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="flex items-center gap-1.5">
                                Completed
                                {getTabCount("completed") !== null && (
                                    <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">
                                        {getTabCount("completed")}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="skipped">Skipped</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab}>
                            {isLoadingItems ? (
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))}
                                </div>
                            ) : !selectedQueueId ? (
                                <div className="py-8 text-center">
                                    <p className="text-muted-foreground">Select a queue to view items</p>
                                </div>
                            ) : (
                                renderQueueTable(queueItems)
                            )}
                        </TabsContent>
                    </Tabs>

                    {itemsData && (
                        <DataTablePagination
                            pageIndex={page}
                            pageSize={limit}
                            totalItems={itemsData.total}
                            totalPages={itemsData.totalPages}
                            onPageChange={setPage}
                            onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Assign Queue Item</DialogTitle>
                        <DialogDescription>
                            Select a staff member to assign this lead to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Lead</Label>
                            <p className="text-sm font-medium">
                                {selectedItem?.lead
                                    ? `${selectedItem.lead.firstName} ${selectedItem.lead.lastName}`
                                    : "Unknown"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Staff Member</Label>
                            <Select value={selectedStaffProfileId} onValueChange={setSelectedStaffProfileId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCounselors.length === 0 ? (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            No available staff
                                        </div>
                                    ) : (
                                        availableCounselors.map((s) => (
                                            <SelectItem key={s.staffId} value={s.staffId}>
                                                <div className="flex items-center gap-2">
                                                    <span>{s.name}</span>
                                                    <Badge variant="outline" className="text-[10px]">{s.staffType}</Badge>
                                                    <span className="text-xs text-muted-foreground">{s.workloadPercentage}%</span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedStaffProfileId && (() => {
                            const s = availableCounselors.find(c => c.staffId === selectedStaffProfileId);
                            if (!s) return null;
                            return (
                                <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Current workload</span>
                                        <span className={cn(
                                            "font-semibold",
                                            s.workloadPercentage >= 80 ? "text-destructive" :
                                            s.workloadPercentage >= 50 ? "text-warning" : "text-success"
                                        )}>{s.workloadPercentage}%</span>
                                    </div>
                                    <Progress value={s.workloadPercentage} className="h-1.5" />
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>Leads: {s.activeLeads}</span>
                                        <span>Queue: {s.queueLoad}</span>
                                        <span>Tasks: {s.openTasks}</span>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssign} disabled={!selectedStaffProfileId || assignItem.isPending}>
                            {assignItem.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning...</>
                            ) : "Assign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reassign Dialog */}
            <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader>
                        <DialogTitle>Reassign Queue Item</DialogTitle>
                        <DialogDescription>
                            Move this lead from the current counselor to another.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {reassignItem && (
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Lead</Label>
                                <p className="text-sm font-medium">
                                    {reassignItem.lead
                                        ? `${reassignItem.lead.firstName} ${reassignItem.lead.lastName}`
                                        : "Unknown"}
                                </p>
                            </div>
                        )}
                        {reassignItem?.assignedStaff && (
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Currently Assigned To</Label>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                            {getInitials(reassignItem.assignedStaff.user?.name || "?")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">
                                        {reassignItem.assignedStaff.user?.name || "Unknown"}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Reassign To</Label>
                            <Select value={reassignStaffId} onValueChange={setReassignStaffId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select new staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCounselors
                                        .filter(s => s.staffId !== reassignItem?.assignedTo)
                                        .map((s) => (
                                            <SelectItem key={s.staffId} value={s.staffId}>
                                                <div className="flex items-center gap-2">
                                                    <span>{s.name}</span>
                                                    <Badge variant="outline" className="text-[10px]">{s.staffType}</Badge>
                                                    <span className="text-xs text-muted-foreground">{s.workloadPercentage}%</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Reassignment</Label>
                            <Textarea
                                placeholder="e.g. Workload balance, counselor on leave..."
                                value={reassignReason}
                                onChange={(e) => setReassignReason(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReassignDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReassign}
                            disabled={!reassignStaffId || !reassignReason || reassign.isPending}
                        >
                            {reassign.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reassigning...</>
                            ) : "Reassign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Queue Dialog */}
            <Dialog open={createQueueOpen} onOpenChange={setCreateQueueOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Create Queue</DialogTitle>
                        <DialogDescription>
                            Each queue type can only be created once per organisation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Queue Type</Label>
                            <Select value={newQueueType} onValueChange={setNewQueueType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableQueueTypes.map(t => (
                                        <SelectItem key={t} value={t}>
                                            {t === "NewLead" ? "New Lead Queue" :
                                             t === "RevisitLead" ? "Revisit Lead Queue" :
                                             "Manual Assignment Queue"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Queue Name</Label>
                            <Input
                                placeholder="e.g. New Leads Queue"
                                value={newQueueName}
                                onChange={(e) => setNewQueueName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Textarea
                                placeholder="Describe the purpose of this queue..."
                                value={newQueueDesc}
                                onChange={(e) => setNewQueueDesc(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="create-auto-assign"
                                checked={newQueueAutoAssign}
                                onCheckedChange={setNewQueueAutoAssign}
                            />
                            <Label htmlFor="create-auto-assign" className="text-sm cursor-pointer">
                                Auto Assign
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateQueueOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateQueue}
                            disabled={!newQueueType || !newQueueName || createQueue.isPending}
                        >
                            {createQueue.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                            ) : "Create Queue"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Queue Dialog */}
            <Dialog open={editQueueOpen} onOpenChange={setEditQueueOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Edit Queue</DialogTitle>
                        <DialogDescription>Update the queue name, description, or auto-assign setting.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Queue Name</Label>
                            <Input
                                placeholder="e.g. New Leads Queue"
                                value={editQueueName}
                                onChange={(e) => setEditQueueName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Textarea
                                placeholder="Describe the purpose of this queue..."
                                value={editQueueDesc}
                                onChange={(e) => setEditQueueDesc(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="edit-auto-assign"
                                checked={editQueueAutoAssign}
                                onCheckedChange={setEditQueueAutoAssign}
                            />
                            <Label htmlFor="edit-auto-assign" className="text-sm cursor-pointer">Auto Assign</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditQueueOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditQueue} disabled={!editQueueName || updateQueueMutation.isPending}>
                            {updateQueueMutation.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Queue Confirmation Dialog */}
            <Dialog open={deleteQueueOpen} onOpenChange={setDeleteQueueOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Delete Queue
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{deletingQueue?.name}</strong>? This action cannot be undone. All items in this queue will also be removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteQueueOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteQueue}
                            disabled={deleteQueueMutation.isPending}
                        >
                            {deleteQueueMutation.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                            ) : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default QueueManagement;
