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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  BookOpen,
  ClipboardCheck,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Bell,
  GraduationCap,
  PlusCircle,
  Edit,
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

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("5A");

  // Mock teacher data
  const teacherInfo = {
    name: "Ms. Sarah Smith",
    subject: "Mathematics",
    employeeId: "TCH001",
    avatar: "/placeholder-teacher.jpg",
  };

  const classes = [
    { id: "5A", name: "Grade 5A", students: 28, subject: "Mathematics" },
    { id: "5B", name: "Grade 5B", students: 25, subject: "Mathematics" },
    { id: "6A", name: "Grade 6A", students: 30, subject: "Mathematics" },
  ];

  const currentClass =
    classes.find((cls) => cls.id === selectedClass) || classes[0];

  const todaySchedule = [
    {
      time: "9:00 AM",
      class: "Grade 5A",
      subject: "Mathematics",
      room: "Room 101",
      status: "completed",
    },
    {
      time: "10:00 AM",
      class: "Grade 6A",
      subject: "Mathematics",
      room: "Room 101",
      status: "current",
    },
    {
      time: "11:00 AM",
      class: "Grade 5B",
      subject: "Mathematics",
      room: "Room 101",
      status: "upcoming",
    },
    {
      time: "12:00 PM",
      class: "Lunch Break",
      subject: "",
      room: "Staff Room",
      status: "upcoming",
    },
    {
      time: "1:00 PM",
      class: "Planning Period",
      subject: "",
      room: "Room 101",
      status: "upcoming",
    },
    {
      time: "2:00 PM",
      class: "Parent Meeting",
      subject: "",
      room: "Conference Room",
      status: "upcoming",
    },
  ];

  const assignments = [
    {
      title: "Chapter 5 Homework",
      class: "Grade 5A",
      dueDate: "2024-01-18",
      submitted: 22,
      total: 28,
      status: "active",
    },
    {
      title: "Fraction Worksheet",
      class: "Grade 5B",
      dueDate: "2024-01-19",
      submitted: 18,
      total: 25,
      status: "active",
    },
    {
      title: "Algebra Quiz",
      class: "Grade 6A",
      dueDate: "2024-01-20",
      submitted: 25,
      total: 30,
      status: "grading",
    },
  ];

  const studentProgress = [
    { name: "Emma Johnson", grade: "A-", percentage: 87, trend: "up" },
    { name: "Alex Chen", grade: "B+", percentage: 84, trend: "up" },
    { name: "Maria Garcia", grade: "A", percentage: 92, trend: "stable" },
    { name: "James Wilson", grade: "C+", percentage: 76, trend: "down" },
    { name: "Sophie Brown", grade: "A+", percentage: 96, trend: "up" },
  ];

  const classPerformance = [
    { month: "Sep", average: 78, attendance: 95 },
    { month: "Oct", average: 82, attendance: 93 },
    { month: "Nov", average: 85, attendance: 96 },
    { month: "Dec", average: 83, attendance: 94 },
    { month: "Jan", average: 87, attendance: 97 },
  ];

  const gradeDistribution = [
    { grade: "A", count: 8, color: "#10b981" },
    { grade: "B", count: 12, color: "#3b82f6" },
    { grade: "C", count: 6, color: "#f59e0b" },
    { grade: "D", count: 2, color: "#ef4444" },
    { grade: "F", count: 0, color: "#6b7280" },
  ];

  const pendingTasks = [
    { task: "Grade Chapter 5 Quiz", priority: "high", dueDate: "Today" },
    {
      task: "Prepare Lesson Plan - Decimals",
      priority: "medium",
      dueDate: "Tomorrow",
    },
    { task: "Parent Conference Notes", priority: "medium", dueDate: "Jan 20" },
    { task: "Update Grade Book", priority: "low", dueDate: "Jan 22" },
  ];

  const recentMessages = [
    {
      from: "Parent - Johnson",
      subject: "Emma's homework question",
      time: "2 hours ago",
      type: "parent",
    },
    {
      from: "Principal Davis",
      subject: "Staff meeting reminder",
      time: "4 hours ago",
      type: "admin",
    },
    {
      from: "Parent - Chen",
      subject: "Alex's absence yesterday",
      time: "1 day ago",
      type: "parent",
    },
    {
      from: "Dr. Wilson",
      subject: "Curriculum updates",
      time: "2 days ago",
      type: "admin",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "current":
        return "text-blue-600 bg-blue-100";
      case "upcoming":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "parent":
        return "border-l-blue-500";
      case "admin":
        return "border-l-purple-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teacherInfo.avatar} />
            <AvatarFallback className="text-lg">
              {teacherInfo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {teacherInfo.name.split(" ")[1]}!
            </h1>
            <p className="text-gray-600">
              {teacherInfo.subject} Teacher | ID: {teacherInfo.employeeId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Class Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Select Class:
            </label>
            <div className="flex gap-2">
              {classes.map((cls) => (
                <Button
                  key={cls.id}
                  variant={selectedClass === cls.id ? "default" : "outline"}
                  onClick={() => setSelectedClass(cls.id)}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <span className="font-medium">{cls.name}</span>
                  <span className="text-xs opacity-75">
                    {cls.students} students
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentClass.students}
                </p>
                <p className="text-sm text-gray-500">in {currentClass.name}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Assignments to Grade
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {assignments.filter((a) => a.status === "grading").length}
                </p>
                <p className="text-sm text-gray-500">Pending review</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Class Average
                </p>
                <p className="text-2xl font-bold text-green-600">87%</p>
                <p className="text-sm text-gray-500">+3% this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Class</p>
                <p className="text-2xl font-bold text-purple-600">6A</p>
                <p className="text-sm text-gray-500">10:00 AM</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Your classes and activities for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((schedule, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-3 rounded-lg ${getStatusColor(schedule.status)}`}
                    >
                      <div className="text-center min-w-[80px]">
                        <p className="text-sm font-medium">{schedule.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{schedule.class}</p>
                        <p className="text-sm text-gray-600">
                          {schedule.subject} • {schedule.room}
                        </p>
                      </div>
                      <div>
                        {schedule.status === "completed" && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {schedule.status === "current" && (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>
                  Important items requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{task.task}</p>
                        <p className="text-sm text-gray-600">
                          Due: {task.dueDate}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Task
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Active Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Active Assignments</CardTitle>
              <CardDescription>
                Current assignments and submission status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">
                          {assignment.class}
                        </p>
                      </div>
                      <Badge
                        variant={
                          assignment.status === "grading"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Submissions: {assignment.submitted}/{assignment.total}
                        </span>
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <Progress
                        value={(assignment.submitted / assignment.total) * 100}
                      />
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">Grade Submissions</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Student Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Student Performance - {currentClass.name}</CardTitle>
              <CardDescription>
                Individual student progress and grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProgress.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-gray-600">
                          Current Grade: {student.grade}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {student.percentage}%
                        </p>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(student.trend)}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {/* Assignment Management */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Assignment Management</h2>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Assignment
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.class}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Submissions</span>
                        <span>
                          {assignment.submitted}/{assignment.total}
                        </span>
                      </div>
                      <Progress
                        value={(assignment.submitted / assignment.total) * 100}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-medium">{assignment.dueDate}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1">
                        Grade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Class Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Trends</CardTitle>
                <CardDescription>
                  Average grades and attendance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Average Grade"
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Attendance %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  Current grade distribution in {currentClass.name}
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
                      label={({ grade, count }) => `${grade}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
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
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          {/* Messages and Communications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Communications from parents and administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 border rounded-lg ${getMessageTypeColor(message.type)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{message.from}</h3>
                      <span className="text-sm text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.subject}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        Mark as Read
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Compose New Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
