import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParentDashboardData } from "@/hooks/useDashboardData";
import {
  Users,
  Calendar,
  Megaphone,
  DollarSign,
  AlertTriangle,
  User,
  Star,
  TrendingUp,
  FileText,
  MessageSquare,
  Bell,
  CreditCard,
  Download,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export function ParentDashboard() {
  const { data, isLoading, error } = useParentDashboardData();

  // Demo data for parent dashboard
  const demoData = {
    parentName: "Sarah Williams",
    children: [
      {
        id: 1,
        name: "Alex Johnson",
        grade: "Grade 9A",
        studentId: "STU2024001",
        attendance: 94.5,
        overallGrade: "A-",
        status: "active",
      },
      {
        id: 2,
        name: "Emma Johnson",
        grade: "Grade 6B",
        studentId: "STU2024078",
        attendance: 96.2,
        overallGrade: "A",
        status: "active",
      },
    ],
    totalAttendance: 95.3,
    upcomingEvents: 2,
    pendingFees: 12500,
    unreadMessages: 3,
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

  const upcomingEvents = [
    {
      title: "Parent-Teacher Conference",
      date: "Dec 15, 2024",
      time: "2:00 PM - 4:00 PM",
      type: "meeting",
      student: "Alex Johnson",
    },
    {
      title: "Science Fair Exhibition",
      date: "Dec 20, 2024",
      time: "10:00 AM - 2:00 PM",
      type: "event",
      student: "Emma Johnson",
    },
  ];

  const recentGrades = [
    {
      student: "Alex Johnson",
      subject: "Mathematics",
      grade: "A",
      date: "2 days ago",
      teacher: "Ms. Johnson",
    },
    {
      student: "Emma Johnson",
      subject: "Science",
      grade: "A+",
      date: "3 days ago",
      teacher: "Mr. Smith",
    },
    {
      student: "Alex Johnson",
      subject: "English",
      grade: "B+",
      date: "1 week ago",
      teacher: "Mrs. Davis",
    },
  ];

  const feeBreakdown = [
    {
      description: "Tuition Fee - Alex Johnson",
      amount: 8000,
      dueDate: "Dec 15",
    },
    {
      description: "Tuition Fee - Emma Johnson",
      amount: 7500,
      dueDate: "Dec 15",
    },
    {
      description: "Activity Fee - Alex Johnson",
      amount: 1500,
      dueDate: "Dec 20",
    },
    { description: "Lab Fee - Emma Johnson", amount: 1000, dueDate: "Dec 20" },
  ];

  const recentMessages = [
    {
      from: "Ms. Johnson (Mathematics)",
      subject: "Alex's Progress Update",
      time: "2 hours ago",
      read: false,
    },
    {
      from: "School Administration",
      subject: "Holiday Schedule Notice",
      time: "1 day ago",
      read: false,
    },
    {
      from: "Mr. Smith (Science)",
      subject: "Science Fair Preparation",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Parent Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {demoData.parentName}! Track your children's progress.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Users className="w-3 h-3 mr-1" />
            {demoData.children.length} Children
          </Badge>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
            <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500">
              {demoData.unreadMessages}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Children</CardTitle>
            <div className="p-2 bg-blue-50 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.children?.length || demoData.children.length}
            </div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.totalAttendance?.toFixed(1) || demoData.totalAttendance}%
            </div>
            <p className="text-xs text-muted-foreground">Combined average</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-full">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.upcomingEvents || demoData.upcomingEvents}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <div className="p-2 bg-orange-50 rounded-full">
              <DollarSign className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {data?.pendingFees?.toLocaleString() ||
                demoData.pendingFees.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Outstanding amount</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Children Overview */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Children Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data?.children || demoData.children).map(
                (child: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">
                          {child.name ||
                            `${child.profiles?.first_name} ${child.profiles?.last_name}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {child.grade} • ID:{" "}
                          {child.studentId || child.admission_number}
                        </p>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        {child.status || "Active"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Attendance</p>
                        <p className="font-medium text-green-600">
                          {child.attendance || "95"}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Grade</p>
                        <p className="font-medium text-blue-600">
                          {child.overallGrade || "A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{grade.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {grade.subject} • {grade.teacher}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {grade.date}
                    </p>
                  </div>
                  <Badge
                    variant={
                      grade.grade.startsWith("A") ? "default" : "secondary"
                    }
                    className="text-lg px-3 py-1"
                  >
                    {grade.grade}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All Grades
            </Button>
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
                  View Attendance
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/grades">
                  <Star className="mr-3 h-4 w-4 text-yellow-600" />
                  Check Grades
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/fees">
                  <CreditCard className="mr-3 h-4 w-4 text-blue-600" />
                  Pay Fees
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-start h-12"
                variant="outline"
                asChild
              >
                <Link to="/messages">
                  <MessageSquare className="mr-3 h-4 w-4 text-purple-600" />
                  Message Teachers
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.student}
                      </p>
                    </div>
                    <Badge
                      variant={
                        event.type === "meeting" ? "default" : "secondary"
                      }
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.date} • {event.time}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              View All Events
            </Button>
          </CardContent>
        </Card>

        {/* Fee Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              Fee Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feeBreakdown.map((fee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{fee.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {fee.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ���{fee.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay All Fees
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMessages.map((message, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  message.read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      message.read ? "bg-gray-400" : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{message.from}</p>
                    <p className="text-sm text-muted-foreground">
                      {message.subject}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {message.time}
                  </p>
                  {!message.read && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              View All Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
