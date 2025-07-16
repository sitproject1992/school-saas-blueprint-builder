import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldCheck,
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  School,
  GraduationCap,
  BookOpen,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function Users() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Mock data for users
  const userStats = [
    {
      title: "Total Users",
      value: "1,567",
      change: "+23 this month",
      icon: UsersIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: "1,489",
      change: "94.8% active",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Approvals",
      value: 12,
      change: "Require attention",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Inactive Users",
      value: 78,
      change: "5.2% inactive",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const roleDistribution = [
    {
      role: "Students",
      count: 1342,
      percentage: 85.6,
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      role: "Parents",
      count: 892,
      percentage: 56.9,
      icon: UsersIcon,
      color: "bg-green-500",
    },
    {
      role: "Teachers",
      count: 89,
      percentage: 5.7,
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      role: "Administrators",
      count: 12,
      percentage: 0.8,
      icon: ShieldCheck,
      color: "bg-orange-500",
    },
  ];

  const users = [
    {
      id: "USR-001",
      name: "Dr. Priya Sharma",
      email: "priya.sharma@school.edu",
      phone: "+91 98765 43210",
      role: "admin",
      status: "active",
      lastLogin: "2024-07-10T10:30:00Z",
      createdAt: "2024-01-15T09:00:00Z",
      department: "Administration",
      permissions: ["full_access", "user_management", "financial_reports"],
      avatar: null,
      location: "Mumbai, Maharashtra",
    },
    {
      id: "USR-002",
      name: "Mr. Rajesh Kumar",
      email: "rajesh.kumar@school.edu",
      phone: "+91 98765 43211",
      role: "teacher",
      status: "active",
      lastLogin: "2024-07-10T14:45:00Z",
      createdAt: "2024-02-01T08:30:00Z",
      department: "Mathematics",
      permissions: ["class_management", "grade_entry", "attendance"],
      avatar: null,
      location: "Delhi, Delhi",
    },
    {
      id: "USR-003",
      name: "Mrs. Anjali Patel",
      email: "anjali.patel@parent.com",
      phone: "+91 98765 43212",
      role: "parent",
      status: "active",
      lastLogin: "2024-07-09T18:20:00Z",
      createdAt: "2024-03-10T16:00:00Z",
      department: "Parent",
      permissions: ["view_child_progress", "fee_payment", "communication"],
      avatar: null,
      location: "Bangalore, Karnataka",
      children: ["John Patel - Grade 8A", "Sarah Patel - Grade 5B"],
    },
    {
      id: "USR-004",
      name: "John Smith",
      email: "john.smith@student.edu",
      phone: "+91 98765 43213",
      role: "student",
      status: "active",
      lastLogin: "2024-07-10T16:15:00Z",
      createdAt: "2024-04-05T10:00:00Z",
      department: "Grade 10A",
      permissions: ["view_assignments", "submit_work", "view_grades"],
      avatar: null,
      location: "Chennai, Tamil Nadu",
    },
    {
      id: "USR-005",
      name: "Ms. Sarah Wilson",
      email: "sarah.wilson@school.edu",
      phone: "+91 98765 43214",
      role: "teacher",
      status: "inactive",
      lastLogin: "2024-06-28T11:30:00Z",
      createdAt: "2024-01-20T14:00:00Z",
      department: "English Literature",
      permissions: ["class_management", "grade_entry"],
      avatar: null,
      location: "Pune, Maharashtra",
    },
    {
      id: "USR-006",
      name: "David Brown",
      email: "david.brown@student.edu",
      phone: "+91 98765 43215",
      role: "student",
      status: "pending",
      lastLogin: null,
      createdAt: "2024-07-08T12:00:00Z",
      department: "Grade 9B",
      permissions: [],
      avatar: null,
      location: "Hyderabad, Telangana",
    },
  ];

  const recentActivities = [
    {
      user: "Dr. Priya Sharma",
      action: "Updated system permissions",
      type: "admin",
      timestamp: "2024-07-10T10:30:00Z",
      details: "Modified teacher access levels",
    },
    {
      user: "John Smith",
      action: "Submitted assignment",
      type: "academic",
      timestamp: "2024-07-10T09:45:00Z",
      details: "Mathematics homework for Grade 10A",
    },
    {
      user: "Mrs. Anjali Patel",
      action: "Paid monthly fee",
      type: "financial",
      timestamp: "2024-07-09T18:20:00Z",
      details: "Fee payment for 2 children",
    },
    {
      user: "Mr. Rajesh Kumar",
      action: "Marked attendance",
      type: "attendance",
      timestamp: "2024-07-09T08:15:00Z",
      details: "Grade 10B morning session",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-600 border-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-600 border-red-200">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-100 text-red-600 border-red-200">
            Administrator
          </Badge>
        );
      case "teacher":
        return (
          <Badge className="bg-blue-100 text-blue-600 border-blue-200">
            Teacher
          </Badge>
        );
      case "student":
        return (
          <Badge className="bg-green-100 text-green-600 border-green-200">
            Student
          </Badge>
        );
      case "parent":
        return (
          <Badge className="bg-purple-100 text-purple-600 border-purple-200">
            Parent
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-red-600" />;
      case "teacher":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "student":
        return <GraduationCap className="h-4 w-4 text-green-600" />;
      case "parent":
        return <UsersIcon className="h-4 w-4 text-purple-600" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "admin":
        return <Settings className="h-4 w-4 text-red-600" />;
      case "academic":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "financial":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "attendance":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, permissions, and access controls across the
            platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Enter email address" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Department/Class
                    </label>
                    <Input placeholder="Enter department or class" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="Enter location" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">User Management</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Financial Reports</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Class Management</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Grade Entry</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Role Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roleDistribution.map((role, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <role.icon className="h-4 w-4" />
                          <span className="font-medium">{role.role}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {role.count} users
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${role.color} h-2 rounded-full`}
                          style={{ width: `${(role.count / 1567) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Recent User Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {activity.action}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {activity.user}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.details}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">98.2%</div>
                  <div className="text-sm text-muted-foreground">
                    Login Success Rate
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">456</div>
                  <div className="text-sm text-muted-foreground">
                    Active Today
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">23</div>
                  <div className="text-sm text-muted-foreground">
                    New This Month
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">2.3</div>
                  <div className="text-sm text-muted-foreground">
                    Avg Session (hrs)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                        </div>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {user.status === "active" ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Role Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      role: "Administrator",
                      permissions: [
                        "Full System Access",
                        "User Management",
                        "Financial Reports",
                        "System Settings",
                      ],
                      color: "bg-red-100 text-red-600",
                      icon: ShieldCheck,
                    },
                    {
                      role: "Teacher",
                      permissions: [
                        "Class Management",
                        "Grade Entry",
                        "Attendance",
                        "Student Reports",
                      ],
                      color: "bg-blue-100 text-blue-600",
                      icon: BookOpen,
                    },
                    {
                      role: "Student",
                      permissions: [
                        "View Grades",
                        "Submit Assignments",
                        "Access Materials",
                        "View Schedule",
                      ],
                      color: "bg-green-100 text-green-600",
                      icon: GraduationCap,
                    },
                    {
                      role: "Parent",
                      permissions: [
                        "View Child Progress",
                        "Fee Payment",
                        "Communication",
                        "Download Reports",
                      ],
                      color: "bg-purple-100 text-purple-600",
                      icon: UsersIcon,
                    },
                  ].map((role, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <role.icon className="h-5 w-5" />
                        <h4 className="font-medium">{role.role}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {role.permissions.map((permission, pIndex) => (
                          <div key={pIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permission Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      feature: "User Management",
                      admin: true,
                      teacher: false,
                      student: false,
                      parent: false,
                    },
                    {
                      feature: "Grade Entry",
                      admin: true,
                      teacher: true,
                      student: false,
                      parent: false,
                    },
                    {
                      feature: "View Reports",
                      admin: true,
                      teacher: true,
                      student: true,
                      parent: true,
                    },
                    {
                      feature: "Financial Access",
                      admin: true,
                      teacher: false,
                      student: false,
                      parent: true,
                    },
                    {
                      feature: "System Settings",
                      admin: true,
                      teacher: false,
                      student: false,
                      parent: false,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-2 items-center py-2 border-b"
                    >
                      <div className="text-sm font-medium">{item.feature}</div>
                      <div className="text-center">
                        {item.admin ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </div>
                      <div className="text-center">
                        {item.teacher ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </div>
                      <div className="text-center">
                        {item.student ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </div>
                      <div className="text-center">
                        {item.parent ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-5 gap-2 items-center py-2 text-xs text-muted-foreground">
                    <div></div>
                    <div className="text-center">Admin</div>
                    <div className="text-center">Teacher</div>
                    <div className="text-center">Student</div>
                    <div className="text-center">Parent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities
                  .concat([
                    {
                      user: "Ms. Sarah Wilson",
                      action: "Account suspended",
                      type: "admin",
                      timestamp: "2024-07-08T15:30:00Z",
                      details: "Inactive for 30+ days",
                    },
                    {
                      user: "David Brown",
                      action: "Registration pending",
                      type: "admin",
                      timestamp: "2024-07-08T12:00:00Z",
                      details: "Awaiting document verification",
                    },
                  ])
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <h4 className="font-medium">{activity.action}</h4>
                          <p className="text-sm text-muted-foreground">
                            {activity.user}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        Minimum 8 characters, mixed case
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-600">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        SMS and email verification
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-600">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Session Timeout</h4>
                      <p className="text-sm text-muted-foreground">
                        Auto-logout after 30 minutes
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Login Monitoring</h4>
                      <p className="text-sm text-muted-foreground">
                        Failed attempt tracking
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-600">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        Password Expiry
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      12 users have passwords expiring within 7 days
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">
                        Failed Login Attempts
                      </span>
                    </div>
                    <p className="text-sm text-red-700">
                      3 accounts with multiple failed login attempts today
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        System Update
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Security patches applied successfully
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
