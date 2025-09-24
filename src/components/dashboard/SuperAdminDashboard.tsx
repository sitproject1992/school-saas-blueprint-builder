import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  School,
  Settings,
  Search,
  MoreHorizontal,
  UserPlus,
  Building,
  Eye,
  Edit,
  Trash2,
  Key,
  Activity,
  Lock,
  Unlock,
  Plus,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolAdmin } from "@/hooks/useSchoolAdmin";
import { useSchoolManagement } from "@/hooks/useSchoolManagement";
import type { SchoolAdmin } from "@/hooks/useSchoolAdmin";
import { toast } from "sonner";
import { SchoolAdminForm } from "@/components/admin/SchoolAdminForm";
import { SchoolForm } from "@/components/admin/SchoolForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { UserManagementSettings } from "@/components/settings/UserManagementSettings";
import { SystemMaintenance } from "@/components/settings/SystemMaintenance";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { BulkStudentImport } from "@/components/admin/BulkStudentImport";
import { useNavigate } from "react-router-dom";

interface SchoolAdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  schoolId: string;
  password: string;
  confirmPassword: string;
  mustChangePassword: boolean;
  sendWelcomeEmail: boolean;
}

interface SchoolFormData {
  name: string;
  subdomain: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  subscriptionStatus: string;
  subscriptionExpiresAt?: string;
  themeColor?: string;
  description?: string;
  maxStudents?: number;
  maxTeachers?: number;
  features?: string[];
}

export function SuperAdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    schoolAdmins,
    loading: adminLoading,
    error: adminError,
    createSchoolAdmin,
    deleteSchoolAdmin,
    toggleSchoolAdminStatus,
    resetSchoolAdminPassword,
    updateSchoolAdmin,
  } = useSchoolAdmin();

  const {
    schools,
    auditLogs,
    loading: schoolLoading,
    error: schoolError,
    createSchool,
    updateSchool,
    deleteSchool,
    toggleSchoolStatus,
    getSchoolStatistics,
    testDatabaseConnection,
  } = useSchoolManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const [editingAdmin, setEditingAdmin] = useState<SchoolAdmin | null>(null);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    type: "admin" | "school";
    id: string;
    name: string;
  } | null>(null);

  const loading = adminLoading || schoolLoading;
  const error = adminError || schoolError;

  const stats = getSchoolStatistics();

  const filteredSchoolAdmins = schoolAdmins.filter(
    (admin) =>
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.schoolName &&
        admin.schoolName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school.email &&
        school.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const recentAuditLogs = auditLogs.slice(0, 10);

  // Admin management functions
  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setShowAdminForm(true);
  };

  const handleEditAdmin = (admin: SchoolAdmin) => {
    setEditingAdmin(admin);
    setShowAdminForm(true);
  };

  const handleDeleteAdmin = (adminId: string, adminName: string) => {
    setDeleteDialog({
      type: "admin",
      id: adminId,
      name: adminName,
    });
  };

  const handleToggleAdminStatus = async (
    adminId: string,
    isActive: boolean,
  ) => {
    try {
      await toggleSchoolAdminStatus(adminId, isActive);
      toast.success(
        `Administrator ${isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      toast.error("Failed to update administrator status");
    }
  };

  const handleResetPassword = async (adminId: string) => {
    const newPassword = prompt("Enter new password for the administrator:");
    if (newPassword && newPassword.length >= 8) {
      try {
        await resetSchoolAdminPassword(adminId, newPassword);
        toast.success("Password reset successfully");
      } catch (error) {
        toast.error("Failed to reset password");
      }
    } else if (newPassword) {
      toast.error("Password must be at least 8 characters long");
    }
  };

  const handleAdminFormSubmit = async (data: SchoolAdminFormData) => {
    try {
      if (editingAdmin) {
        await updateSchoolAdmin(editingAdmin.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });
        toast.success("School admin updated successfully");
      } else {
        await createSchoolAdmin({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          schoolId: data.schoolId,
          password: data.password,
          mustChangePassword: data.mustChangePassword,
          sendWelcomeEmail: data.sendWelcomeEmail,
        });
        toast.success("School admin created successfully");
      }
      setShowAdminForm(false);
      setEditingAdmin(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save school admin");
    }
  };

  // School management functions
  const handleAddSchool = () => {
    setEditingSchool(null);
    setShowSchoolForm(true);
  };

  const handleEditSchool = (school: any) => {
    setEditingSchool(school);
    setShowSchoolForm(true);
  };

  const handleDeleteSchool = (schoolId: string, schoolName: string) => {
    setDeleteDialog({
      type: "school",
      id: schoolId,
      name: schoolName,
    });
  };

  const handleToggleSchoolStatus = async (
    schoolId: string,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await toggleSchoolStatus(schoolId, newStatus);
      toast.success(
        `School ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      toast.error("Failed to update school status");
    }
  };

  const handleSchoolFormSubmit = async (data: any) => {
    try {
      if (editingSchool) {
        await updateSchool(editingSchool.id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          website: data.website,
          subscriptionStatus: data.subscriptionStatus,
          subscriptionExpiresAt: data.subscriptionExpiresAt,
          themeColor: data.themeColor,
        });
        toast.success("School updated successfully");
      } else {
        await createSchool(data);
        toast.success("School created successfully");
      }
      setShowSchoolForm(false);
      setEditingSchool(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save school");
    }
  };

  // Delete confirmation
  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;

    try {
      if (deleteDialog.type === "admin") {
        await deleteSchoolAdmin(deleteDialog.id);
        toast.success("Administrator deleted successfully");
      } else {
        await deleteSchool(deleteDialog.id);
        toast.success("School deleted successfully");
      }
    } catch (error) {
      toast.error(`Failed to delete ${deleteDialog.type}`);
    } finally {
      setDeleteDialog(null);
    }
  };

  // Database test function
  const handleTestDatabase = async () => {
    try {
      const isConnected = await testDatabaseConnection();
      if (isConnected) {
        toast.success("Database connection successful!");
      } else {
        toast.error("Database connection failed. Check console for details.");
      }
    } catch (error) {
      toast.error("Database test failed. Check console for details.");
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSubscriptionBadge = (status: string) => {
    const variants: {
      [key: string]: "default" | "secondary" | "destructive" | "outline";
    } = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getActionBadge = (action: string) => {
    const colorMap: { [key: string]: string } = {
      CREATE_SCHOOL: "bg-green-100 text-green-800",
      UPDATE_SCHOOL: "bg-blue-100 text-blue-800",
      DELETE_SCHOOL: "bg-red-100 text-red-800",
      CREATE_SCHOOL_ADMIN: "bg-green-100 text-green-800",
      UPDATE_PASSWORD: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Badge
        variant="outline"
        className={colorMap[action] || "bg-gray-100 text-gray-800"}
      >
        {action.replace(/_/g, " ").toLowerCase()}
      </Badge>
    );
  };

  if (loading && schools.length === 0 && schoolAdmins.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.profile?.first_name || "Super Admin"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddAdmin}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add School Admin
            </Button>
            <Button variant="outline" onClick={handleAddSchool}>
              <Building className="h-4 w-4 mr-2" />
              Add School
            </Button>
            <Button variant="outline" onClick={handleTestDatabase}>
              <Activity className="h-4 w-4 mr-2" />
              Test Database
            </Button>
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Schools
              </CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSchools}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeSchools} active, {stats.inactiveSchools} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                School Admins
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
              <p className="text-xs text-muted-foreground">
                {schoolAdmins.filter((a) => a.isActive).length} active accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all schools
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="admins">School Admins</TabsTrigger>
            <TabsTrigger value="import">Bulk Import</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system activities and changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAuditLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Activity className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getActionBadge(log.action)}
                            <span className="text-sm font-medium">
                              {log.details?.name || log.targetId}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {formatDateTime(log.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current system health and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          All systems operational
                        </p>
                        <p className="text-xs text-green-600">
                          {stats.activeSchools} schools running smoothly
                        </p>
                      </div>
                    </div>

                    {stats.suspendedSchools > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800">
                            {stats.suspendedSchools} school
                            {stats.suspendedSchools > 1 ? "s" : ""} suspended
                          </p>
                          <p className="text-xs text-yellow-600">
                            Requires attention
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Schools Management</CardTitle>
                    <CardDescription>
                      Manage schools and their subscriptions
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddSchool}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add School
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search schools..."
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
                      <TableHead>School</TableHead>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Admins</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{school.name}</p>
                            <p className="text-sm text-gray-600">
                              {school.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {school.subdomain}.skooler.com
                          </code>
                        </TableCell>
                        <TableCell>
                          {getSubscriptionBadge(school.subscriptionStatus)}
                        </TableCell>
                        <TableCell>{school.studentCount || 0}</TableCell>
                        <TableCell>{school.teacherCount || 0}</TableCell>
                        <TableCell>{school.adminCount || 0}</TableCell>
                        <TableCell>{formatDate(school.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditSchool(school)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit School
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleSchoolStatus(
                                    school.id,
                                    school.subscriptionStatus,
                                  )
                                }
                              >
                                {school.subscriptionStatus === "active" ? (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteSchool(school.id, school.name)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
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

          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>School Administrators</CardTitle>
                    <CardDescription>
                      Manage school admin accounts and permissions
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddAdmin}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search admins..."
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
                      <TableHead>Admin</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchoolAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {admin.firstName} {admin.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {admin.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {admin.schoolName || "Unknown School"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={admin.isActive ? "default" : "secondary"}
                            >
                              {admin.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {admin.mustChangePassword && (
                              <Badge variant="outline" className="text-xs">
                                Must change password
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(admin.lastLogin)}</TableCell>
                        <TableCell>{formatDate(admin.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditAdmin(admin)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleResetPassword(admin.id)}
                              >
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggleAdminStatus(
                                    admin.id,
                                    !admin.isActive,
                                  )
                                }
                              >
                                {admin.isActive ? (
                                  <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteAdmin(
                                    admin.id,
                                    `${admin.firstName} ${admin.lastName}`,
                                  )
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
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

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Student Import</CardTitle>
                <CardDescription>
                  Import students in bulk for any school using CSV files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="school-select">Select School</Label>
                    <select
                      id="school-select"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      defaultValue=""
                    >
                      <option value="" disabled>Choose a school...</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {schools.length > 0 && (
                    <BulkStudentImport />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  System activity and change tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Date/Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.targetType}</p>
                            <p className="text-sm text-gray-600">
                              {log.targetId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {log.details?.name && (
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {log.details.name}
                              </p>
                            )}
                            {log.details?.email && (
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {log.details.email}
                              </p>
                            )}
                            {log.details?.subdomain && (
                              <p>
                                <span className="font-medium">Subdomain:</span>{" "}
                                {log.details.subdomain}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Tabs
              value={activeSettingsTab}
              onValueChange={setActiveSettingsTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <GeneralSettings />
              </TabsContent>

              <TabsContent value="security">
                <SecuritySettings />
              </TabsContent>

              <TabsContent value="users">
                <UserManagementSettings />
              </TabsContent>

              <TabsContent value="maintenance">
                <SystemMaintenance />
              </TabsContent>

              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <SchoolAdminForm
        open={showAdminForm}
        onOpenChange={setShowAdminForm}
        onSubmit={handleAdminFormSubmit}
        schools={schools}
        editData={
          editingAdmin
            ? {
                id: editingAdmin.id,
                firstName: editingAdmin.firstName,
                lastName: editingAdmin.lastName,
                email: editingAdmin.email,
                phone: editingAdmin.phone,
                schoolId: editingAdmin.schoolId,
                mustChangePassword: editingAdmin.mustChangePassword,
              }
            : undefined
        }
      />

      <SchoolForm
        open={showSchoolForm}
        onOpenChange={setShowSchoolForm}
        onSubmit={handleSchoolFormSubmit}
        editData={editingSchool}
      />

      <ChangePasswordForm
        open={showPasswordForm}
        onOpenChange={setShowPasswordForm}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialog}
        onOpenChange={() => setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteDialog?.type} "
              {deleteDialog?.name}"? This action cannot be undone and will
              remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
