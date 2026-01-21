import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, Shield, Check, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Role, Permission } from "@/services/user.service";
import { cn } from "@/lib/utils";

interface PermissionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
    permissions: Permission[];
    initialSelectedPermissions: string[];
    isLoading: boolean;
    isSubmitting: boolean;
    onSave: (roleId: string, permissionIds: string[]) => Promise<void>;
}

export function PermissionsDialog({
    open,
    onOpenChange,
    role,
    permissions,
    initialSelectedPermissions,
    isLoading,
    isSubmitting,
    onSave,
}: PermissionsDialogProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeModule, setActiveModule] = useState<string | "all">("all");
    const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());

    // Reset state when dialog opens or role changes
    useEffect(() => {
        if (open) {
            setSelectedPermissions(initialSelectedPermissions);
            setSearchQuery("");
            setActiveModule("all");
        }
    }, [open, initialSelectedPermissions]);

    // Group permissions by module
    const groupedPermissions = useMemo(() => {
        return permissions.reduce((acc, perm) => {
            const module = perm.module || "Other";
            if (!acc[module]) acc[module] = [];
            acc[module].push(perm);
            return acc;
        }, {} as Record<string, Permission[]>);
    }, [permissions]);

    // Filter permissions based on search query and active module
    const filteredGroups = useMemo(() => {
        const query = searchQuery.toLowerCase();
        const result: Record<string, Permission[]> = {};

        Object.entries(groupedPermissions).forEach(([module, perms]) => {
            // Skip if module filter is active but doesn't match
            if (activeModule !== "all" && module !== activeModule) return;

            const filteredPerms = perms.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    (p.description && p.description.toLowerCase().includes(query)) ||
                    module.toLowerCase().includes(query)
            );

            if (filteredPerms.length > 0) {
                result[module] = filteredPerms;
            }
        });

        return result;
    }, [groupedPermissions, searchQuery, activeModule]);

    // Calculate stats
    const totalPermissions = permissions.length;
    const selectedCount = selectedPermissions.length;
    const modules = Object.keys(groupedPermissions).sort();

    const togglePermission = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const toggleModule = (module: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent collapsing when clicking select all
        const modulePermissions = groupedPermissions[module] || [];
        const modulePermissionIds = modulePermissions.map((p) => p.id);

        const allSelected = modulePermissionIds.every((id) =>
            selectedPermissions.includes(id)
        );

        if (allSelected) {
            // Deselect all for this module
            setSelectedPermissions((prev) =>
                prev.filter((id) => !modulePermissionIds.includes(id))
            );
        } else {
            // Select all for this module
            setSelectedPermissions((prev) => {
                const unique = new Set([...prev, ...modulePermissionIds]);
                return Array.from(unique);
            });
        }
    };

    const toggleCollapse = (module: string) => {
        setCollapsedModules(prev => {
            const next = new Set(prev);
            if (next.has(module)) {
                next.delete(module);
            } else {
                next.add(module);
            }
            return next;
        });
    };

    const handleSave = async () => {
        if (role) {
            await onSave(role.id, selectedPermissions);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
                {/* Header Section */}
                <div className="bg-muted/40 p-6 border-b">
                    <DialogHeader className="mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-semibold">Manage Permissions</DialogTitle>
                                    <DialogDescription className="text-primary/80 font-medium">
                                        {role?.name || "Loading..."} Role
                                    </DialogDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="px-3 py-1 h-8 text-sm gap-2">
                                <Check className="h-3.5 w-3.5 text-primary" />
                                <span className="font-semibold text-primary">{selectedCount}</span> of {totalPermissions} selected
                            </Badge>
                        </div>
                    </DialogHeader>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search permissions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-background focus-visible:ring-primary/20"
                            />
                        </div>
                        {/* Simple Module Filter using Select could go here if needed, or horizontal scroll list */}
                    </div>
                </div>

                {/* Content Area */}
                <ScrollArea className="flex-1 bg-background/50">
                    <div className="p-6 space-y-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p>Loading permissions data...</p>
                            </div>
                        ) : Object.keys(filteredGroups).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Filter className="h-6 w-6" />
                                </div>
                                <p className="font-medium">No permissions found</p>
                                <p className="text-sm">Try using different search terms</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearchQuery(""); setActiveModule("all"); }}
                                    className="text-primary"
                                >
                                    Clear filters
                                </Button>
                            </div>
                        ) : (
                            Object.entries(filteredGroups).sort().map(([module, perms]) => {
                                const moduleIds = perms.map(p => p.id);
                                const isAllSelected = moduleIds.every(id => selectedPermissions.includes(id));
                                const isIndeterminate = moduleIds.some(id => selectedPermissions.includes(id)) && !isAllSelected;

                                return (
                                    <div key={module} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div
                                            className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors px-2 rounded-t-lg select-none"
                                            onClick={() => toggleCollapse(module)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {collapsedModules.has(module) ? (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-bold">
                                                    {module}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {perms.length} permissions
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-8 text-xs font-medium",
                                                    isAllSelected ? "text-primary hover:text-primary/80" : "text-muted-foreground"
                                                )}
                                                onClick={(e) => toggleModule(module, e)}
                                            >
                                                {isAllSelected ? "Deselect All" : "Select All"}
                                            </Button>
                                        </div>

                                        {!collapsedModules.has(module) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
                                                {perms.map((permission) => {
                                                    const isSelected = selectedPermissions.includes(permission.id);
                                                    return (
                                                        <div
                                                            key={permission.id}
                                                            className={cn(
                                                                "flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group cursor-pointer",
                                                                isSelected
                                                                    ? "border-primary/50 bg-primary/5 shadow-sm"
                                                                    : "border-border hover:border-primary/20 hover:bg-muted/30"
                                                            )}
                                                            onClick={() => togglePermission(permission.id)}
                                                        >
                                                            <div className="space-y-1 pr-4">
                                                                <p className={cn(
                                                                    "font-medium text-sm leading-none group-hover:text-primary transition-colors",
                                                                    isSelected ? "text-primary" : "text-foreground"
                                                                )}>
                                                                    {permission.description || permission.name}
                                                                </p>
                                                            </div>
                                                            <Switch
                                                                checked={isSelected}
                                                                onCheckedChange={() => togglePermission(permission.id)}
                                                                className="data-[state=checked]:bg-primary h-5 w-9"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>

                {/* Footer */}
                <DialogFooter className="p-6 border-t bg-background">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedPermissions([])}
                                disabled={selectedPermissions.length === 0 || isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSubmitting || isLoading}
                                className="min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
