import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TestTube,
  Calendar,
  Clock,
  Users,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Award,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function Exams() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for exams
  const examStats = [
    {
      title: "Scheduled Exams",
      value: 15,
      change: "+3 this week",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Ongoing Exams",
      value: 8,
      change: "Active today",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed Exams",
      value: 32,
      change: "+5 this month",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Students",
      value: 1234,
      change: "Participating",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const upcomingExams = [
    {
      id: 1,
      title: "Mathematics Mid-term",
      subject: "Mathematics",
      class: "Grade 10A",
      date: "2024-07-15",
      time: "09:00 AM",
      duration: "2 hours",
      students: 28,
      type: "Written",
      status: "scheduled",
    },
    {
      id: 2,
      title: "Physics Lab Test",
      subject: "Physics",
      class: "Grade 11B",
      date: "2024-07-16",
      time: "10:30 AM",
      duration: "1.5 hours",
      students: 25,
      type: "Practical",
      status: "scheduled",
    },
    {
      id: 3,
      title: "English Literature",
      subject: "English",
      class: "Grade 9A",
      date: "2024-07-17",
      time: "11:00 AM",
      duration: "3 hours",
      students: 30,
      type: "Written",
      status: "ongoing",
    },
    {
      id: 4,
      title: "Chemistry Final",
      subject: "Chemistry",
      class: "Grade 12A",
      date: "2024-07-18",
      time: "02:00 PM",
      duration: "3 hours",
      students: 22,
      type: "Written",
      status: "scheduled",
    },
  ];

  const examResults = [
    {
      id: 1,
      examTitle: "Mathematics Quarter",
      class: "Grade 10A",
      totalStudents: 28,
      appeared: 26,
      passed: 24,
      passPercentage: 92,
      averageScore: 78,
      date: "2024-06-20",
    },
    {
      id: 2,
      examTitle: "Science Test",
      class: "Grade 9B",
      totalStudents: 25,
      appeared: 25,
      passed: 22,
      passPercentage: 88,
      averageScore: 75,
      date: "2024-06-18",
    },
    {
      id: 3,
      examTitle: "History Mid-term",
      class: "Grade 11A",
      totalStudents: 30,
      appeared: 29,
      passed: 27,
      passPercentage: 93,
      averageScore: 81,
      date: "2024-06-15",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-600 border-blue-200">
            Scheduled
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-green-100 text-green-600 border-green-200">
            Ongoing
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-600 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Written":
        return <FileText className="h-4 w-4" />;
      case "Practical":
        return <TestTube className="h-4 w-4" />;
      case "Oral":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Examinations Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage exams, schedules, and results efficiently
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exam Title</label>
                    <Input placeholder="Enter exam title" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10a">Grade 10A</SelectItem>
                        <SelectItem value="10b">Grade 10B</SelectItem>
                        <SelectItem value="11a">Grade 11A</SelectItem>
                        <SelectItem value="11b">Grade 11B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exam Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="written">Written</SelectItem>
                        <SelectItem value="practical">Practical</SelectItem>
                        <SelectItem value="oral">Oral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input type="time" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Duration (hours)
                    </label>
                    <Input type="number" placeholder="2" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Exam</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {examStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upcoming Exams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Upcoming Exams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingExams.slice(0, 3).map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {getTypeIcon(exam.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{exam.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exam.class} • {exam.date} at {exam.time}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(exam.status)}
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full">
                    View All Exams
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Recent Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{result.examTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {result.class}
                          </p>
                        </div>
                        <Badge
                          className={`${result.passPercentage >= 90 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                        >
                          {result.passPercentage}% Pass
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Avg Score:{" "}
                          <span className="font-medium">
                            {result.averageScore}%
                          </span>
                        </div>
                        <div>
                          Appeared:{" "}
                          <span className="font-medium">
                            {result.appeared}/{result.totalStudents}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full">
                    View All Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exam Schedule</CardTitle>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(exam.type)}
                          <span className="font-medium">{exam.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{exam.subject}</TableCell>
                      <TableCell>{exam.class}</TableCell>
                      <TableCell>
                        <div>
                          <div>{exam.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {exam.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{exam.duration}</TableCell>
                      <TableCell>{exam.students}</TableCell>
                      <TableCell>{getStatusBadge(exam.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Appeared</TableHead>
                    <TableHead>Passed</TableHead>
                    <TableHead>Pass %</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.examTitle}
                      </TableCell>
                      <TableCell>{result.class}</TableCell>
                      <TableCell>{result.totalStudents}</TableCell>
                      <TableCell>{result.appeared}</TableCell>
                      <TableCell>{result.passed}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${result.passPercentage >= 90 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                        >
                          {result.passPercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>{result.averageScore}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Pass Rate</span>
                    <span className="text-2xl font-bold text-green-600">
                      91%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Score</span>
                    <span className="text-2xl font-bold text-blue-600">
                      78%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Improvement Rate</span>
                    <span className="text-2xl font-bold text-purple-600">
                      +5%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { subject: "Mathematics", score: 85, color: "bg-blue-500" },
                    { subject: "Physics", score: 78, color: "bg-green-500" },
                    { subject: "Chemistry", score: 82, color: "bg-purple-500" },
                    { subject: "English", score: 79, color: "bg-orange-500" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {item.subject}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
