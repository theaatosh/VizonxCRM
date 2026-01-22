import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Shield, Bell, Palette, Users, Trash2, UserPlus, Loader2, Eye, EyeOff, Edit, Key, ShieldCheck, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import userService, { User as UserType, Role, CreateUserDto, UpdateUserDto, Permission, CreateRoleDto } from "@/services/user.service";
import { PermissionsDialog } from "@/components/settings/PermissionsDialog";

const Settings = () => {
  const { toast } = useToast();

  // Team state
  const [users, setUsers] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Roles state
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Form state for adding a new user
  const [newUser, setNewUser] = useState<CreateUserDto>({
    name: "",
    email: "",
    password: "",
    roleId: "",
    status: "Active",
  });

  // Form state for editing a user
  const [editUser, setEditUser] = useState<UpdateUserDto>({
    name: "",
    email: "",
    roleId: "",
    status: "Active",
  });

  // Form state for adding a new role
  const [newRole, setNewRole] = useState<CreateRoleDto>({
    name: "",
    description: "",
  });

  // Fetch users, roles and permissions on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
        userService.getAllUsers({ limit: 50 }),
        userService.getAllRoles(),
        userService.getAllPermissions(),
      ]);
      setUsers(usersResponse.data || []);
      setRoles(rolesResponse || []);
      setPermissions(permissionsResponse || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.roleId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.createUser(newUser);
      toast({
        title: "Success",
        description: "Team member added successfully.",
      });
      setIsAddDialogOpen(false);
      setNewUser({ name: "", email: "", password: "", roleId: "", status: "Active" });
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to add team member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await userService.updateUser(selectedUser.id, editUser);
      toast({
        title: "Success",
        description: "Team member updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update team member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await userService.deleteUser(selectedUser.id);
      toast({
        title: "Success",
        description: "Team member removed successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to remove team member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Role name is required.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.createRole(newRole);
      toast({
        title: "Success",
        description: "Role created successfully.",
      });
      setIsAddRoleDialogOpen(false);
      setNewRole({ name: "", description: "" });
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to create role.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignPermissions = async (roleId: string, permissionIds: string[]) => {
    setIsSubmitting(true);
    try {
      // Use updateRolePermissions to replace all permissions with the selected ones
      await userService.updateRolePermissions(roleId, { permissionIds });
      toast({
        title: "Success",
        description: "Permissions updated successfully.",
      });
      setIsPermissionsDialogOpen(false);
      setSelectedRole(null);
      setSelectedPermissions([]);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update permissions.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (user: UserType) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openPermissionsDialog = async (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions([]);
    setIsPermissionsDialogOpen(true);

    // Fetch existing permissions for this role
    setIsLoadingPermissions(true);
    try {
      const rolePerms = await userService.getRolePermissions(role.id);
      if (rolePerms.permissions && rolePerms.permissions.length > 0) {
        setSelectedPermissions(rolePerms.permissions.map(p => p.id));
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      // Continue without pre-selected permissions
    } finally {
      setIsLoadingPermissions(false);
    }
  };



  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.name || "Unknown";
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your CRM preferences">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-[720px]">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">AD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@eduvisa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 234 567 890" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team and their access levels</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <UserPlus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Create a new team member account. They will receive login credentials.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-name">Full Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="new-name"
                          placeholder="John Doe"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email <span className="text-destructive">*</span></Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="john@company.com"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password <span className="text-destructive">*</span></Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-role">Role <span className="text-destructive">*</span></Label>
                        <Select
                          value={newUser.roleId}
                          onValueChange={(value) => setNewUser({ ...newUser, roleId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-status">Status</Label>
                        <Select
                          value={newUser.status}
                          onValueChange={(value: "Active" | "Inactive") => setNewUser({ ...newUser, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUser} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Member"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-1">No team members yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first team member to get started.</p>
                  <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={member.status === "Active" ? "default" : "secondary"}
                          className={member.status === "Active" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : ""}
                        >
                          {member.status}
                        </Badge>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {member.roleName || getRoleName(member.roleId)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => openDeleteDialog(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Edit Team Member</DialogTitle>
                <DialogDescription>
                  Update member information and access level.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editUser.roleId}
                    onValueChange={(value) => setEditUser({ ...editUser, roleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editUser.status}
                    onValueChange={(value: "Active" | "Inactive") => setEditUser({ ...editUser, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditUser} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove <strong>{selectedUser?.name}</strong> from the team?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Define roles and manage access permissions</CardDescription>
                </div>
                <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Define a new role that can be assigned to team members.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="role-name">Role Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="role-name"
                          placeholder="e.g., Counsellor, Manager"
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role-description">Description</Label>
                        <Textarea
                          id="role-description"
                          placeholder="Brief description of this role's responsibilities..."
                          value={newRole.description}
                          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddRole} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Role"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : roles.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-1">No roles defined</h3>
                  <p className="text-muted-foreground mb-4">Create your first role to manage access permissions.</p>
                  <Button onClick={() => setIsAddRoleDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Role
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {role.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-muted">
                          {users.filter((u) => u.roleId === role.id).length} members
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => openPermissionsDialog(role)}
                        >
                          <Key className="h-4 w-4" />
                          Permissions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissions Dialog */}
          <PermissionsDialog
            open={isPermissionsDialogOpen}
            onOpenChange={setIsPermissionsDialogOpen}
            role={selectedRole}
            permissions={permissions}
            initialSelectedPermissions={selectedPermissions}
            isLoading={isLoadingPermissions}
            isSubmitting={isSubmitting}
            onSave={handleAssignPermissions}
          />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: "New Lead Alerts", description: "Get notified when a new lead is created" },
                { title: "Visa Status Updates", description: "Receive updates on visa application status changes" },
                { title: "Task Reminders", description: "Get reminders for upcoming task deadlines" },
                { title: "Appointment Notifications", description: "Alerts for scheduled appointments" },
                { title: "Weekly Reports", description: "Receive weekly summary reports via email" },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Sidebar Labels</p>
                  <p className="text-sm text-muted-foreground">Display text labels in sidebar</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
