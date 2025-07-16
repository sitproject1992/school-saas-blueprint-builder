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
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  School,
  Settings,
  Calendar,
  BookOpen,
  TrendingUp,
  DollarSign,
  Clock,
  Bell,
  MessageSquare,
  FileText,
  BarChart3,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Activity,
} from "lucide-react";

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Admin-specific stats
  const adminStats = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+5.2%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Teachers",
      value: "89",
      change: "+2.1%",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Classes",
      value: "45",
      change: "+1.5%",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+8.7%",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Pending Fees",
      value: "$12,450",
      change: "-3.2%",
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Active Users",
      value: "1,385",
      change: "+4.1%",
      icon: UserCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const adminQuickActions = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      route: "/users",
      color: "bg-blue-500",
    },
    {
      title: "Student Enrollment",
      description: "Enroll new students and manage records",
      icon: GraduationCap,
      route: "/students",
      color: "bg-green-500",
    },
    {
      title: "Teacher Management",
      description: "Manage teacher profiles and assignments",
      icon: UserCheck,
      route: "/teachers",
      color: "bg-purple-500",
    },
    {
      title: "Financial Reports",
      description: "View revenue, expenses, and fee reports",
      icon: BarChart3,
      route: "/reports",
      color: "bg-yellow-500",
    },
    {
      title: "System Settings",
      description: "Configure school settings and preferences",
      icon: Settings,
      route: "/settings",
      color: "bg-red-500",
    },
    {
      title: "Academic Management",
      description: "Manage subjects, classes, and curriculum",
      icon: BookOpen,
      route: "/subjects",
      color: "bg-indigo-500",
    },
  ];

  const recentActivities = [
    {
      title: "New teacher registered",
      description: "Sarah Johnson joined as Math teacher",
      time: "1 hour ago",
      icon: GraduationCap,
      type: "success",
    },
    {
      title: "System backup completed",
      description: "Daily backup completed successfully",
      time: "2 hours ago",
      icon: CheckCircle,
      type: "info",
    },
    {
      title: "Fee payment overdue",
      description: "5 students have overdue payments",
      time: "3 hours ago",
      icon: AlertTriangle,
      type: "warning",
    },
    {
      title: "Class schedule updated",
      description: "Math class rescheduled for Grade 10",
      time: "5 hours ago",
      icon: Calendar,
      type: "info",
    },
    {
      title: "New enrollment",
      description: "Emma Wilson enrolled in Grade 8",
      time: "1 day ago",
      icon: Users,
      type: "success",
    },
  ];

  const pendingTasks = [
    {
      title: "Review Teacher Applications",
      description: "3 pending applications require review",
      priority: "high",
      dueDate: "Today",
    },
    {
      title: "Approve Fee Structure",
      description: "New academic year fee structure approval",
      priority: "medium",
      dueDate: "Tomorrow",
    },
    {
      title: "System Maintenance",
      description: "Schedule monthly system maintenance",
      priority: "low",
      dueDate: "This Week",
    },
    {
      title: "Parent Meeting Setup",
      description: "Organize quarterly parent-teacher meetings",
      priority: "medium",
      dueDate: "Next Week",
    },
  ];

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return variants[priority as keyof typeof variants] || "secondary";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Administrator Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.profile?.first_name || "Administrator"}! Here's
            your school overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/announcements")}>
            <Bell className="h-4 w-4 mr-2" />
            Announcements
          </Button>
          <Button onClick={() => navigate("/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="tasks">Pending Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current system health and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        System Online
                      </p>
                      <p className="text-sm text-green-600">
                        All services running normally
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Pending Updates
                      </p>
                      <p className="text-sm text-yellow-600">
                        5 system updates available
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Statistics</CardTitle>
                <CardDescription>
                  This month's performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Attendance Rate
                    </span>
                    <span className="font-medium">94.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Fee Collection
                    </span>
                    <span className="font-medium">87.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Parent Satisfaction
                    </span>
                    <span className="font-medium">92.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Teacher Retention
                    </span>
                    <span className="font-medium">96.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Quick Actions</CardTitle>
              <CardDescription>
                Frequently used administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminQuickActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuickAction(action.route)}
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                    <Button className="w-full mt-4" variant="outline">
                      Access Feature
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest system activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <activity.icon
                        className={`h-5 w-5 ${getActivityIcon(activity.type)}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/reports")}
              >
                View Full Activity Log
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Administrative Tasks</CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge variant={getPriorityBadge(task.priority) as any}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Handle Task
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
