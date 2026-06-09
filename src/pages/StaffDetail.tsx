import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Users,
    Pencil,
    Trash2,
    Loader2,
    CheckSquare,
    List,
    Activity,
} from "lucide-react";
import {
    useStaffMember,
    useStaffWorkload,
    useUpdateStaffStatus,
    useUpdateStaff,
    useDeleteStaff,
} from "@/hooks/useStaff";
import { StaffStatusBadge } from "@/components/staff/StaffStatusBadge";
import { StaffStatusSelect } from "@/components/staff/StaffAvailabilitySelect";
import { cn } from "@/lib/utils";
import type { StaffType, UpdateStaffDto } from "@/types/staff.types";

const staffTypeDisplay: Record<string, string> = {
    Counselor: "Counselor",
    AdmissionOfficer: "Admission Officer",
    VisaOfficer: "Visa Officer",
    DocumentationOfficer: "Documentation Officer",
    FinanceOfficer: "Finance Officer",
    Other: "Other",
};

const staffTypeColors: Record<string, string> = {
    Counselor: "bg-primary/10 text-primary border-primary/20",
    AdmissionOfficer: "bg-info/10 text-info border-info/20",
    VisaOfficer: "bg-warning/10 text-warning border-warning/20",
    DocumentationOfficer: "bg-muted text-muted-foreground border-muted",
    FinanceOfficer: "bg-success/10 text-success border-success/20",
    Other: "bg-muted text-muted-foreground border-muted",
};

const StaffDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: member, isLoading, isError } = useStaffMember(id || "");
    const { data: workloadList } = useStaffWorkload(id || undefined);
    const updateStatus = useUpdateStaffStatus();
    const updateStaff = useUpdateStaff();
    const deleteStaff = useDeleteStaff();

    const workload = workloadList?.find((w) => w.staffId === id);

    // Edit dialog state
    const [editOpen, setEditOpen] = useState(false);
    const [editStaffType, setEditStaffType] = useState<StaffType>("Counselor");
    const [editDepartment, setEditDepartment] = useState("");
    const [editMaxWorkload, setEditMaxWorkload] = useState<number>(100);

    // Delete dialog state
    const [deleteOpen, setDeleteOpen] = useState(false);

    const openEditDialog = () => {
        if (!member) return;
        setEditStaffType(member.staffType);
        setEditDepartment(member.department || "");
        setEditMaxWorkload(member.maxWorkload);
        setEditOpen(true);
    };

    const handleSaveEdit = () => {
        if (!id) return;
        const payload: UpdateStaffDto = {
            staffType: editStaffType,
            maxWorkload: editMaxWorkload,
            department: editDepartment || undefined,
        };
        updateStaff.mutate({ id, data: payload }, {
            onSuccess: () => setEditOpen(false),
        });
    };

    const handleDelete = () => {
        if (!id) return;
        deleteStaff.mutate(id, {
            onSuccess: () => navigate("/staff"),
        });
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const getWorkloadColor = (pct: number) => {
        if (pct >= 80) return "text-destructive [&>div]:bg-destructive";
        if (pct >= 50) return "[&>div]:bg-warning";
        return "[&>div]:bg-success";
    };

    const workloadStats = workload
        ? [
            { label: "Active Leads", value: workload.activeLeads, icon: Users, color: "bg-primary/5 text-primary" },
            { label: "Open Tasks", value: workload.openTasks, icon: CheckSquare, color: "bg-warning/5 text-warning" },
            { label: "Queue Load", value: workload.queueLoad, icon: List, color: "bg-info/5 text-info" },
            { label: "Follow Ups", value: workload.pendingFollowUps, icon: Phone, color: "bg-success/5 text-success" },
            { label: "Calls Today", value: workload.todayCalls, icon: Activity, color: "bg-muted text-muted-foreground" },
            { label: "Meetings Today", value: workload.todayMeetings, icon: Calendar, color: "bg-muted text-muted-foreground" },
        ]
        : [];

    if (isLoading) {
        return (
            <DashboardLayout title="Staff Profile" subtitle="Loading...">
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError || !member) {
        return (
            <DashboardLayout title="Staff Profile" subtitle="Not found">
                <div className="py-12 text-center">
                    <p className="text-destructive">Failed to load staff member.</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/staff")}>
                        Back to Staff
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title={member.user?.name || "Staff Member"}
            subtitle={member.user?.email || ""}
            action={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={openEditDialog}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("/staff")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
            }
        >
            <div className="grid gap-6 md:grid-cols-3 mb-6">
                {/* Profile card */}
                <Card className="shadow-card md:col-span-1">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user?.name || member.id}`}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                    {getInitials(member.user?.name || "Staff")}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold">{member.user?.name}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    variant="outline"
                                    className={staffTypeColors[member.staffType] || staffTypeColors.Other}
                                >
                                    {staffTypeDisplay[member.staffType] || member.staffType}
                                </Badge>
                            </div>
                            <div className="mt-3">
                                <StaffStatusBadge status={member.status} />
                            </div>
                            {member.department && (
                                <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded px-2 py-1">
                                    {member.department}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 mt-6">
                            {member.user?.email && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{member.user.email}</span>
                                </div>
                            )}
                            {member.user?.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    {member.user.phone}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                Joined{" "}
                                {new Date(member.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                            <label className="text-sm font-medium mb-2 block">Update Status</label>
                            <StaffStatusSelect
                                value={member.status}
                                onChange={(status) => updateStatus.mutate({ id: member.id, status })}
                                disabled={updateStatus.isPending}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Workload card */}
                <Card className="shadow-card md:col-span-2">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Workload
                            </CardTitle>
                            {workload && (
                                <span className="text-sm text-muted-foreground">
                                    Max: {workload.maxWorkload}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {workload ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {workloadStats.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.label}
                                                className="rounded-lg bg-muted/40 p-4 flex items-center gap-3"
                                            >
                                                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.color)}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold">{item.value}</p>
                                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Overall Workload</span>
                                        <span className={cn(
                                            "text-sm font-semibold",
                                            workload.workloadPercentage >= 80 ? "text-destructive" :
                                            workload.workloadPercentage >= 50 ? "text-warning" : "text-success"
                                        )}>
                                            {workload.workloadPercentage}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={workload.workloadPercentage}
                                        className={cn("h-3", getWorkloadColor(workload.workloadPercentage))}
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {workload.currentWorkload} / {workload.maxWorkload} workload units
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground py-4">No workload data available</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Edit Staff Profile</DialogTitle>
                        <DialogDescription>
                            Update {member.user?.name}'s profile settings.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Staff Type</Label>
                            <Select
                                value={editStaffType}
                                onValueChange={(v) => setEditStaffType(v as StaffType)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Counselor">Counselor</SelectItem>
                                    <SelectItem value="AdmissionOfficer">Admission Officer</SelectItem>
                                    <SelectItem value="VisaOfficer">Visa Officer</SelectItem>
                                    <SelectItem value="DocumentationOfficer">Documentation Officer</SelectItem>
                                    <SelectItem value="FinanceOfficer">Finance Officer</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Department <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Input
                                placeholder="e.g. International Admissions"
                                value={editDepartment}
                                onChange={(e) => setEditDepartment(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Workload <span className="text-xs text-muted-foreground">(1–500)</span></Label>
                            <Input
                                type="number"
                                min={1}
                                max={500}
                                value={editMaxWorkload}
                                onChange={(e) => setEditMaxWorkload(Number(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">
                                The maximum combined workload units before this staff member is considered overloaded.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={updateStaff.isPending}>
                            {updateStaff.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Staff Profile</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {member.user?.name}'s staff profile? This action
                            cannot be undone. Their workload data and queue assignments will also be removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
                            disabled={deleteStaff.isPending}
                        >
                            {deleteStaff.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                            ) : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
};

export default StaffDetail;
