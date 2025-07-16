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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  FileText,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Filter,
  BarChart3,
} from "lucide-react";
import { DateRange } from "react-day-picker";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedClass, setSelectedClass] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const reportCategories = [
    {
      id: "academic",
      title: "Academic Reports",
      description: "Student performance and academic analytics",
      icon: GraduationCap,
      reports: [
        {
          name: "Student Performance Report",
          description: "Detailed academic performance analysis",
          status: "active",
        },
        {
          name: "Class Progress Report",
          description: "Class-wise academic progress tracking",
          status: "active",
        },
        {
          name: "Subject Analysis Report",
          description: "Subject-wise performance insights",
          status: "active",
        },
        {
          name: "Attendance Summary",
          description: "Student attendance patterns and trends",
          status: "active",
        },
      ],
    },
    {
      id: "financial",
      title: "Financial Reports",
      description: "Fee collection and financial analytics",
      icon: DollarSign,
      reports: [
        {
          name: "Fee Collection Report",
          description: "Comprehensive fee collection analysis",
          status: "active",
        },
        {
          name: "Outstanding Dues Report",
          description: "Pending payments and dues tracking",
          status: "active",
        },
        {
          name: "Payment Trends Report",
          description: "Payment patterns and trends analysis",
          status: "active",
        },
        {
          name: "Financial Summary",
          description: "Overall financial health overview",
          status: "active",
        },
      ],
    },
    {
      id: "administrative",
      title: "Administrative Reports",
      description: "Operational and administrative insights",
      icon: Users,
      reports: [
        {
          name: "Staff Performance Report",
          description: "Teacher and staff performance analysis",
          status: "active",
        },
        {
          name: "Resource Utilization Report",
          description: "Classroom and resource usage analysis",
          status: "active",
        },
        {
          name: "Enrollment Report",
          description: "Student enrollment trends and statistics",
          status: "active",
        },
        {
          name: "Operational Efficiency Report",
          description: "Overall operational performance metrics",
          status: "active",
        },
      ],
    },
    {
      id: "compliance",
      title: "Compliance Reports",
      description: "Regulatory and compliance reporting",
      icon: FileText,
      reports: [
        {
          name: "Audit Trail Report",
          description: "System usage and activity logging",
          status: "active",
        },
        {
          name: "Data Security Report",
          description: "Security compliance and data protection",
          status: "active",
        },
        {
          name: "Regulatory Compliance Report",
          description: "Educational regulatory compliance status",
          status: "active",
        },
        {
          name: "Privacy Report",
          description: "Data privacy and GDPR compliance tracking",
          status: "active",
        },
      ],
    },
  ];

  const quickStats = [
    {
      title: "Total Reports Generated",
      value: "1,247",
      change: "+12%",
      icon: FileText,
    },
    { title: "Active Users", value: "89", change: "+5%", icon: Users },
    {
      title: "Data Accuracy",
      value: "99.8%",
      change: "+0.2%",
      icon: TrendingUp,
    },
    {
      title: "Report Frequency",
      value: "Daily",
      change: "Stable",
      icon: Calendar,
    },
  ];

  const handleGenerateReport = (reportName: string) => {
    console.log("Generating report:", reportName);
    // Implement report generation logic
  };

  const handleDownloadReport = (reportName: string) => {
    console.log("Downloading report:", reportName);
    // Implement report download logic
  };

  const handleViewReport = (reportName: string) => {
    console.log("Viewing report:", reportName);
    // Implement report viewing logic
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Generate comprehensive reports and analyze school performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Reports
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Time Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Class/Grade
              </label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="grade1">Grade 1</SelectItem>
                  <SelectItem value="grade2">Grade 2</SelectItem>
                  <SelectItem value="grade3">Grade 3</SelectItem>
                  <SelectItem value="grade4">Grade 4</SelectItem>
                  <SelectItem value="grade5">Grade 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === "custom" && (
              <div className="flex-1 min-w-[250px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date Range
                </label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <Tabs defaultValue="academic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="administrative">Administrative</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {reportCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.reports.map((report, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {report.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {report.description}
                          </p>
                          <Badge
                            variant={
                              report.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {report.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleGenerateReport(report.name)}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewReport(report.name)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(report.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
