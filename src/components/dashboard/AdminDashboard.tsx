import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardData } from "@/hooks/useDashboardData";
import {
  Users,
  GraduationCap,
  School,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Receipt,
  FileText,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock3,
  TrendingDown,
} from "lucide-react";

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-muted-foreground">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: data?.totalStudents || 1342,
      change: "+20.1%",
      trend: "up",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Enrolled this semester",
    },
    {
      title: "Total Teachers",
      value: data?.totalTeachers || 89,
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Active faculty members",
    },
    {
      title: "Total Classes",
      value: data?.totalClasses || 45,
      change: "+5.2%",
      trend: "up",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Running this semester",
    },
    {
      title: "Monthly Revenue",
      value: `₹${(data?.totalRevenue || 245800).toLocaleString()}`,
      change: "-2.4%",
      trend: "down",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Fee collection this month",
    },
  ];

  const quickActions = [
    {
      title: "Add Student",
      icon: UserPlus,
      color: "bg-blue-600 hover:bg-blue-700",
      url: "/students",
    },
    {
      title: "Mark Attendance",
      icon: UserCheck,
      color: "bg-green-600 hover:bg-green-700",
      url: "/attendance",
    },
    {
      title: "Generate Invoice",
      icon: Receipt,
      color: "bg-purple-600 hover:bg-purple-700",
      url: "/invoices",
    },
    {
      title: "View Reports",
      icon: TrendingUp,
      color: "bg-orange-600 hover:bg-orange-700",
      url: "/reports",
    },
    {
      title: "Schedule Class",
      icon: Calendar,
      color: "bg-emerald-600 hover:bg-emerald-700",
      url: "/classes",
    },
    {
      title: "Manage Teachers",
      icon: Users,
      color: "bg-indigo-600 hover:bg-indigo-700",
      url: "/teachers",
    },
  ];

  const recentActivities = [
    {
      action: "New student enrolled - John Smith",
      time: "2 hours ago",
      type: "success",
    },
    {
      action: "Payment received - Grade 10A",
      time: "4 hours ago",
      type: "success",
    },
    {
      action: "Class scheduled - Mathematics",
      time: "6 hours ago",
      type: "info",
    },
    {
      action: "Teacher on leave - Ms. Johnson",
      time: "8 hours ago",
      type: "warning",
    },
    { action: "Fee reminder sent", time: "1 day ago", type: "info" },
  ];

  const classPerformance = [
    { class: "Grade 8A", students: 28, attendance: 92, performance: 85 },
    { class: "Grade 8B", students: 25, attendance: 88, performance: 78 },
    { class: "Grade 9A", students: 30, attendance: 95, performance: 91 },
    { class: "Grade 9B", students: 27, attendance: 89, performance: 82 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening at your school today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-red-500">3</Badge>
          </Button>
          <Badge
            variant="outline"
            className="text-green-600 border-green-600 px-3 py-1"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live Updates
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Summary */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Today's Attendance
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/attendance">
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Student Attendance</span>
                <span className="text-2xl font-bold text-green-600">92%</span>
              </div>
              <Progress value={92} className="h-3" />
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-600">1,234</div>
                  <div className="text-muted-foreground text-xs">Present</div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <div className="font-bold text-red-600">108</div>
                  <div className="text-muted-foreground text-xs">Absent</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <div className="font-bold text-yellow-600">24</div>
                  <div className="text-muted-foreground text-xs">Late</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.slice(0, 4).map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-12 hover:shadow-md transition-all duration-200 group"
                  asChild
                >
                  <Link to={action.url}>
                    <div
                      className={`p-2 rounded-lg mr-3 ${action.color} transition-transform group-hover:scale-110`}
                    >
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    {action.title}
                    <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2">
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks & Financial Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-orange-500" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Fee Reminders</span>
                </div>
                <Badge variant="destructive">15</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Pending Admissions
                  </span>
                </div>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Completed Today</span>
                </div>
                <Badge variant="default" className="bg-green-600">
                  12
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ₹2,45,800
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Collected</span>
                  <span className="font-medium">₹2,10,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending</span>
                  <span className="font-medium text-red-600">₹35,300</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Overdue</span>
                  <span className="font-medium text-orange-600">₹12,200</span>
                </div>
              </div>
              <Button className="w-full" size="sm" asChild>
                <Link to="/invoices">
                  <Receipt className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Class Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classPerformance.map((cls, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{cls.class}</span>
                    <span className="text-xs text-muted-foreground">
                      {cls.students} students
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Attendance</span>
                      <span>{cls.attendance}%</span>
                    </div>
                    <Progress value={cls.attendance} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>Performance</span>
                      <span>{cls.performance}%</span>
                    </div>
                    <Progress value={cls.performance} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule & Announcements */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Morning Assembly</p>
                  <p className="text-sm text-green-700">8:00 AM - 8:30 AM</p>
                </div>
                <Badge className="bg-green-600">Ongoing</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Staff Meeting</p>
                  <p className="text-sm text-blue-700">2:00 PM - 3:00 PM</p>
                </div>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Parent Meeting</p>
                  <p className="text-sm text-purple-700">4:00 PM - 5:00 PM</p>
                </div>
                <Badge
                  variant="outline"
                  className="border-purple-600 text-purple-600"
                >
                  Scheduled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Important Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">School Holiday</p>
                <p className="text-sm text-blue-700">
                  National Day holiday on Monday, December 25th
                </p>
                <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-900">New Teacher Joined</p>
                <p className="text-sm text-green-700">
                  Ms. Sarah Johnson joined as Math teacher
                </p>
                <p className="text-xs text-green-600 mt-1">1 day ago</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-medium text-orange-900">Fee Reminder</p>
                <p className="text-sm text-orange-700">
                  Monthly fee collection starts tomorrow
                </p>
                <p className="text-xs text-orange-600 mt-1">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
