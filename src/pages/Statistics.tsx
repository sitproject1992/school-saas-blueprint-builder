import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  BookOpen,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Activity,
} from "lucide-react";

export default function Statistics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("month");

  // Mock statistical data
  const overviewStats = [
    {
      title: "Total Students",
      value: "1,342",
      change: "+12%",
      trend: "up",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Active enrollments",
    },
    {
      title: "Average Attendance",
      value: "92.3%",
      change: "+2.1%",
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "This month",
    },
    {
      title: "Academic Performance",
      value: "87.5%",
      change: "+5.2%",
      trend: "up",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Average score",
    },
    {
      title: "Fee Collection",
      value: "94.8%",
      change: "-1.2%",
      trend: "down",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Collection rate",
    },
  ];

  const academicStats = [
    {
      subject: "Mathematics",
      averageScore: 85.2,
      passRate: 94.5,
      topPerformers: 23,
      trend: "up",
      color: "bg-blue-500",
    },
    {
      subject: "Science",
      averageScore: 82.7,
      passRate: 91.2,
      topPerformers: 19,
      trend: "up",
      color: "bg-green-500",
    },
    {
      subject: "English",
      averageScore: 79.3,
      passRate: 88.7,
      topPerformers: 15,
      trend: "down",
      color: "bg-purple-500",
    },
    {
      subject: "Social Studies",
      averageScore: 76.8,
      passRate: 85.3,
      topPerformers: 12,
      trend: "up",
      color: "bg-orange-500",
    },
  ];

  const classPerformance = [
    {
      class: "Grade 1",
      students: 120,
      attendance: 95.2,
      performance: 88.5,
      fees: 98.5,
    },
    {
      class: "Grade 2",
      students: 118,
      attendance: 94.8,
      performance: 87.2,
      fees: 97.8,
    },
    {
      class: "Grade 3",
      students: 125,
      attendance: 93.5,
      performance: 86.8,
      fees: 96.2,
    },
    {
      class: "Grade 4",
      students: 122,
      attendance: 92.8,
      performance: 88.1,
      fees: 95.8,
    },
    {
      class: "Grade 5",
      students: 115,
      attendance: 91.5,
      performance: 87.9,
      fees: 94.5,
    },
    {
      class: "Grade 6",
      students: 108,
      attendance: 90.2,
      performance: 86.5,
      fees: 93.2,
    },
    {
      class: "Grade 7",
      students: 112,
      attendance: 89.8,
      performance: 85.8,
      fees: 92.8,
    },
    {
      class: "Grade 8",
      students: 105,
      attendance: 88.5,
      performance: 84.2,
      fees: 91.5,
    },
    {
      class: "Grade 9",
      students: 98,
      attendance: 87.2,
      performance: 83.8,
      fees: 90.2,
    },
    {
      class: "Grade 10",
      students: 95,
      attendance: 85.8,
      performance: 82.5,
      fees: 89.8,
    },
    {
      class: "Grade 11",
      students: 88,
      attendance: 84.5,
      performance: 81.2,
      fees: 88.5,
    },
    {
      class: "Grade 12",
      students: 82,
      attendance: 83.2,
      performance: 80.8,
      fees: 87.2,
    },
  ];

  const monthlyTrends = [
    {
      month: "Jan",
      students: 1285,
      attendance: 89.5,
      revenue: 1850000,
      performance: 82.3,
    },
    {
      month: "Feb",
      students: 1298,
      attendance: 90.2,
      revenue: 1920000,
      performance: 83.1,
    },
    {
      month: "Mar",
      students: 1312,
      attendance: 91.1,
      revenue: 1995000,
      performance: 84.5,
    },
    {
      month: "Apr",
      students: 1325,
      attendance: 92.3,
      revenue: 2050000,
      performance: 85.8,
    },
    {
      month: "May",
      students: 1338,
      attendance: 91.8,
      revenue: 2020000,
      performance: 86.2,
    },
    {
      month: "Jun",
      students: 1342,
      attendance: 92.3,
      revenue: 2105000,
      performance: 87.5,
    },
  ];

  const demographicData = [
    {
      category: "Gender",
      male: 698,
      female: 644,
      malePercent: 52,
      femalePercent: 48,
    },
    {
      category: "Age Groups",
      "5-8": 485,
      "9-12": 472,
      "13-16": 275,
      "17-18": 110,
    },
    {
      category: "Location",
      urban: 856,
      suburban: 312,
      rural: 174,
      urbanPercent: 64,
      suburbanPercent: 23,
      ruralPercent: 13,
    },
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90)
      return <Badge className="bg-green-100 text-green-600">Excellent</Badge>;
    if (score >= 80)
      return <Badge className="bg-blue-100 text-blue-600">Good</Badge>;
    if (score >= 70)
      return <Badge className="bg-yellow-100 text-yellow-600">Average</Badge>;
    return <Badge className="bg-red-100 text-red-600">Below Average</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            School Statistics & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights and performance metrics for informed decision
            making
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat, index) => (
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
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.slice(-3).map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{trend.month} 2024</h4>
                        <p className="text-sm text-muted-foreground">
                          {trend.students} students • {trend.attendance}%
                          attendance
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {formatCurrency(trend.revenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trend.performance}% performance
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Enrollment Growth
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Student enrollment increased by 12% this quarter
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Performance Improvement
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Average academic performance up by 5.2%
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        Attention Needed
                      </span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Grade 11-12 attendance needs improvement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {academicStats.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {subject.averageScore}%
                          </span>
                          {subject.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${subject.color} h-2 rounded-full`}
                          style={{ width: `${subject.averageScore}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Pass Rate: {subject.passRate}%</span>
                        <span>Top Performers: {subject.topPerformers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Class Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Class Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {classPerformance.map((cls, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{cls.class}</span>
                        <span className="text-sm text-muted-foreground">
                          {cls.students} students
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div
                            className={`font-semibold ${getPerformanceColor(cls.attendance)}`}
                          >
                            {cls.attendance}%
                          </div>
                          <div className="text-muted-foreground">
                            Attendance
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`font-semibold ${getPerformanceColor(cls.performance)}`}
                          >
                            {cls.performance}%
                          </div>
                          <div className="text-muted-foreground">
                            Performance
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`font-semibold ${getPerformanceColor(cls.fees)}`}
                          >
                            {cls.fees}%
                          </div>
                          <div className="text-muted-foreground">
                            Fee Collection
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Overall Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  92.3%
                </div>
                <p className="text-muted-foreground">This month average</p>
                {getPerformanceBadge(92.3)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Best Performing Class
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  Grade 1
                </div>
                <p className="text-muted-foreground">95.2% attendance rate</p>
                <Badge className="bg-blue-100 text-blue-600">Excellent</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Improvement Needed
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  Grade 12
                </div>
                <p className="text-muted-foreground">83.2% attendance rate</p>
                <Badge className="bg-orange-100 text-orange-600">
                  Needs Attention
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Class-wise Attendance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {classPerformance.map((cls, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{cls.class}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({cls.students} students)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${getPerformanceColor(cls.attendance)}`}
                      >
                        {cls.attendance}%
                      </span>
                      {getPerformanceBadge(cls.attendance)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹2.1Cr</div>
                <p className="text-xs text-muted-foreground">
                  This academic year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">94.8%</div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">₹11.2L</div>
                <p className="text-xs text-muted-foreground">
                  Outstanding fees
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Monthly Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">+8.5%</div>
                <p className="text-xs text-muted-foreground">
                  Compared to last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{trend.month} 2024</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({trend.students} students)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        {formatCurrency(trend.revenue)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((trend.revenue / 2000000) * 100).toFixed(1)}% of
                        target
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Gender Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Male Students</span>
                    <span className="font-medium">698 (52%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: "52%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Female Students</span>
                    <span className="font-medium">644 (48%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full"
                      style={{ width: "48%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Location Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Urban Areas</span>
                      <span className="font-medium">856 (64%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "64%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Suburban Areas</span>
                      <span className="font-medium">312 (23%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "23%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Rural Areas</span>
                      <span className="font-medium">174 (13%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: "13%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Age Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Age Group Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">485</div>
                  <div className="text-sm text-muted-foreground">Age 5-8</div>
                  <div className="text-xs text-blue-600">36.1%</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">472</div>
                  <div className="text-sm text-muted-foreground">Age 9-12</div>
                  <div className="text-xs text-green-600">35.2%</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">275</div>
                  <div className="text-sm text-muted-foreground">Age 13-16</div>
                  <div className="text-xs text-purple-600">20.5%</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">110</div>
                  <div className="text-sm text-muted-foreground">Age 17-18</div>
                  <div className="text-xs text-orange-600">8.2%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
