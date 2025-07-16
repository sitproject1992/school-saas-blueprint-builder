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
  Plus,
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolAdmin, SchoolAdmin, School } from "@/hooks/useSchoolAdmin";
import { toast } from "sonner";
import { SchoolAdminForm } from "@/components/admin/SchoolAdminForm";

interface SuperAdminDashboardProps {
  onAddAdmin?: () => void;
}

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

export function SuperAdminDashboard({
  onAddAdmin,
}: SuperAdminDashboardProps = {}) {
  const { user } = useAuth();
  const {
    schoolAdmins,
    schools,
    loading,
    error,
    createSchoolAdmin,
    deleteSchoolAdmin,
    toggleSchoolAdminStatus,
    resetSchoolAdminPassword,
    updateSchoolAdmin,
  } = useSchoolAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<SchoolAdmin | null>(null);

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

  const stats = {
    totalSchools: schools.length,
    totalAdmins: schoolAdmins.length,
    activeSchools: schools.filter((s) => s.subscriptionStatus === "active")
      .length,
    totalStudents: 0, // This would need to be calculated from actual student data
  };

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setShowAdminForm(true);
    onAddAdmin?.();
  };

  const handleEditAdmin = (admin: SchoolAdmin) => {
    setEditingAdmin(admin);
    setShowAdminForm(true);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm("Are you sure you want to delete this administrator?")) {
      try {
        await deleteSchoolAdmin(adminId);
        toast.success("School administrator deleted successfully");
      } catch (error) {
        toast.error("Failed to delete administrator");
      }
    }
  };

  const handleToggleStatus = async (adminId: string, isActive: boolean) => {
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
    if (newPassword) {
      try {
        await resetSchoolAdminPassword(adminId, newPassword);
        toast.success("Password reset successfully");
      } catch (error) {
        toast.error("Failed to reset password");
      }
    }
  };

  const handleFormSubmit = async (data: SchoolAdminFormData) => {
    if (editingAdmin) {
      // Update existing admin
      await updateSchoolAdmin(editingAdmin.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
    } else {
      // Create new admin
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
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
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
              Welcome back, {user?.profile?.firstName || "Super Admin"}
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
            <Button variant="outline">
              <Building className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
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
                {stats.activeSchools} active subscriptions
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
              <Users className="h-4 w-4 text-muted-foreground" />
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admins">School Admins</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest admin actions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schoolAdmins.slice(0, 3).map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <UserPlus className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {admin.firstName} {admin.lastName} added
                          </p>
                          <p className="text-xs text-gray-600">
                            {admin.email} - {formatDate(admin.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>
                    Important notifications and warnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Shield className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          All systems operational
                        </p>
                        <p className="text-xs text-green-600">
                          No issues detected
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddAdmin}
                  >
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
                                  handleToggleStatus(admin.id, !admin.isActive)
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
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteAdmin(admin.id)}
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

          <TabsContent value="schools" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Schools</CardTitle>
                    <CardDescription>
                      Manage schools and their subscriptions
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Building className="h-4 w-4 mr-2" />
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
                      <TableHead>Subscription</TableHead>
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
                          <div className="flex flex-col gap-1">
                            {getSubscriptionBadge(school.subscriptionStatus)}
                            {school.subscriptionExpiresAt && (
                              <p className="text-xs text-gray-600">
                                Expires:{" "}
                                {formatDate(school.subscriptionExpiresAt)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(school.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit School
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Manage Subscription
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

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure global system parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    General Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Security Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    User Management
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your super admin account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    View Activity Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* School Admin Form Dialog */}
      <SchoolAdminForm
        open={showAdminForm}
        onOpenChange={setShowAdminForm}
        onSubmit={handleFormSubmit}
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
    </div>
  );
}
