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
  User,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  DollarSign,
  MessageSquare,
  Bell,
  Heart,
  Award,
  Users,
} from "lucide-react";

export function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for multiple children
  const [selectedChild, setSelectedChild] = useState(0);

  const children = [
    {
      name: "Emma Johnson",
      grade: "Grade 8",
      class: "8A",
      avatar: "EJ",
      overall_grade: "A-",
      attendance: "94%",
    },
    {
      name: "Alex Johnson",
      grade: "Grade 5",
      class: "5B",
      avatar: "AJ",
      overall_grade: "B+",
      attendance: "97%",
    },
  ];

  const currentChild = children[selectedChild];

  // Parent-specific stats
  const parentStats = [
    {
      title: "Overall Grade",
      value: currentChild.overall_grade,
      subtitle: "This semester",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Attendance",
      value: currentChild.attendance,
      subtitle: "This month",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Assignments",
      value: "8/10",
      subtitle: "Completed this week",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Fee Status",
      value: "Paid",
      subtitle: "Current month",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const recentGrades = [
    {
      subject: "Mathematics",
      assignment: "Algebra Test",
      grade: "A-",
      points: "92/100",
      date: "2 days ago",
      teacher: "Mr. Johnson",
    },
    {
      subject: "English",
      assignment: "Book Report",
      grade: "B+",
      points: "87/100",
      date: "1 week ago",
      teacher: "Ms. Davis",
    },
    {
      subject: "Science",
      assignment: "Lab Report",
      grade: "A",
      points: "95/100",
      date: "1 week ago",
      teacher: "Dr. Wilson",
    },
    {
      subject: "History",
      assignment: "Essay",
      grade: "B+",
      points: "88/100",
      date: "2 weeks ago",
      teacher: "Mrs. Brown",
    },
  ];

  const upcomingEvents = [
    {
      title: "Parent-Teacher Conference",
      date: "Tomorrow",
      time: "3:00 PM",
      type: "meeting",
      teacher: "All Teachers",
    },
    {
      title: "Science Fair",
      date: "Friday",
      time: "2:00 PM",
      type: "event",
      location: "School Auditorium",
    },
    {
      title: "Math Competition",
      date: "Next Week",
      time: "10:00 AM",
      type: "competition",
      location: "Main Hall",
    },
    {
      title: "Field Trip Permission",
      date: "Next Monday",
      time: "All Day",
      type: "trip",
      location: "Science Museum",
    },
  ];

  const teacherMessages = [
    {
      teacher: "Mr. Johnson",
      subject: "Mathematics",
      message:
        "Emma showed excellent improvement in algebra. Keep up the good work!",
      time: "1 day ago",
      priority: "info",
    },
    {
      teacher: "Ms. Davis",
      subject: "English",
      message:
        "Please encourage Emma to participate more in class discussions.",
      time: "3 days ago",
      priority: "medium",
    },
    {
      teacher: "School Nurse",
      subject: "Health",
      message: "Reminder: Annual health checkup due this month.",
      time: "1 week ago",
      priority: "high",
    },
  ];

  const attendanceData = [
    { month: "September", percentage: 98, status: "excellent" },
    { month: "October", percentage: 94, status: "good" },
    { month: "November", percentage: 96, status: "excellent" },
    { month: "December", percentage: 92, status: "good" },
  ];

  const feeInformation = [
    {
      description: "Tuition Fee",
      amount: "$2,500",
      dueDate: "January 15",
      status: "paid",
    },
    {
      description: "Activity Fee",
      amount: "$150",
      dueDate: "January 15",
      status: "paid",
    },
    {
      description: "Book Fee",
      amount: "$200",
      dueDate: "February 1",
      status: "pending",
    },
  ];

  const quickActions = [
    {
      title: "View Report Card",
      description: "Check latest academic progress report",
      icon: FileText,
      route: "/report-card",
      color: "bg-blue-500",
    },
    {
      title: "Schedule Meeting",
      description: "Book parent-teacher conference",
      icon: Calendar,
      route: "/schedule-meeting",
      color: "bg-green-500",
    },
    {
      title: "Pay Fees",
      description: "View and pay pending fees",
      icon: DollarSign,
      route: "/fees",
      color: "bg-yellow-500",
    },
    {
      title: "Contact Teacher",
      description: "Send message to teachers",
      icon: MessageSquare,
      route: "/messages",
      color: "bg-purple-500",
    },
    {
      title: "Check Attendance",
      description: "View attendance records",
      icon: CheckCircle,
      route: "/attendance",
      color: "bg-indigo-500",
    },
    {
      title: "School Events",
      description: "View upcoming school events",
      icon: Calendar,
      route: "/events",
      color: "bg-pink-500",
    },
  ];

  const getGradeBadge = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    if (grade.startsWith("D")) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getEventTypeBadge = (type: string) => {
    const types = {
      meeting: { label: "Meeting", class: "bg-blue-100 text-blue-800" },
      event: { label: "Event", class: "bg-green-100 text-green-800" },
      competition: {
        label: "Competition",
        class: "bg-purple-100 text-purple-800",
      },
      trip: { label: "Trip", class: "bg-yellow-100 text-yellow-800" },
    };
    const eventType = types[type as keyof typeof types] || {
      label: type,
      class: "bg-gray-100 text-gray-800",
    };
    return <Badge className={eventType.class}>{eventType.label}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.profile?.first_name || "Parent"}! Stay
            connected with your child's progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/messages")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button onClick={() => navigate("/events")}>
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </Button>
        </div>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">
                Viewing progress for:
              </span>
              <div className="flex gap-2">
                {children.map((child, index) => (
                  <Button
                    key={index}
                    variant={selectedChild === index ? "default" : "outline"}
                    onClick={() => setSelectedChild(index)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      {child.avatar}
                    </div>
                    {child.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {parentStats.map((stat, index) => (
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
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="tools">Parent Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Academic Performance</CardTitle>
                <CardDescription>
                  Latest grades for {currentChild.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGrades.slice(0, 3).map((grade, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">
                            {grade.assignment}
                          </h3>
                          <Badge className={getGradeBadge(grade.grade)}>
                            {grade.grade}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {grade.subject} • {grade.teacher}
                        </p>
                        <p className="text-xs text-gray-500">
                          {grade.points} • {grade.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/grades")}
                >
                  View All Grades
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teacher Messages</CardTitle>
                <CardDescription>
                  Recent communications from teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 border-l-4 rounded-lg ${getPriorityColor(message.priority)}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">
                          {message.teacher}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {message.subject}
                      </p>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/messages")}
                >
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>
                Detailed grade breakdown for {currentChild.name}
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
                        {grade.subject} • {grade.teacher}
                      </p>
                      <p className="text-xs text-gray-500">
                        {grade.points} • {grade.date}
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
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Monthly attendance for {currentChild.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceData.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{record.month}</h3>
                      <p className="text-sm text-gray-600">
                        Attendance: {record.percentage}%
                      </p>
                    </div>
                    <Badge
                      variant={
                        record.status === "excellent" ? "default" : "secondary"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                School events and important dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{event.title}</h3>
                        {getEventTypeBadge(event.type)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {event.date} • {event.time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.teacher && `Teacher: ${event.teacher}`}
                        {event.location && `Location: ${event.location}`}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Information</CardTitle>
              <CardDescription>
                Current and upcoming fee payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeInformation.map((fee, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{fee.description}</h3>
                        <Badge
                          variant={
                            fee.status === "paid" ? "secondary" : "destructive"
                          }
                        >
                          {fee.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Amount: {fee.amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {fee.dueDate}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={fee.status === "paid" ? "secondary" : "default"}
                    >
                      {fee.status === "paid" ? "Paid" : "Pay Now"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
