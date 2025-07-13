import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentDashboardData } from "@/hooks/useDashboardData";
import {
  Award,
  TrendingUp,
  Calendar,
  BookOpen,
  AlertTriangle,
  Clock,
  User,
  Target,
  Star,
  FileText,
  CheckCircle,
  Bell,
  ArrowRight,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export function StudentDashboard() {
  const { data, isLoading, error } = useStudentDashboardData();

  // Demo data for student dashboard
  const demoData = {
    studentName: "Alex Johnson",
    studentId: "STU2024001",
    grade: "Grade 9A",
    overallGrade: "A-",
    attendanceRate: 94.5,
    upcomingExams: 2,
    pendingAssignments: 3,
    gpa: 3.7,
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

  const subjectGrades = [
    {
      subject: "Mathematics",
      grade: "A",
      percentage: 92,
      teacher: "Ms. Johnson",
    },
    { subject: "Science", grade: "B+", percentage: 87, teacher: "Mr. Smith" },
    { subject: "English", grade: "A-", percentage: 89, teacher: "Mrs. Davis" },
    { subject: "History", grade: "B+", percentage: 85, teacher: "Mr. Wilson" },
    {
      subject: "Physical Education",
      grade: "A",
      percentage: 95,
      teacher: "Coach Brown",
    },
  ];

  const upcomingExams = [
    {
      subject: "Mathematics",
      topic: "Algebra Test",
      date: "Dec 15",
      time: "10:00 AM",
    },
    {
      subject: "Science",
      topic: "Chemistry Quiz",
      date: "Dec 18",
      time: "2:00 PM",
    },
  ];

  const pendingAssignments = [
    {
      subject: "English",
      title: "Essay on Shakespeare",
      dueDate: "Dec 12",
      status: "pending",
    },
    {
      subject: "History",
      title: "World War II Research",
      dueDate: "Dec 14",
      status: "in_progress",
    },
    {
      subject: "Science",
      title: "Lab Report - Chemistry",
      dueDate: "Dec 16",
      status: "pending",
    },
  ];

  const todaySchedule = [
    {
      subject: "Mathematics",
      teacher: "Ms. Johnson",
      time: "9:00 - 10:00 AM",
      room: "Room 201",
      status: "completed",
    },
    {
      subject: "Science",
      teacher: "Mr. Smith",
      time: "10:15 - 11:15 AM",
      room: "Lab 1",
      status: "ongoing",
    },
    {
      subject: "English",
      teacher: "Mrs. Davis",
      time: "11:30 - 12:30 PM",
      room: "Room 105",
      status: "upcoming",
    },
    {
      subject: "History",
      teacher: "Mr. Wilson",
      time: "1:30 - 2:30 PM",
      room: "Room 302",
      status: "upcoming",
    },
  ];

  const recentAchievements = [
    {
      title: "Perfect Attendance - November",
      type: "attendance",
      date: "1 week ago",
    },
    {
      title: "Top 5 in Mathematics Quiz",
      type: "academic",
      date: "2 weeks ago",
    },
    {
      title: "Science Fair Participant",
      type: "extracurricular",
      date: "1 month ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {demoData.studentName}! Here's your academic overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <User className="w-3 h-3 mr-1" />
            {demoData.grade} • ID: {demoData.studentId}
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
            <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500">
              1
            </Badge>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <Award className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.overallGrade || demoData.overallGrade}
            </div>
            <p className="text-xs text-muted-foreground">
              GPA: {demoData.gpa}/4.0
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Attendance</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.attendanceRate?.toFixed(1) || demoData.attendanceRate}%
            </div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Exams
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-full">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.upcomingExams || demoData.upcomingExams}
            </div>
            <p className="text-xs text-muted-foreground">Next 2 weeks</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <div className="p-2 bg-orange-50 rounded-full">
              <BookOpen className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.pendingAssignments || demoData.pendingAssignments}
            </div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Today's Classes
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
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.teacher}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.time} • {item.room}
                    </p>
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
                        : "Next"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Grades */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Subject Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectGrades.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{subject.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {subject.teacher}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          subject.grade.startsWith("A")
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subject.grade}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {subject.percentage}%
                      </p>
                    </div>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
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
                <Link to="/grades">
                  <Star className="mr-3 h-4 w-4 text-yellow-600" />
                  View All Grades
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/attendance">
                  <CheckCircle className="mr-3 h-4 w-4 text-green-600" />
                  Check Attendance
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/assignments">
                  <FileText className="mr-3 h-4 w-4 text-blue-600" />
                  View Assignments
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/timetable">
                  <Download className="mr-3 h-4 w-4 text-purple-600" />
                  Download Timetable
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
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{exam.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.topic}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{exam.date}</p>
                    <p className="text-xs text-muted-foreground">{exam.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Exam Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Pending Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAssignments.map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{assignment.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Due {assignment.dueDate}
                    </p>
                    <Badge
                      variant={
                        assignment.status === "pending"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {assignment.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              View All Assignments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    achievement.type === "academic"
                      ? "bg-blue-100"
                      : achievement.type === "attendance"
                        ? "bg-green-100"
                        : "bg-purple-100"
                  }`}
                >
                  <Award
                    className={`w-4 h-4 ${
                      achievement.type === "academic"
                        ? "text-blue-600"
                        : achievement.type === "attendance"
                          ? "text-green-600"
                          : "text-purple-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
