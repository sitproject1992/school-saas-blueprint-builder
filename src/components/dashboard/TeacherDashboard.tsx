import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherDashboardData } from "@/hooks/useDashboardData";
import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  GraduationCap,
  Bell,
  User,
  ArrowRight,
  Eye,
  Plus,
  MessageSquare,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export function TeacherDashboard() {
  const { data, isLoading, error } = useTeacherDashboardData();

  // Demo data for teacher dashboard
  const demoData = {
    totalClasses: 4,
    totalStudents: 128,
    attendanceRate: 92.5,
    upcomingExams: 3,
    pendingLessonPlans: 2,
    averageGrade: "B+",
    teacherName: "Ms. Sarah Johnson",
    subject: "Mathematics",
  };

  if (isLoading) {
    return (
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

  const myClasses = [
    {
      name: "Grade 8A - Mathematics",
      students: 32,
      time: "9:00 AM - 10:00 AM",
      attendance: 94,
    },
    {
      name: "Grade 9B - Mathematics",
      students: 28,
      time: "11:00 AM - 12:00 PM",
      attendance: 88,
    },
    {
      name: "Grade 8B - Mathematics",
      students: 35,
      time: "2:00 PM - 3:00 PM",
      attendance: 96,
    },
    {
      name: "Grade 9A - Mathematics",
      students: 33,
      time: "3:00 PM - 4:00 PM",
      attendance: 91,
    },
  ];

  const todaySchedule = [
    {
      class: "Grade 8A",
      subject: "Algebra",
      time: "9:00 AM",
      status: "completed",
    },
    {
      class: "Grade 9B",
      subject: "Geometry",
      time: "11:00 AM",
      status: "ongoing",
    },
    {
      class: "Grade 8B",
      subject: "Statistics",
      time: "2:00 PM",
      status: "upcoming",
    },
    {
      class: "Grade 9A",
      subject: "Trigonometry",
      time: "3:00 PM",
      status: "upcoming",
    },
  ];

  const recentActivities = [
    {
      action: "Graded Grade 8A quiz on Algebra",
      time: "2 hours ago",
      type: "success",
    },
    {
      action: "Updated lesson plan for Geometry",
      time: "4 hours ago",
      type: "info",
    },
    {
      action: "Marked attendance for Grade 9B",
      time: "6 hours ago",
      type: "success",
    },
    {
      action: "Sent progress report to parents",
      time: "1 day ago",
      type: "info",
    },
  ];

  const upcomingExams = [
    {
      class: "Grade 8A",
      subject: "Algebra Test",
      date: "Dec 15",
      status: "pending",
    },
    {
      class: "Grade 9B",
      subject: "Geometry Quiz",
      date: "Dec 18",
      status: "pending",
    },
    {
      class: "Grade 8B",
      subject: "Monthly Assessment",
      date: "Dec 22",
      status: "draft",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {demoData.teacherName}! Here's your teaching overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <BookOpen className="w-3 h-3 mr-1" />
            {demoData.subject} Teacher
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-red-500">2</Badge>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.totalClasses || demoData.totalClasses}
            </div>
            <p className="text-xs text-muted-foreground">
              Active classes this semester
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Students</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.totalStudents || demoData.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground">
              Students across all classes
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-full">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.attendanceRate?.toFixed(1) || demoData.attendanceRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average class attendance
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <div className="p-2 bg-orange-50 rounded-full">
              <Award className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoData.averageGrade}</div>
            <p className="text-xs text-muted-foreground">
              Class performance average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : item.status === "ongoing"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <p className="font-medium">{item.class}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge
                    variant={
                      item.status === "completed"
                        ? "default"
                        : item.status === "ongoing"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {item.status === "completed"
                      ? "Done"
                      : item.status === "ongoing"
                        ? "Live"
                        : "Upcoming"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Classes Overview */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              My Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myClasses.map((cls, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{cls.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cls.students} students • {cls.time}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Attendance</span>
                      <span>{cls.attendance}%</span>
                    </div>
                    <Progress value={cls.attendance} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/attendance">
                  <CheckCircle className="mr-3 h-4 w-4 text-green-600" />
                  Mark Attendance
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/lesson-plans">
                  <FileText className="mr-3 h-4 w-4 text-blue-600" />
                  Create Lesson Plan
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/grades">
                  <Award className="mr-3 h-4 w-4 text-purple-600" />
                  Enter Grades
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/messages">
                  <MessageSquare className="mr-3 h-4 w-4 text-orange-600" />
                  Message Parents
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{exam.class}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.subject}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{exam.date}</p>
                    <Badge
                      variant={
                        exam.status === "pending" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {exam.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Exam
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
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
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
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
    </div>
  );
}
