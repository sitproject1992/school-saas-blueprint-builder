import { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Shield,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data for demonstration
  const keyMetrics = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+5.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Teachers",
      value: "89",
      change: "+2.1%",
      trend: "up",
      icon: GraduationCap,
    },
    {
      title: "Revenue (Monthly)",
      value: "$45,230",
      change: "+8.7%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  const enrollmentData = [
    { month: "Jan", students: 1180, teachers: 82 },
    { month: "Feb", students: 1200, teachers: 84 },
    { month: "Mar", students: 1220, teachers: 86 },
    { month: "Apr", students: 1235, teachers: 87 },
    { month: "May", students: 1247, teachers: 89 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 38500, expenses: 28000 },
    { month: "Feb", revenue: 41200, expenses: 29500 },
    { month: "Mar", revenue: 43800, expenses: 31000 },
    { month: "Apr", revenue: 44500, expenses: 30800 },
    { month: "May", revenue: 45230, expenses: 32200 },
  ];

  const gradeDistribution = [
    { name: "Kindergarten", value: 156, color: "#8884d8" },
    { name: "Grade 1-2", value: 234, color: "#82ca9d" },
    { name: "Grade 3-5", value: 378, color: "#ffc658" },
    { name: "Grade 6-8", value: 289, color: "#ff7300" },
    { name: "Grade 9-12", value: 190, color: "#0088fe" },
  ];

  const recentAlerts = [
    {
      type: "warning",
      title: "Server Maintenance",
      message: "Scheduled maintenance on Sunday 3:00 AM",
      time: "2 hours ago",
    },
    {
      type: "info",
      title: "New Enrollment",
      message: "15 new students enrolled this week",
      time: "1 day ago",
    },
    {
      type: "error",
      title: "Payment Gateway",
      message: "Payment processing temporarily unavailable",
      time: "3 hours ago",
    },
    {
      type: "success",
      title: "Backup Complete",
      message: "Daily database backup completed successfully",
      time: "6 hours ago",
    },
  ];

  const systemHealth = [
    { component: "Database", status: "healthy", uptime: "99.9%" },
    { component: "API Server", status: "healthy", uptime: "99.8%" },
    { component: "File Storage", status: "warning", uptime: "97.2%" },
    { component: "Email Service", status: "healthy", uptime: "99.5%" },
  ];

  const quickActions = [
    {
      title: "Add New User",
      icon: Users,
      action: () => console.log("Add user"),
    },
    {
      title: "Generate Report",
      icon: FileText,
      action: () => console.log("Generate report"),
    },
    {
      title: "System Settings",
      icon: Settings,
      action: () => console.log("System settings"),
    },
    {
      title: "Security Audit",
      icon: Shield,
      action: () => console.log("Security audit"),
    },
    {
      title: "Backup Data",
      icon: Clock,
      action: () => console.log("Backup data"),
    },
    {
      title: "Send Announcement",
      icon: Bell,
      action: () => console.log("Send announcement"),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Complete overview of school operations and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-sm text-green-600">{metric.change}</p>
                </div>
                <metric.icon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
                <CardDescription>
                  Student and teacher growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="teachers"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Student Distribution by Grade</CardTitle>
                <CardDescription>
                  Current enrollment across grade levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts & Notifications</CardTitle>
              <CardDescription>
                Important system updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <Alert
                    key={index}
                    className={`${alert.type === "error" ? "border-red-200" : alert.type === "warning" ? "border-yellow-200" : alert.type === "success" ? "border-green-200" : "border-blue-200"}`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="flex justify-between items-center">
                      {alert.title}
                      <span className="text-sm font-normal text-gray-500">
                        {alert.time}
                      </span>
                    </AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Revenue Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Analytics</CardTitle>
              <CardDescription>Revenue and expense tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                  <Bar dataKey="expenses" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Components</CardTitle>
                <CardDescription>
                  Health status of system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.map((component, index) => {
                    const StatusIcon = getStatusIcon(component.status);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon
                            className={`h-5 w-5 ${getStatusColor(component.status)}`}
                          />
                          <span className="font-medium">
                            {component.component}
                          </span>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              component.status === "healthy"
                                ? "default"
                                : component.status === "warning"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {component.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {component.uptime} uptime
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>System performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage Usage</span>
                      <span>34%</span>
                    </div>
                    <Progress value={34} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Network Load</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.action}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
