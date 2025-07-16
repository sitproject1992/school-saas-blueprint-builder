import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Save,
  RefreshCw,
  Users,
  UserPlus,
  UserMinus,
  Shield,
  Settings,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}

interface UserManagementSettingsData {
  defaultRole: string;
  autoAssignRoles: boolean;
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  maxUsersPerSchool: number;
  userInactivityThreshold: number;
  bulkOperationsEnabled: boolean;
  csvImportEnabled: boolean;
}

interface UserManagementSettingsProps {
  onSave?: (data: UserManagementSettingsData) => Promise<void>;
}

export function UserManagementSettings({
  onSave,
}: UserManagementSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("settings");

  const [settings, setSettings] = useState<UserManagementSettingsData>({
    defaultRole: "student",
    autoAssignRoles: true,
    allowSelfRegistration: false,
    requireEmailVerification: true,
    maxUsersPerSchool: 1000,
    userInactivityThreshold: 90,
    bulkOperationsEnabled: true,
    csvImportEnabled: true,
  });

  const [roles] = useState<UserRole[]>([
    {
      id: "super_admin",
      name: "Super Admin",
      description: "Full system access and control",
      permissions: ["*"],
      isSystem: true,
      userCount: 1,
    },
    {
      id: "school_admin",
      name: "School Admin",
      description: "Full access to school management",
      permissions: [
        "school.manage",
        "users.manage",
        "classes.manage",
        "reports.view",
      ],
      isSystem: true,
      userCount: 45,
    },
    {
      id: "teacher",
      name: "Teacher",
      description: "Access to classes and student management",
      permissions: [
        "classes.manage",
        "students.view",
        "grades.manage",
        "attendance.manage",
      ],
      isSystem: true,
      userCount: 234,
    },
    {
      id: "student",
      name: "Student",
      description: "Access to personal academic information",
      permissions: [
        "profile.view",
        "grades.view",
        "schedule.view",
        "assignments.view",
      ],
      isSystem: true,
      userCount: 1567,
    },
    {
      id: "parent",
      name: "Parent",
      description: "Access to children's academic information",
      permissions: [
        "children.view",
        "grades.view",
        "attendance.view",
        "communication.manage",
      ],
      isSystem: true,
      userCount: 890,
    },
    {
      id: "librarian",
      name: "Librarian",
      description: "Library management and book tracking",
      permissions: ["library.manage", "books.manage", "students.view"],
      isSystem: false,
      userCount: 12,
    },
    {
      id: "accountant",
      name: "Accountant",
      description: "Financial management and fee collection",
      permissions: ["finance.manage", "fees.manage", "reports.financial"],
      isSystem: false,
      userCount: 8,
    },
  ]);

  const allPermissions = [
    "school.manage",
    "users.manage",
    "classes.manage",
    "students.view",
    "students.manage",
    "teachers.view",
    "teachers.manage",
    "grades.view",
    "grades.manage",
    "attendance.view",
    "attendance.manage",
    "reports.view",
    "reports.financial",
    "finance.manage",
    "fees.manage",
    "library.manage",
    "books.manage",
    "communication.manage",
    "profile.view",
    "schedule.view",
    "assignments.view",
    "children.view",
  ];

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(settings);
      }
      toast.success("User management settings saved successfully");
    } catch (error) {
      console.error("Error saving user management settings:", error);
      toast.error("Failed to save user management settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      defaultRole: "student",
      autoAssignRoles: true,
      allowSelfRegistration: false,
      requireEmailVerification: true,
      maxUsersPerSchool: 1000,
      userInactivityThreshold: 90,
      bulkOperationsEnabled: true,
      csvImportEnabled: true,
    });
    toast.success("User management settings reset to defaults");
  };

  const updateSetting = (key: keyof UserManagementSettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getRoleBadgeVariant = (
    role: UserRole,
  ): "default" | "secondary" | "outline" => {
    if (role.id === "super_admin") return "default";
    if (role.isSystem) return "secondary";
    return "outline";
  };

  const handleCreateRole = () => {
    toast.success("Create role functionality would be implemented here");
  };

  const handleEditRole = (roleId: string) => {
    toast.success(
      `Edit role ${roleId} functionality would be implemented here`,
    );
  };

  const handleDeleteRole = (roleId: string) => {
    if (roles.find((r) => r.id === roleId)?.isSystem) {
      toast.error("Cannot delete system roles");
      return;
    }
    toast.success(
      `Delete role ${roleId} functionality would be implemented here`,
    );
  };

  const handleToggleRole = (roleId: string) => {
    toast.success(
      `Toggle role ${roleId} functionality would be implemented here`,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          User Management
        </h2>
        <p className="text-gray-600">
          Configure user roles, permissions, and management settings
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Default User Settings
                </CardTitle>
                <CardDescription>
                  Configure default behavior for new users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultRole">
                    Default Role for New Users
                  </Label>
                  <Select
                    value={settings.defaultRole}
                    onValueChange={(value) =>
                      updateSetting("defaultRole", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles
                        .filter((role) => role.id !== "super_admin")
                        .map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-assign Roles</Label>
                    <p className="text-sm text-gray-500">
                      Automatically assign roles based on email domain
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoAssignRoles}
                    onCheckedChange={(checked) =>
                      updateSetting("autoAssignRoles", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Self Registration</Label>
                    <p className="text-sm text-gray-500">
                      Allow users to create their own accounts
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowSelfRegistration}
                    onCheckedChange={(checked) =>
                      updateSetting("allowSelfRegistration", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-gray-500">
                      Users must verify email before access
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      updateSetting("requireEmailVerification", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Limits and Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle>Limits and Thresholds</CardTitle>
                <CardDescription>
                  Configure user limits and activity thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxUsersPerSchool">
                    Max Users Per School
                  </Label>
                  <Input
                    id="maxUsersPerSchool"
                    type="number"
                    min="10"
                    max="10000"
                    value={settings.maxUsersPerSchool}
                    onChange={(e) =>
                      updateSetting(
                        "maxUsersPerSchool",
                        parseInt(e.target.value) || 1000,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userInactivityThreshold">
                    User Inactivity Threshold (days)
                  </Label>
                  <Input
                    id="userInactivityThreshold"
                    type="number"
                    min="30"
                    max="365"
                    value={settings.userInactivityThreshold}
                    onChange={(e) =>
                      updateSetting(
                        "userInactivityThreshold",
                        parseInt(e.target.value) || 90,
                      )
                    }
                  />
                  <p className="text-sm text-gray-500">
                    Mark users as inactive after this many days without login
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bulk Operations</Label>
                    <p className="text-sm text-gray-500">
                      Enable bulk user operations
                    </p>
                  </div>
                  <Switch
                    checked={settings.bulkOperationsEnabled}
                    onCheckedChange={(checked) =>
                      updateSetting("bulkOperationsEnabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>CSV Import</Label>
                    <p className="text-sm text-gray-500">
                      Allow importing users from CSV files
                    </p>
                  </div>
                  <Switch
                    checked={settings.csvImportEnabled}
                    onCheckedChange={(checked) =>
                      updateSetting("csvImportEnabled", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>
                    Manage user roles and their permissions
                  </CardDescription>
                </div>
                <Button onClick={handleCreateRole}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <p className="text-sm text-gray-600">
                            {role.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(role)}>
                          {role.isSystem ? "System" : "Custom"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{role.userCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="text-xs"
                            >
                              {permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditRole(role.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleRole(role.id)}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Manage Permissions
                            </DropdownMenuItem>
                            {!role.isSystem && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Role
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>
                  Import users from CSV files or external systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!settings.csvImportEnabled}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Import Users from CSV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Import from External System
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Import Templates
                </Button>
                {!settings.csvImportEnabled && (
                  <p className="text-sm text-gray-500">
                    CSV import is disabled in settings
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Operations</CardTitle>
                <CardDescription>
                  Perform operations on multiple users simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!settings.bulkOperationsEnabled}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Bulk Activate/Deactivate
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!settings.bulkOperationsEnabled}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Bulk Role Assignment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!settings.bulkOperationsEnabled}
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Bulk Delete Inactive Users
                </Button>
                {!settings.bulkOperationsEnabled && (
                  <p className="text-sm text-gray-500">
                    Bulk operations are disabled in settings
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>
                Overview of user distribution across roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-gray-900">
                      {role.userCount}
                    </div>
                    <div className="text-sm text-gray-600">{role.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
