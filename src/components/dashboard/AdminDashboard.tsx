import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Clock,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export function AdminDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+20.1%",
      trend: "up",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Teachers",
      value: "56",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Classes",
      value: "32",
      change: "+5.2%",
      trend: "up",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Monthly Revenue",
      value: "$45,231",
      change: "-2.4%",
      trend: "down",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const quickActions = [
    { title: "Add Student", icon: UserPlus, color: "bg-blue-600 hover:bg-blue-700" },
    { title: "Schedule Class", icon: Calendar, color: "bg-green-600 hover:bg-green-700" },
    { title: "View Reports", icon: TrendingUp, color: "bg-purple-600 hover:bg-purple-700" },
    { title: "Manage Fees", icon: DollarSign, color: "bg-orange-600 hover:bg-orange-700" }
  ];

  const recentActivities = [
    { action: "New student enrolled", time: "2 hours ago", type: "success" },
    { action: "Payment received", time: "4 hours ago", type: "success" },
    { action: "Class scheduled", time: "6 hours ago", type: "info" },
    { action: "Teacher on leave", time: "8 hours ago", type: "warning" }
  ];

  const classPerformance = [
    { class: "Grade 8A", students: 28, attendance: 92, performance: 85 },
    { class: "Grade 8B", students: 25, attendance: 88, performance: 78 },
    { class: "Grade 9A", students: 30, attendance: 95, performance: 91 },
    { class: "Grade 9B", students: 27, attendance: 89, performance: 82 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your school.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Clock className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {quickActions.map((action, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="justify-start h-12"
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classPerformance.map((cls, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{cls.class}</span>
                    <span className="text-xs text-muted-foreground">{cls.students} students</span>
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
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Morning Assembly</p>
                  <p className="text-sm text-muted-foreground">8:00 AM - 8:30 AM</p>
                </div>
                <Badge variant="outline">Ongoing</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Staff Meeting</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM</p>
                </div>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Parent Meeting</p>
                  <p className="text-sm text-muted-foreground">4:00 PM - 5:00 PM</p>
                </div>
                <Badge variant="secondary">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">School Holiday</p>
                <p className="text-sm text-blue-700">National Day holiday on Monday, December 25th</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-900">New Teacher Joined</p>
                <p className="text-sm text-green-700">Ms. Sarah Johnson joined as Math teacher</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-medium text-orange-900">Fee Reminder</p>
                <p className="text-sm text-orange-700">Monthly fee collection starts tomorrow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
