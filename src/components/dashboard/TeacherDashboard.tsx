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
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  MessageSquare,
  Award,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

export function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Teacher-specific stats
  const teacherStats = [
    {
      title: "My Classes",
      value: "6",
      subtitle: "Active classes",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Students",
      value: "187",
      subtitle: "Across all classes",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Today's Classes",
      value: "4",
      subtitle: "Scheduled for today",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Grades",
      value: "23",
      subtitle: "Assignments to grade",
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const todaysClasses = [
    {
      subject: "Mathematics",
      class: "Grade 10A",
      time: "09:00 - 09:45",
      room: "Room 201",
      students: 32,
      status: "completed",
    },
    {
      subject: "Mathematics",
      class: "Grade 10B",
      time: "10:00 - 10:45",
      room: "Room 201",
      students: 28,
      status: "current",
    },
    {
      subject: "Advanced Math",
      class: "Grade 11A",
      time: "14:30 - 15:15",
      room: "Room 201",
      students: 25,
      status: "upcoming",
    },
    {
      subject: "Calculus",
      class: "Grade 12",
      time: "15:30 - 16:15",
      room: "Room 201",
      students: 22,
      status: "upcoming",
    },
  ];

  const recentAssignments = [
    {
      title: "Quadratic Equations Quiz",
      class: "Grade 10A",
      dueDate: "Tomorrow",
      submitted: 28,
      total: 32,
      status: "active",
    },
    {
      title: "Calculus Problem Set",
      class: "Grade 12",
      dueDate: "Next Week",
      submitted: 20,
      total: 22,
      status: "active",
    },
    {
      title: "Geometry Test",
      class: "Grade 10B",
      dueDate: "Completed",
      submitted: 28,
      total: 28,
      status: "completed",
    },
  ];

  const pendingTasks = [
    {
      title: "Grade Quiz Papers",
      description: "Grade 10A Mathematics Quiz - 23 papers pending",
      priority: "high",
      dueDate: "Today",
      type: "grading",
    },
    {
      title: "Prepare Lesson Plan",
      description: "Advanced Calculus - Chapter 5 lesson plan",
      priority: "medium",
      dueDate: "Tomorrow",
      type: "planning",
    },
    {
      title: "Parent Meeting",
      description: "Discussion about Sarah's performance",
      priority: "medium",
      dueDate: "Friday",
      type: "meeting",
    },
    {
      title: "Submit Grades",
      description: "Monthly grade submission deadline",
      priority: "high",
      dueDate: "This Week",
      type: "administrative",
    },
  ];

  const studentPerformance = [
    {
      metric: "Class Average",
      value: "78.5%",
      change: "+2.3%",
      trend: "up",
    },
    {
      metric: "Attendance Rate",
      value: "92.1%",
      change: "+1.1%",
      trend: "up",
    },
    {
      metric: "Assignment Completion",
      value: "87.3%",
      change: "-0.8%",
      trend: "down",
    },
    {
      metric: "Parent Engagement",
      value: "73.2%",
      change: "+4.2%",
      trend: "up",
    },
  ];

  const quickActions = [
    {
      title: "Take Attendance",
      description: "Mark attendance for current class",
      icon: CheckCircle,
      route: "/attendance",
      color: "bg-green-500",
    },
    {
      title: "Grade Assignments",
      description: "Review and grade student submissions",
      icon: FileText,
      route: "/tests",
      color: "bg-blue-500",
    },
    {
      title: "Create Assignment",
      description: "Create new assignments and tests",
      icon: ClipboardList,
      route: "/assignments",
      color: "bg-purple-500",
    },
    {
      title: "View Students",
      description: "Check student profiles and progress",
      icon: Users,
      route: "/students",
      color: "bg-indigo-500",
    },
    {
      title: "Lesson Plans",
      description: "Create and manage lesson plans",
      icon: BookOpen,
      route: "/lesson-plans",
      color: "bg-yellow-500",
    },
    {
      title: "Send Messages",
      description: "Communicate with students and parents",
      icon: MessageSquare,
      route: "/messages",
      color: "bg-pink-500",
    },
  ];

  const getClassStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "current":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Current
          </Badge>
        );
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return variants[priority as keyof typeof variants] || "secondary";
  };

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.profile?.first_name || "Teacher"}! Ready for
            another great day of teaching?
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/attendance")}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Take Attendance
          </Button>
          <Button onClick={() => navigate("/lesson-plans")}>
            <BookOpen className="h-4 w-4 mr-2" />
            Lesson Plans
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teacherStats.map((stat, index) => (
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
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
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
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysClasses.map((classItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{classItem.subject}</h3>
                          {getClassStatusBadge(classItem.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {classItem.class} • {classItem.room}
                        </p>
                        <p className="text-sm text-gray-500">
                          {classItem.time} • {classItem.students} students
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Class
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Frequently used teaching tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleQuickAction(action.route)}
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <div
                        className={`p-2 rounded-lg ${action.color} text-white`}
                      >
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium">
                        {action.title}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
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
                <p className="text-sm text-gray-600">{action.description}</p>
                <Button className="w-full mt-4" variant="outline">
                  Access Tool
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>
                Track assignment submissions and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{assignment.title}</h3>
                        <Badge
                          variant={
                            assignment.status === "completed"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {assignment.class} • Due: {assignment.dueDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submissions: {assignment.submitted}/{assignment.total}(
                        {Math.round(
                          (assignment.submitted / assignment.total) * 100,
                        )}
                        %)
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Metrics</CardTitle>
              <CardDescription>
                Overview of your students' performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentPerformance.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{metric.metric}</h3>
                      <div className="flex items-center gap-1">
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
                        )}
                        <span
                          className={`text-sm ${
                            metric.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
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
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
