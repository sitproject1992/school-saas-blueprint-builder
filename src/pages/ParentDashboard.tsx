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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  BookOpen,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Bell,
  FileText,
  GraduationCap,
  Home,
  School,
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
} from "recharts";

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("emma");

  // Mock data for demonstration
  const children = [
    {
      id: "emma",
      name: "Emma Johnson",
      grade: "Grade 5",
      class: "5A",
      avatar: "/placeholder-student.jpg",
      teacher: "Ms. Smith",
    },
    {
      id: "alex",
      name: "Alex Johnson",
      grade: "Grade 3",
      class: "3B",
      avatar: "/placeholder-student.jpg",
      teacher: "Mr. Davis",
    },
  ];

  const currentChild =
    children.find((child) => child.id === selectedChild) || children[0];

  const recentGrades = [
    { subject: "Mathematics", grade: "A-", percentage: 87, date: "2024-01-15" },
    { subject: "Science", grade: "B+", percentage: 84, date: "2024-01-14" },
    { subject: "English", grade: "A", percentage: 92, date: "2024-01-13" },
    { subject: "History", grade: "B", percentage: 78, date: "2024-01-12" },
    { subject: "Art", grade: "A+", percentage: 96, date: "2024-01-11" },
  ];

  const attendanceData = [
    { month: "Sep", present: 20, absent: 2 },
    { month: "Oct", present: 22, absent: 1 },
    { month: "Nov", present: 19, absent: 3 },
    { month: "Dec", present: 21, absent: 1 },
    { month: "Jan", present: 15, absent: 0 },
  ];

  const progressData = [
    { subject: "Math", previous: 75, current: 87 },
    { subject: "Science", previous: 80, current: 84 },
    { subject: "English", previous: 88, current: 92 },
    { subject: "History", previous: 72, current: 78 },
    { subject: "Art", previous: 90, current: 96 },
  ];

  const upcomingEvents = [
    {
      title: "Parent-Teacher Conference",
      date: "2024-01-20",
      time: "2:00 PM",
      type: "meeting",
    },
    {
      title: "Science Fair",
      date: "2024-01-25",
      time: "10:00 AM",
      type: "event",
    },
    { title: "Math Test", date: "2024-01-18", time: "9:00 AM", type: "exam" },
    {
      title: "Field Trip - Museum",
      date: "2024-01-30",
      time: "8:00 AM",
      type: "trip",
    },
  ];

  const recentAnnouncements = [
    {
      title: "Winter Break Schedule",
      message: "School will be closed from Dec 25 - Jan 5",
      date: "2024-01-10",
      priority: "high",
    },
    {
      title: "Lunch Menu Update",
      message: "New healthy lunch options available starting next week",
      date: "2024-01-09",
      priority: "medium",
    },
    {
      title: "Sports Day Registration",
      message: "Sign up for sports day events by January 15",
      date: "2024-01-08",
      priority: "medium",
    },
  ];

  const feeStatus = {
    totalDue: 1250,
    paid: 750,
    pending: 500,
    dueDate: "2024-01-31",
  };

  const quickActions = [
    {
      title: "Message Teacher",
      icon: MessageSquare,
      action: () => console.log("Message teacher"),
    },
    {
      title: "View Assignments",
      icon: FileText,
      action: () => console.log("View assignments"),
    },
    {
      title: "Schedule Meeting",
      icon: Calendar,
      action: () => console.log("Schedule meeting"),
    },
    {
      title: "Check Attendance",
      icon: Clock,
      action: () => console.log("Check attendance"),
    },
    {
      title: "Pay Fees",
      icon: DollarSign,
      action: () => console.log("Pay fees"),
    },
    {
      title: "Download Report",
      icon: FileText,
      action: () => console.log("Download report"),
    },
  ];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "exam":
        return "bg-red-100 text-red-800";
      case "trip":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your child's academic progress and school activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact School
          </Button>
        </div>
      </div>

      {/* Child Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Select Child:
            </label>
            <div className="flex gap-2">
              {children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.id ? "default" : "outline"}
                  onClick={() => setSelectedChild(child.id)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback>
                      {child.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {child.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Avatar className="h-16 w-16 mx-auto mb-4">
              <AvatarImage src={currentChild.avatar} />
              <AvatarFallback className="text-lg">
                {currentChild.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{currentChild.name}</h3>
            <p className="text-gray-600">
              {currentChild.grade} - {currentChild.class}
            </p>
            <p className="text-sm text-gray-500">
              Teacher: {currentChild.teacher}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Grade
                </p>
                <p className="text-2xl font-bold text-green-600">A-</p>
                <p className="text-sm text-gray-500">87% Average</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-green-600">96%</p>
                <p className="text-sm text-gray-500">Excellent</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fee Status</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${feeStatus.pending}
                </p>
                <p className="text-sm text-gray-500">
                  Due: {feeStatus.dueDate}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Latest assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentGrades.slice(0, 5).map((grade, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{grade.subject}</p>
                        <p className="text-sm text-gray-500">{grade.date}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${getGradeColor(grade.percentage)}`}
                        >
                          {grade.grade}
                        </p>
                        <p className="text-sm text-gray-500">
                          {grade.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Important dates and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {event.date} at {event.time}
                        </p>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>School Announcements</CardTitle>
              <CardDescription>Latest updates from the school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnnouncements.map((announcement, index) => (
                  <Alert
                    key={index}
                    className={
                      announcement.priority === "high"
                        ? "border-red-200"
                        : "border-blue-200"
                    }
                  >
                    <Bell className="h-4 w-4" />
                    <AlertTitle className="flex justify-between items-center">
                      {announcement.title}
                      <span className="text-sm font-normal text-gray-500">
                        {announcement.date}
                      </span>
                    </AlertTitle>
                    <AlertDescription>{announcement.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common parent tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.action}
                    className="h-16 flex flex-col items-center justify-center gap-2"
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-sm">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          {/* Grade Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>
                Subject-wise performance improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="previous" fill="#94a3b8" name="Previous" />
                  <Bar dataKey="current" fill="#3b82f6" name="Current" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Grades */}
          <Card>
            <CardHeader>
              <CardTitle>All Grades</CardTitle>
              <CardDescription>Complete grade history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGrades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{grade.subject}</p>
                        <p className="text-sm text-gray-500">{grade.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${getGradeColor(grade.percentage)}`}
                      >
                        {grade.grade}
                      </p>
                      <p className="text-sm text-gray-500">
                        {grade.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Monthly attendance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Calendar Events */}
          <Card>
            <CardHeader>
              <CardTitle>School Calendar</CardTitle>
              <CardDescription>
                All upcoming school events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          {/* Fee Status */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Information</CardTitle>
              <CardDescription>
                Payment status and billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-600">
                      Paid Amount
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      ${feeStatus.paid}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-600">
                      Pending Amount
                    </p>
                    <p className="text-2xl font-bold text-yellow-700">
                      ${feeStatus.pending}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">
                      Total Due
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      ${feeStatus.totalDue}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span>
                      {Math.round((feeStatus.paid / feeStatus.totalDue) * 100)}%
                      Completed
                    </span>
                  </div>
                  <Progress
                    value={(feeStatus.paid / feeStatus.totalDue) * 100}
                  />
                </div>

                <div className="flex justify-center">
                  <Button size="lg">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Outstanding Amount
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
