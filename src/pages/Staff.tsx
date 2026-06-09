import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
import { Search, Users, MoreHorizontal, AlertTriangle, CheckCircle, UserCog, TrendingUp } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStaffWorkload, useStaffStats } from "@/hooks/useStaff";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { StaffStatusBadge } from "@/components/staff/StaffStatusBadge";
import { cn } from "@/lib/utils";
import type { StaffWorkload } from "@/types/staff.types";

const staffTypeColors: Record<string, string> = {
    Counselor: "bg-primary/10 text-primary border-primary/20",
    AdmissionOfficer: "bg-info/10 text-info border-info/20",
    VisaOfficer: "bg-warning/10 text-warning border-warning/20",
    DocumentationOfficer: "bg-muted text-muted-foreground border-muted",
    FinanceOfficer: "bg-success/10 text-success border-success/20",
    Other: "bg-muted text-muted-foreground border-muted",
};

const staffTypeDisplay: Record<string, string> = {
    Counselor: "Counselor",
    AdmissionOfficer: "Admission Officer",
    VisaOfficer: "Visa Officer",
    DocumentationOfficer: "Documentation Officer",
    FinanceOfficer: "Finance Officer",
    Other: "Other",
};

const Staff = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [staffTypeFilter, setStaffTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data: workloadData, isLoading, isError, error } = useStaffWorkload();
    const { data: stats, isLoading: isLoadingStats } = useStaffStats();

    const filteredStaff = useMemo(() => {
        if (!workloadData) return [];
        let items = [...workloadData];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            items = items.filter(
                (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
            );
        }
        if (staffTypeFilter !== "all") {
            items = items.filter((s) => s.staffType === staffTypeFilter);
        }
        if (statusFilter !== "all") {
            items = items.filter((s) => s.status === statusFilter);
        }
        return items;
    }, [workloadData, searchQuery, staffTypeFilter, statusFilter]);

    const paginatedStaff = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredStaff.slice(start, start + limit);
    }, [filteredStaff, page, limit]);

    const totalPages = Math.ceil(filteredStaff.length / limit);

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const getWorkloadColor = (pct: number) => {
        if (pct >= 80) return "[&>div]:bg-destructive";
        if (pct >= 50) return "[&>div]:bg-warning";
        return "[&>div]:bg-success";
    };

    const StatSkeleton = () => (
        <Card className="shadow-card">
            <CardContent className="p-4">
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );

    const LoadingSkeleton = () => (
        <>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-3 w-[120px]" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                    <TableCell><Skeleton className="h-2 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
            ))}
        </>
    );

    return (
        <DashboardLayout title="Staff Management" subtitle="Manage your team members">
            {/* Stats cards */}
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
                {isLoadingStats ? (
                    <>
                        <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
                    </>
                ) : (
                    <>
                        <Card className="shadow-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <UserCog className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats?.totalStaff || 0}</p>
                                        <p className="text-xs text-muted-foreground">Total Staff</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-card border-success/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats?.available || 0}</p>
                                        <p className="text-xs text-muted-foreground">Available</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-card border-destructive/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats?.overloaded || 0}</p>
                                        <p className="text-xs text-muted-foreground">Overloaded</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-card">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stats?.avgWorkload || 0}%</p>
                                        <p className="text-xs text-muted-foreground">Avg Workload</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Type distribution badges */}
            {stats && stats.byType.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {stats.byType.map((t) => (
                        <button
                            key={t.type}
                            onClick={() => setStaffTypeFilter(staffTypeFilter === t.type ? "all" : t.type)}
                            className={cn(
                                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                                staffTypeFilter === t.type
                                    ? staffTypeColors[t.type] + " border-current"
                                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            )}
                        >
                            <span>{staffTypeDisplay[t.type] || t.type}</span>
                            <span className={cn(
                                "rounded-full px-1.5",
                                staffTypeFilter === t.type ? "bg-current/20" : "bg-muted"
                            )}>{t.count}</span>
                        </button>
                    ))}
                </div>
            )}

            <Card className="shadow-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">All Staff</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {filteredStaff.length} of {workloadData?.length || 0} members
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Select value={staffTypeFilter} onValueChange={(v) => { setStaffTypeFilter(v); setPage(1); }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Staff Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Counselor">Counselor</SelectItem>
                                    <SelectItem value="AdmissionOfficer">Admission Officer</SelectItem>
                                    <SelectItem value="VisaOfficer">Visa Officer</SelectItem>
                                    <SelectItem value="DocumentationOfficer">Documentation Officer</SelectItem>
                                    <SelectItem value="FinanceOfficer">Finance Officer</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Available">Available</SelectItem>
                                    <SelectItem value="Busy">Busy</SelectItem>
                                    <SelectItem value="OnLeave">On Leave</SelectItem>
                                    <SelectItem value="Offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isError && (
                        <div className="py-8 text-center">
                            <p className="text-destructive">
                                Failed to load staff: {error?.message || "Unknown error"}
                            </p>
                            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </div>
                    )}

                    {!isError && (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Staff Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Leads</TableHead>
                                        <TableHead className="text-center">Queue</TableHead>
                                        <TableHead>Workload</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <LoadingSkeleton />
                                    ) : paginatedStaff.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        {searchQuery || staffTypeFilter !== "all" || statusFilter !== "all"
                                                            ? "No staff members match your filters."
                                                            : "No staff members yet."}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedStaff.map((member) => (
                                            <TableRow
                                                key={member.staffId}
                                                className="cursor-pointer"
                                                onClick={() => navigate(`/staff/${member.staffId}`)}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                                            />
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                                {getInitials(member.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-foreground">{member.name}</p>
                                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={staffTypeColors[member.staffType] || staffTypeColors.Other}
                                                    >
                                                        {staffTypeDisplay[member.staffType] || member.staffType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <StaffStatusBadge status={member.status} />
                                                </TableCell>
                                                <TableCell className="text-center text-sm">
                                                    {member.activeLeads || 0}
                                                </TableCell>
                                                <TableCell className="text-center text-sm">
                                                    {member.queueLoad || 0}
                                                </TableCell>
                                                <TableCell className="min-w-[140px]">
                                                    <div className="flex items-center gap-2">
                                                        <Progress
                                                            value={member.workloadPercentage || 0}
                                                            className={cn("h-2 w-20", getWorkloadColor(member.workloadPercentage || 0))}
                                                        />
                                                        <span className={cn(
                                                            "text-xs font-medium",
                                                            (member.workloadPercentage || 0) >= 80 ? "text-destructive" :
                                                            (member.workloadPercentage || 0) >= 50 ? "text-warning" : "text-success"
                                                        )}>
                                                            {member.workloadPercentage || 0}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem
                                                                onClick={() => navigate(`/staff/${member.staffId}`)}
                                                            >
                                                                View Profile
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {filteredStaff.length > 0 && (
                        <DataTablePagination
                            pageIndex={page}
                            pageSize={limit}
                            totalItems={filteredStaff.length}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            onPageSizeChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                        />
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default Staff;
