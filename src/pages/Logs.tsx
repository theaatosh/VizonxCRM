import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    History, 
    Search, 
    Filter, 
    RefreshCcw, 
    Calendar as CalendarIcon,
    User as UserIcon,
    Tag,
    Activity,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown
} from 'lucide-react';
import { useLogs, useLogStats } from '@/hooks/useLogs';
import { useUsers } from '@/hooks/useUsers';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { LogAction } from '@/types/log.types';
import { cn } from '@/lib/utils';

const entityTypes = [
    'Task', 'Appointment', 'Lead', 'Student', 'Service', 'VisaApplication', 
    'VisaType', 'Workflow', 'Scholarship', 'Country', 'University', 'User'
];

const logActions: LogAction[] = [
    'Created', 'Updated', 'Deleted', 'StatusChanged', 
    'Assigned', 'Completed', 'Cancelled', 'Login', 'Logout', 'AccessDenied'
];

const Logs = () => {
    // State for filters
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [action, setAction] = useState<string>('all');
    const [entityType, setEntityType] = useState<string>('all');
    const [userId, setUserId] = useState<string>('all');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Data fetching
    const { data: logsData, isLoading: isLoadingLogs, isFetching, refetch } = useLogs({
        page,
        limit,
        search,
        action: action === 'all' ? undefined : action,
        entityType: entityType === 'all' ? undefined : entityType,
        userId: userId === 'all' ? undefined : userId,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        sortOrder,
        sortBy: 'timestamp'
    });

    const { data: stats, isLoading: isLoadingStats } = useLogStats();
    const { data: usersData } = useUsers({ limit: 100 });

    const handleReset = () => {
        setSearch('');
        setAction('all');
        setEntityType('all');
        setUserId('all');
        setFromDate('');
        setToDate('');
        setPage(1);
    };

    const actionColors: Record<LogAction, string> = {
        Created: 'bg-success/10 text-success border-success/20',
        Updated: 'bg-warning/10 text-warning border-warning/20',
        Deleted: 'bg-destructive/10 text-destructive border-destructive/20',
        StatusChanged: 'bg-info/10 text-info border-info/20',
        Assigned: 'bg-primary/10 text-primary border-primary/20',
        Completed: 'bg-success/10 text-success border-success/20',
        Cancelled: 'bg-muted text-muted-foreground border-muted',
        Login: 'bg-info/10 text-info border-info/20',
        Logout: 'bg-muted text-muted-foreground border-muted',
        AccessDenied: 'bg-destructive/10 text-destructive border-destructive/20',
    };

    return (
        <DashboardLayout title="Activity Logs" subtitle="Monitor system changes and user actions">
            <div className="space-y-6">
                {/* Stats Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingStats ? <Skeleton className="h-8 w-16" /> : stats?.totalLogs.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Across all modules</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Recent (24h)</CardTitle>
                            <Activity className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingStats ? <Skeleton className="h-8 w-16" /> : stats?.recentActivityCount.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Activity in last 24 hours</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Most Active Entity</CardTitle>
                            <Tag className="h-4 w-4 text-warning" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold truncate">
                                {isLoadingStats ? <Skeleton className="h-8 w-24" /> : Object.keys(stats?.entityTypeCounts || {}).sort((a, b) => (stats?.entityTypeCounts[b] || 0) - (stats?.entityTypeCounts[a] || 0))[0] || 'N/A'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">By volume of logs</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                            <Activity className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoadingStats ? <Skeleton className="h-8 w-12" /> : (stats?.actionCounts?.['AccessDenied'] || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Access denied events</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm overflow-visible">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5 text-primary" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input 
                                        placeholder="Entity ID, changes..." 
                                        className="pl-9 bg-background/50"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</label>
                                <Select value={action} onValueChange={setAction}>
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="All Actions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Actions</SelectItem>
                                        {logActions.map(act => (
                                            <SelectItem key={act} value={act}>{act}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entity Type</label>
                                <Select value={entityType} onValueChange={setEntityType}>
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="All Entities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Entities</SelectItem>
                                        {entityTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Performed By</label>
                                <Select value={userId} onValueChange={setUserId}>
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="All Users" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Users</SelectItem>
                                        {usersData?.data.map(user => (
                                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end gap-2 xl:col-span-1">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 gap-2"
                                    onClick={handleReset}
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Reset
                                </Button>
                                <Button 
                                    className="flex-1 gap-2"
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                >
                                    {isFetching ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                                    Apply
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 mt-4 max-w-2xl">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">From Date</label>
                                <Input 
                                    type="datetime-local" 
                                    className="bg-background/50" 
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To Date</label>
                                <Input 
                                    type="datetime-local" 
                                    className="bg-background/50" 
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logs Table */}
                <Card className="shadow-sm border-none bg-background/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                Activity History
                            </CardTitle>
                            <CardDescription>Detailed view of all changes</CardDescription>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            Sort by Date
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50 border-b">
                                    <TableRow>
                                        <TableHead className="font-semibold uppercase text-xs">Timestamp</TableHead>
                                        <TableHead className="font-semibold uppercase text-xs">User</TableHead>
                                        <TableHead className="font-semibold uppercase text-xs">Action</TableHead>
                                        <TableHead className="font-semibold uppercase text-xs">Entity</TableHead>
                                        <TableHead className="font-semibold uppercase text-xs">ID / Target</TableHead>
                                        <TableHead className="font-semibold uppercase text-xs text-right">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingLogs ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : !logsData?.data.length ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                No activity logs found for the selected filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logsData.data.map((log) => (
                                            <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="text-xs font-mono">
                                                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <UserIcon className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{log.user?.name || 'System'}</span>
                                                            <span className="text-[10px] text-muted-foreground">{log.user?.role || 'Service'}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn("text-[10px] uppercase font-bold px-2 py-0.5 border", actionColors[log.action])} variant="secondary">
                                                        {log.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-muted text-[10px] tracking-tight uppercase">
                                                        {log.entityType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-[150px]">
                                                    <span className="text-xs font-mono text-muted-foreground truncate block italic">
                                                        {log.entityId}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Search className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {logsData && logsData.totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                                <p className="text-xs text-muted-foreground">
                                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, logsData.total)} of {logsData.total} logs
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1 || isFetching}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex items-center gap-1 mx-2">
                                        {Array.from({ length: Math.min(5, logsData.totalPages) }, (_, i) => {
                                            const pageNum = i + 1; // Simplistic pagination for now
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={page === pageNum ? "default" : "ghost"}
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => setPage(pageNum)}
                                                    disabled={isFetching}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                        {logsData.totalPages > 5 && <span className="text-muted-foreground">...</span>}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2"
                                        onClick={() => setPage(p => Math.min(logsData.totalPages, p + 1))}
                                        disabled={page === logsData.totalPages || isFetching}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Logs;
