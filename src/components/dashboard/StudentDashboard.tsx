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
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Target,
  BarChart3,
  MessageSquare,
  Download,
  PlayCircle,
} from "lucide-react";

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Student-specific stats
  const studentStats = [
    {
      title: "Current GPA",
      value: "3.8",
      subtitle: "Above average",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Subjects",
      value: "8",
      subtitle: "This semester",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Assignments",
      value: "12",
      subtitle: "Due this week",
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Attendance",
      value: "96%",
      subtitle: "This month",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const todaysSchedule = [
    {
      subject: "Mathematics",
      teacher: "Mr. Johnson",
      time: "08:00 - 08:45",
      room: "Room 201",
      status: "completed",
    },
    {
      subject: "English Literature",
      teacher: "Ms. Davis",
      time: "09:00 - 09:45",
      room: "Room 105",
      status: "current",
    },
    {
      subject: "Physics",
      teacher: "Dr. Wilson",
      time: "10:30 - 11:15",
      room: "Lab 2",
      status: "upcoming",
    },
    {
      subject: "History",
      teacher: "Mrs. Brown",
      time: "14:00 - 14:45",
      room: "Room 301",
      status: "upcoming",
    },
  ];

  const upcomingAssignments = [
    {
      title: "Math Problem Set #5",
      subject: "Mathematics",
      dueDate: "Tomorrow",
      priority: "high",
      completed: false,
      type: "homework",
    },
    {
      title: "Essay: Romeo and Juliet",
      subject: "English Literature",
      dueDate: "Friday",
      priority: "medium",
      completed: false,
      type: "essay",
    },
    {
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "Next Week",
      priority: "medium",
      completed: true,
      type: "lab",
    },
    {
      title: "History Timeline",
      subject: "History",
      dueDate: "Next Monday",
      priority: "low",
      completed: false,
      type: "project",
    },
  ];

  const recentGrades = [
    {
      subject: "Mathematics",
      assignment: "Midterm Exam",
      grade: "A-",
      points: "92/100",
      date: "2 days ago",
    },
    {
      subject: "English",
      assignment: "Book Report",
      grade: "B+",
      points: "87/100",
      date: "1 week ago",
    },
    {
      subject: "Physics",
      assignment: "Lab Experiment",
      grade: "A",
      points: "95/100",
      date: "1 week ago",
    },
    {
      subject: "History",
      assignment: "Research Paper",
      grade: "A-",
      points: "91/100",
      date: "2 weeks ago",
    },
  ];

  const achievements = [
    {
      title: "Perfect Attendance",
      description: "No absences this month",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      date: "This Month",
    },
    {
      title: "Math Excellence",
      description: "Top 10% in Mathematics",
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      date: "Last Week",
    },
    {
      title: "Assignment Streak",
      description: "15 assignments submitted on time",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      date: "Ongoing",
    },
  ];

  const quickActions = [
    {
      title: "View Assignments",
      description: "Check upcoming assignments and deadlines",
      icon: FileText,
      route: "/assignments",
      color: "bg-blue-500",
    },
    {
      title: "Check Grades",
      description: "View your latest grades and progress",
      icon: BarChart3,
      route: "/grades",
      color: "bg-green-500",
    },
    {
      title: "Class Schedule",
      description: "View your daily and weekly schedule",
      icon: Calendar,
      route: "/schedule",
      color: "bg-purple-500",
    },
    {
      title: "Messages",
      description: "Check messages from teachers",
      icon: MessageSquare,
      route: "/messages",
      color: "bg-pink-500",
    },
    {
      title: "Study Materials",
      description: "Access course materials and resources",
      icon: Download,
      route: "/materials",
      color: "bg-indigo-500",
    },
    {
      title: "Online Classes",
      description: "Join virtual classes and sessions",
      icon: PlayCircle,
      route: "/online-classes",
      color: "bg-red-500",
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
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    if (grade.startsWith("D")) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
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
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.profile?.first_name || "Student"}! Let's make
            today count.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/assignments")}>
            <FileText className="h-4 w-4 mr-2" />
            Assignments
          </Button>
          <Button onClick={() => navigate("/schedule")}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studentStats.map((stat, index) => (
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
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="tools">Study Tools</TabsTrigger>
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
                  {todaysSchedule.map((classItem, index) => (
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
                          {classItem.teacher} • {classItem.room}
                        </p>
                        <p className="text-sm text-gray-500">
                          {classItem.time}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used student tools</CardDescription>
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

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>
                Keep track of your upcoming deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{assignment.title}</h3>
                        {getPriorityBadge(assignment.priority)}
                        {assignment.completed && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {assignment.subject} • Due: {assignment.dueDate}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        Type: {assignment.type}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={assignment.completed ? "secondary" : "default"}
                    >
                      {assignment.completed ? "Completed" : "Start Work"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>
                Your latest academic performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{grade.assignment}</h3>
                        <Badge className={getGradeBadge(grade.grade)}>
                          {grade.grade}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {grade.subject} • {grade.points}
                      </p>
                      <p className="text-xs text-gray-500">{grade.date}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Grades
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${achievement.bgColor}`}>
                      <achievement.icon
                        className={`h-6 w-6 ${achievement.color}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-xs text-gray-500">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
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
      </Tabs>
    </div>
  );
}
