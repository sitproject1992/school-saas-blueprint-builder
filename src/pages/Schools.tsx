import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Building2,
  MapPin,
  Users,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Globe,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  Activity,
  TrendingUp,
  School,
  BookOpen,
} from "lucide-react";

export default function Schools() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for schools
  const schoolStats = [
    {
      title: "Total Schools",
      value: 3,
      change: "+1 this year",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Students",
      value: "3,420",
      change: "Across all schools",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Teachers",
      value: 245,
      change: "Active faculty",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Combined Revenue",
      value: "₹5.2Cr",
      change: "+15% this year",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const schools = [
    {
      id: "SCH-001",
      name: "Greenwood International School",
      type: "Primary & Secondary",
      location: {
        address: "123 Education Street, Academic City",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        coordinates: { lat: 19.076, lng: 72.8777 },
      },
      contact: {
        phone: "+91 98765 43210",
        email: "info@greenwood.edu.in",
        website: "https://greenwood.edu.in",
      },
      principal: {
        name: "Dr. Priya Sharma",
        phone: "+91 98765 43211",
        email: "principal@greenwood.edu.in",
      },
      establishment: "2010",
      affiliation: "CBSE",
      status: "active",
      students: 1342,
      teachers: 89,
      classes: 45,
      grades: [
        "LKG",
        "UKG",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ],
      facilities: [
        "Library",
        "Computer Lab",
        "Science Lab",
        "Sports Ground",
        "Auditorium",
        "Cafeteria",
      ],
      performance: {
        attendance: 92.3,
        academicScore: 87.5,
        parentSatisfaction: 94.2,
      },
      fees: {
        monthly: 15000,
        annual: 180000,
        collectionRate: 94.8,
      },
    },
    {
      id: "SCH-002",
      name: "Sunrise Elementary Academy",
      type: "Primary",
      location: {
        address: "456 Learning Lane, Knowledge Park",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        coordinates: { lat: 28.6139, lng: 77.209 },
      },
      contact: {
        phone: "+91 98765 43220",
        email: "admin@sunrise.edu.in",
        website: "https://sunrise.edu.in",
      },
      principal: {
        name: "Mrs. Anjali Patel",
        phone: "+91 98765 43221",
        email: "principal@sunrise.edu.in",
      },
      establishment: "2015",
      affiliation: "NCERT",
      status: "active",
      students: 856,
      teachers: 67,
      classes: 28,
      grades: ["LKG", "UKG", "1", "2", "3", "4", "5"],
      facilities: [
        "Library",
        "Computer Lab",
        "Art Room",
        "Music Room",
        "Playground",
      ],
      performance: {
        attendance: 95.1,
        academicScore: 89.2,
        parentSatisfaction: 96.8,
      },
      fees: {
        monthly: 12000,
        annual: 144000,
        collectionRate: 97.2,
      },
    },
    {
      id: "SCH-003",
      name: "Future Leaders High School",
      type: "Secondary & Senior Secondary",
      location: {
        address: "789 Innovation Road, Tech District",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
      contact: {
        phone: "+91 98765 43230",
        email: "contact@futureleaders.edu.in",
        website: "https://futureleaders.edu.in",
      },
      principal: {
        name: "Mr. Rajesh Kumar",
        phone: "+91 98765 43231",
        email: "principal@futureleaders.edu.in",
      },
      establishment: "2018",
      affiliation: "ICSE",
      status: "active",
      students: 1222,
      teachers: 89,
      classes: 38,
      grades: ["6", "7", "8", "9", "10", "11", "12"],
      facilities: [
        "Digital Library",
        "Advanced Computer Lab",
        "Physics Lab",
        "Chemistry Lab",
        "Biology Lab",
        "Sports Complex",
      ],
      performance: {
        attendance: 88.7,
        academicScore: 85.3,
        parentSatisfaction: 91.5,
      },
      fees: {
        monthly: 18000,
        annual: 216000,
        collectionRate: 92.1,
      },
    },
  ];

  const recentActivities = [
    {
      school: "Greenwood International",
      activity: "New computer lab inaugurated",
      type: "facility",
      date: "2024-07-10",
      priority: "medium",
    },
    {
      school: "Sunrise Elementary",
      activity: "Achieved 97% fee collection rate",
      type: "financial",
      date: "2024-07-08",
      priority: "high",
    },
    {
      school: "Future Leaders High",
      activity: "Science fair competition organized",
      type: "academic",
      date: "2024-07-05",
      priority: "low",
    },
    {
      school: "Greenwood International",
      activity: "Parent satisfaction survey completed",
      type: "survey",
      date: "2024-07-03",
      priority: "medium",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-600 border-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-600 border-orange-200">
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 95)
      return <Badge className="bg-green-100 text-green-600">Excellent</Badge>;
    if (score >= 85)
      return <Badge className="bg-blue-100 text-blue-600">Good</Badge>;
    if (score >= 75)
      return <Badge className="bg-yellow-100 text-yellow-600">Average</Badge>;
    return <Badge className="bg-red-100 text-red-600">Needs Improvement</Badge>;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "facility":
        return <Building2 className="h-4 w-4 text-green-600" />;
      case "financial":
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case "survey":
        return <Activity className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Schools Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage multiple school locations, facilities, and performance
            metrics
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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add School
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New School</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School Name</label>
                    <Input placeholder="Enter school name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="senior_secondary">
                          Senior Secondary
                        </SelectItem>
                        <SelectItem value="primary_secondary">
                          Primary & Secondary
                        </SelectItem>
                        <SelectItem value="all">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea placeholder="Enter complete address" rows={2} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Input placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pincode</label>
                    <Input placeholder="Pincode" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="Contact phone" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Contact email" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Principal Name
                    </label>
                    <Input placeholder="Principal's name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Affiliation</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select affiliation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cbse">CBSE</SelectItem>
                        <SelectItem value="icse">ICSE</SelectItem>
                        <SelectItem value="state">State Board</SelectItem>
                        <SelectItem value="ib">IB</SelectItem>
                        <SelectItem value="cambridge">Cambridge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add School
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {schoolStats.map((stat, index) => (
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
          <TabsTrigger value="schools">All Schools</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* School Cards Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-600" />
                  Schools Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{school.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {school.students} students • {school.teachers}{" "}
                          teachers
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(school.status)}
                        <div className="text-sm text-muted-foreground mt-1">
                          {school.location.city}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {activity.activity}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {activity.school}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {schools.map((school) => (
                  <div key={school.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{school.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Attendance</span>
                        <span className="font-medium">
                          {school.performance.attendance}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Academic Score</span>
                        <span className="font-medium">
                          {school.performance.academicScore}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parent Satisfaction</span>
                        <span className="font-medium">
                          {school.performance.parentSatisfaction}%
                        </span>
                      </div>
                      <div className="pt-2">
                        {getPerformanceBadge(school.performance.academicScore)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-6">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{school.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {school.affiliation}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {school.location.city}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {school.location.state}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{school.type}</TableCell>
                      <TableCell>{school.students}</TableCell>
                      <TableCell>{school.teachers}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {school.principal.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {school.principal.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(school.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MapPin className="w-4 h-4" />
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

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Academic Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{school.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {school.performance.academicScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${school.performance.academicScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Rate Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{school.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {school.performance.attendance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${school.performance.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {schools.map((school) => (
                  <div key={school.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{school.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Fee</span>
                        <span className="font-medium">
                          {formatCurrency(school.fees.monthly)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Revenue</span>
                        <span className="font-medium">
                          {formatCurrency(school.fees.annual * school.students)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collection Rate</span>
                        <span className="font-medium">
                          {school.fees.collectionRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent School Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <h4 className="font-medium">{activity.activity}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.school}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(activity.date)}
                      </div>
                      <Badge
                        className={
                          activity.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : activity.priority === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                        }
                      >
                        {activity.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* School Facilities Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Facilities Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {schools.map((school) => (
                  <div key={school.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{school.name}</h4>
                    <div className="space-y-2">
                      {school.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
