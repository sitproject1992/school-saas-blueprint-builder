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
import {
  School,
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Building,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Star,
  UserCheck,
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
  AreaChart,
  Area,
} from "recharts";

export default function SchoolDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock school data
  const schoolInfo = {
    name: "Greenwood Elementary School",
    address: "123 Education Lane, Learning City",
    established: "1985",
    principal: "Dr. Michael Johnson",
  };

  const keyMetrics = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+5.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Teaching Staff",
      value: "89",
      change: "+2.1%",
      trend: "up",
      icon: GraduationCap,
    },
    {
      title: "Monthly Revenue",
      value: "$245,300",
      change: "+8.7%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Academic Performance",
      value: "94.2%",
      change: "+1.5%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  const enrollmentTrends = [
    { year: "2020", students: 980, teachers: 75, revenue: 180000 },
    { year: "2021", students: 1050, teachers: 79, revenue: 195000 },
    { year: "2022", students: 1150, teachers: 83, revenue: 220000 },
    { year: "2023", students: 1200, teachers: 86, revenue: 238000 },
    { year: "2024", students: 1247, teachers: 89, revenue: 245300 },
  ];

  const gradeWiseEnrollment = [
    { grade: "Kindergarten", students: 156, capacity: 180, percentage: 87 },
    { grade: "Grade 1", students: 145, capacity: 160, percentage: 91 },
    { grade: "Grade 2", students: 138, capacity: 160, percentage: 86 },
    { grade: "Grade 3", students: 142, capacity: 160, percentage: 89 },
    { grade: "Grade 4", students: 134, capacity: 150, percentage: 89 },
    { grade: "Grade 5", students: 129, capacity: 150, percentage: 86 },
    { grade: "Grade 6", students: 127, capacity: 150, percentage: 85 },
    { grade: "Grade 7", students: 121, capacity: 140, percentage: 86 },
    { grade: "Grade 8", students: 118, capacity: 140, percentage: 84 },
    { grade: "Grade 9", students: 115, capacity: 130, percentage: 88 },
    { grade: "Grade 10", students: 112, capacity: 130, percentage: 86 },
    { grade: "Grade 11", students: 105, capacity: 120, percentage: 88 },
    { grade: "Grade 12", students: 105, capacity: 120, percentage: 88 },
  ];

  const departmentPerformance = [
    { department: "Mathematics", average: 88, students: 1247, teachers: 12 },
    { department: "Science", average: 85, students: 1247, teachers: 10 },
    { department: "English", average: 91, students: 1247, teachers: 15 },
    { department: "History", average: 83, students: 1247, teachers: 8 },
    {
      department: "Physical Education",
      average: 94,
      students: 1247,
      teachers: 6,
    },
    { department: "Arts", average: 92, students: 1247, teachers: 7 },
  ];

  const financialOverview = [
    { month: "Aug", tuition: 195000, expenses: 145000, profit: 50000 },
    { month: "Sep", tuition: 205000, expenses: 152000, profit: 53000 },
    { month: "Oct", tuition: 215000, expenses: 148000, profit: 67000 },
    { month: "Nov", tuition: 225000, expenses: 155000, profit: 70000 },
    { month: "Dec", tuition: 235000, expenses: 158000, profit: 77000 },
    { month: "Jan", tuition: 245300, expenses: 162000, profit: 83300 },
  ];

  const recentActivities = [
    {
      title: "New Student Enrollment",
      description: "15 new students enrolled this week",
      time: "2 hours ago",
      type: "enrollment",
    },
    {
      title: "Teacher Evaluation Complete",
      description: "Q1 teacher evaluations completed",
      time: "1 day ago",
      type: "evaluation",
    },
    {
      title: "Safety Drill Conducted",
      description: "Monthly fire drill completed successfully",
      time: "2 days ago",
      type: "safety",
    },
    {
      title: "Parent-Teacher Conference",
      description: "Quarterly conferences scheduled",
      time: "3 days ago",
      type: "meeting",
    },
  ];

  const upcomingEvents = [
    {
      title: "School Board Meeting",
      date: "2024-01-25",
      time: "7:00 PM",
      type: "meeting",
    },
    {
      title: "Science Fair",
      date: "2024-01-30",
      time: "2:00 PM",
      type: "academic",
    },
    {
      title: "Parent Workshop",
      date: "2024-02-05",
      time: "6:00 PM",
      type: "workshop",
    },
    {
      title: "Teacher Training",
      date: "2024-02-10",
      time: "9:00 AM",
      type: "training",
    },
  ];

  const facilityStatus = [
    {
      facility: "Main Building",
      status: "excellent",
      capacity: "95%",
      lastMaintenance: "Dec 2023",
    },
    {
      facility: "Science Labs",
      status: "good",
      capacity: "88%",
      lastMaintenance: "Nov 2023",
    },
    {
      facility: "Library",
      status: "excellent",
      capacity: "75%",
      lastMaintenance: "Jan 2024",
    },
    {
      facility: "Gymnasium",
      status: "good",
      capacity: "92%",
      lastMaintenance: "Oct 2023",
    },
    {
      facility: "Cafeteria",
      status: "fair",
      capacity: "85%",
      lastMaintenance: "Sep 2023",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "fair":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "academic":
        return "bg-green-100 text-green-800";
      case "workshop":
        return "bg-purple-100 text-purple-800";
      case "training":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return Users;
      case "evaluation":
        return UserCheck;
      case "safety":
        return AlertCircle;
      case "meeting":
        return Calendar;
      default:
        return Bell;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <School className="h-12 w-12 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {schoolInfo.name}
            </h1>
            <p className="text-gray-600">{schoolInfo.address}</p>
            <p className="text-sm text-gray-500">
              Established {schoolInfo.established} | Principal:{" "}
              {schoolInfo.principal}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            School Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-sm text-green-600">{metric.change}</p>
                </div>
                <metric.icon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* School Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle>School Growth Trends</CardTitle>
                <CardDescription>
                  Student enrollment and staff growth over years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Students"
                    />
                    <Line
                      type="monotone"
                      dataKey="teachers"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Teachers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest school activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const ActivityIcon = getActivityTypeIcon(activity.type);
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        <ActivityIcon className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Enroll Student</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <GraduationCap className="h-6 w-6" />
                  <span className="text-sm">Add Teacher</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Schedule Event</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Generate Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Bell className="h-6 w-6" />
                  <span className="text-sm">Send Notice</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          {/* Grade-wise Enrollment */}
          <Card>
            <CardHeader>
              <CardTitle>Grade-wise Enrollment</CardTitle>
              <CardDescription>
                Current enrollment and capacity by grade level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradeWiseEnrollment.map((grade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{grade.grade}</h3>
                      <p className="text-sm text-gray-600">
                        {grade.students}/{grade.capacity} students
                      </p>
                    </div>
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <Progress value={grade.percentage} className="flex-1" />
                      <span className="text-sm font-medium w-12">
                        {grade.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academics" className="space-y-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>
                Academic performance by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Details */}
          <Card>
            <CardHeader>
              <CardTitle>Department Details</CardTitle>
              <CardDescription>
                Detailed view of each academic department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentPerformance.map((dept, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {dept.department}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Average Score:
                        </span>
                        <span className="font-medium">{dept.average}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Teachers:</span>
                        <span className="font-medium">{dept.teachers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Students:</span>
                        <span className="font-medium">{dept.students}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>
                Revenue, expenses, and profit trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={financialOverview}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="tuition"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="3"
                    stroke="#10b981"
                    fill="#10b981"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          {/* Facility Status */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Status</CardTitle>
              <CardDescription>
                Current status and utilization of school facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilityStatus.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Building className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{facility.facility}</h3>
                        <p className="text-sm text-gray-600">
                          Last maintenance: {facility.lastMaintenance}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Capacity</p>
                        <p className="font-medium">{facility.capacity}</p>
                      </div>
                      <Badge className={getStatusColor(facility.status)}>
                        {facility.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Scheduled school events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {event.date} at {event.time}
                        </p>
                      </div>
                    </div>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Event
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
