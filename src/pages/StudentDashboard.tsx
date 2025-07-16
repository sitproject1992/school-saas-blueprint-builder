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
  BookOpen,
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Zap,
  Target,
  Award,
  User,
  Home,
  MessageSquare,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function StudentDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock student data
  const studentInfo = {
    name: "Emma Johnson",
    grade: "Grade 5",
    class: "5A",
    studentId: "STU001",
    avatar: "/placeholder-student.jpg",
  };

  const todaySchedule = [
    {
      time: "9:00 AM",
      subject: "Mathematics",
      teacher: "Ms. Smith",
      room: "Room 101",
      status: "completed",
    },
    {
      time: "10:00 AM",
      subject: "Science",
      teacher: "Mr. Johnson",
      room: "Lab 2",
      status: "current",
    },
    {
      time: "11:00 AM",
      subject: "English",
      teacher: "Mrs. Brown",
      room: "Room 203",
      status: "upcoming",
    },
    {
      time: "12:00 PM",
      subject: "Lunch Break",
      teacher: "",
      room: "Cafeteria",
      status: "upcoming",
    },
    {
      time: "1:00 PM",
      subject: "History",
      teacher: "Mr. Davis",
      room: "Room 105",
      status: "upcoming",
    },
    {
      time: "2:00 PM",
      subject: "Art",
      teacher: "Ms. Wilson",
      room: "Art Studio",
      status: "upcoming",
    },
  ];

  const assignments = [
    {
      title: "Math Homework - Chapter 5",
      subject: "Mathematics",
      dueDate: "2024-01-18",
      status: "pending",
      priority: "high",
      progress: 60,
    },
    {
      title: "Science Project - Solar System",
      subject: "Science",
      dueDate: "2024-01-20",
      status: "in_progress",
      priority: "medium",
      progress: 30,
    },
    {
      title: "English Essay - My Hero",
      subject: "English",
      dueDate: "2024-01-22",
      status: "not_started",
      priority: "medium",
      progress: 0,
    },
    {
      title: "History Timeline Project",
      subject: "History",
      dueDate: "2024-01-25",
      status: "not_started",
      priority: "low",
      progress: 0,
    },
  ];

  const recentGrades = [
    {
      subject: "Mathematics",
      grade: "A-",
      score: 87,
      maxScore: 100,
      date: "2024-01-15",
    },
    {
      subject: "Science",
      grade: "B+",
      score: 84,
      maxScore: 100,
      date: "2024-01-14",
    },
    {
      subject: "English",
      grade: "A",
      score: 92,
      maxScore: 100,
      date: "2024-01-13",
    },
    {
      subject: "History",
      grade: "B",
      score: 78,
      maxScore: 100,
      date: "2024-01-12",
    },
    {
      subject: "Art",
      grade: "A+",
      score: 96,
      maxScore: 100,
      date: "2024-01-11",
    },
  ];

  const progressData = [
    { month: "Sep", math: 75, science: 80, english: 85, history: 70, art: 90 },
    { month: "Oct", math: 78, science: 82, english: 87, history: 72, art: 92 },
    { month: "Nov", math: 82, science: 84, english: 89, history: 75, art: 94 },
    { month: "Dec", math: 85, science: 86, english: 90, history: 76, art: 95 },
    { month: "Jan", math: 87, science: 84, english: 92, history: 78, art: 96 },
  ];

  const skillsData = [
    { skill: "Problem Solving", level: 85 },
    { skill: "Communication", level: 92 },
    { skill: "Creativity", level: 88 },
    { skill: "Critical Thinking", level: 80 },
    { skill: "Collaboration", level: 90 },
    { skill: "Time Management", level: 75 },
  ];

  const achievements = [
    {
      title: "Perfect Attendance",
      description: "No absences this month",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "Math Star",
      description: "Top performer in mathematics",
      icon: Award,
      color: "text-blue-600",
    },
    {
      title: "Creative Writer",
      description: "Best essay in English class",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Team Player",
      description: "Excellent collaboration skills",
      icon: Target,
      color: "text-green-600",
    },
  ];

  const upcomingEvents = [
    { title: "Math Test", date: "2024-01-18", time: "10:00 AM", type: "exam" },
    {
      title: "Science Fair",
      date: "2024-01-25",
      time: "2:00 PM",
      type: "event",
    },
    {
      title: "Art Exhibition",
      date: "2024-01-30",
      time: "3:00 PM",
      type: "showcase",
    },
    {
      title: "Parent Meeting",
      date: "2024-02-01",
      time: "4:00 PM",
      type: "meeting",
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

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={studentInfo.avatar} />
            <AvatarFallback className="text-lg">
              {studentInfo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {studentInfo.name.split(" ")[0]}!
            </h1>
            <p className="text-gray-600">
              {studentInfo.grade} - {studentInfo.class} | Student ID:{" "}
              {studentInfo.studentId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            My Schedule
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Grade
                </p>
                <p className="text-2xl font-bold text-green-600">A-</p>
                <p className="text-sm text-gray-500">87.4% Average</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-blue-600">
                  {assignments.filter((a) => a.status !== "completed").length}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-green-600">96%</p>
                <p className="text-sm text-gray-500">This Month</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Class</p>
                <p className="text-2xl font-bold text-purple-600">Science</p>
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
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((class_item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-3 rounded-lg ${getStatusColor(class_item.status)}`}
                    >
                      <div className="text-center min-w-[80px]">
                        <p className="text-sm font-medium">{class_item.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{class_item.subject}</p>
                        {class_item.teacher && (
                          <p className="text-sm text-gray-600">
                            {class_item.teacher} • {class_item.room}
                          </p>
                        )}
                      </div>
                      <div>
                        {class_item.status === "completed" && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {class_item.status === "current" && (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Urgent Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Urgent Assignments</CardTitle>
                <CardDescription>Due soon or overdue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments
                    .filter(
                      (a) => a.priority === "high" || a.status === "pending",
                    )
                    .map((assignment, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{assignment.title}</h3>
                          <Badge
                            className={getAssignmentStatusColor(
                              assignment.status,
                            )}
                          >
                            {assignment.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {assignment.subject}
                        </p>
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-sm font-medium ${getPriorityColor(assignment.priority)}`}
                          >
                            {assignment.priority.toUpperCase()} PRIORITY
                          </p>
                          <p className="text-sm text-gray-500">
                            Due: {assignment.dueDate}
                          </p>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{assignment.progress}%</span>
                          </div>
                          <Progress value={assignment.progress} />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {/* All Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>
                Track your homework and projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {assignment.title}
                        </h3>
                        <p className="text-gray-600">{assignment.subject}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={getAssignmentStatusColor(
                            assignment.status,
                          )}
                        >
                          {assignment.status.replace("_", " ")}
                        </Badge>
                        <p
                          className={`text-sm font-medium mt-1 ${getPriorityColor(assignment.priority)}`}
                        >
                          {assignment.priority.toUpperCase()} PRIORITY
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Due Date:</span>
                        <span className="font-medium">
                          {assignment.dueDate}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{assignment.progress}%</span>
                        </div>
                        <Progress value={assignment.progress} />
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">Continue Work</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your latest assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{grade.subject}</h3>
                        <p className="text-sm text-gray-600">{grade.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${getGradeColor(grade.score)}`}
                      >
                        {grade.grade}
                      </p>
                      <p className="text-sm text-gray-500">
                        {grade.score}/{grade.maxScore}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Academic Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>
                Your performance trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="math"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="science"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="english"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="history"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="art"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skills Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>Your current skill levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{skill.skill}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievements Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Celebrate your accomplishments!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
                  >
                    <achievement.icon
                      className={`h-12 w-12 ${achievement.color}`}
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Badges</CardTitle>
              <CardDescription>
                Unlock more badges by improving your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium">Honor Roll</p>
                  <p className="text-sm text-gray-600">Earned</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Award className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">Perfect Week</p>
                  <p className="text-sm text-gray-600">Earned</p>
                </div>
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">Study Master</p>
                  <p className="text-sm text-gray-600">Locked</p>
                </div>
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">Speed Learner</p>
                  <p className="text-sm text-gray-600">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
