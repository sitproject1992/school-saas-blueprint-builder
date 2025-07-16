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
<<<<<<< HEAD
=======
import { Button } from "@/components/ui/button";
>>>>>>> origin/main
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  GraduationCap,
  Calculator,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Bus,
  TestTube,
  Utensils,
  Building,
} from "lucide-react";

export default function FeeStructures() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for fee structures
  const feeStats = [
    {
      title: "Active Structures",
      value: 12,
      change: "+2 this month",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Students",
      value: "1,234",
      change: "Enrolled",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Monthly Revenue",
      value: "₹18.5L",
      change: "+8% from last month",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Fee Categories",
      value: 8,
      change: "Different types",
      icon: Calculator,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const feeStructures = [
    {
      id: "FS-001",
      name: "Grade 1-5 Basic",
      description: "Basic fee structure for primary classes",
      applicableClasses: [
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
      ],
      academicYear: "2024-25",
      status: "active",
      totalStudents: 450,
      components: [
        { name: "Tuition Fee", amount: 8000, mandatory: true },
        { name: "Development Fee", amount: 1000, mandatory: true },
        { name: "Activity Fee", amount: 500, mandatory: false },
      ],
      totalAmount: 9500,
      createdAt: "2024-01-15",
      lastModified: "2024-06-20",
    },
    {
      id: "FS-002",
      name: "Grade 6-8 Standard",
      description: "Standard fee structure for middle school",
      applicableClasses: ["Grade 6", "Grade 7", "Grade 8"],
      academicYear: "2024-25",
      status: "active",
      totalStudents: 350,
      components: [
        { name: "Tuition Fee", amount: 12000, mandatory: true },
        { name: "Lab Fee", amount: 2000, mandatory: true },
        { name: "Development Fee", amount: 1500, mandatory: true },
        { name: "Sports Fee", amount: 800, mandatory: false },
      ],
      totalAmount: 16300,
      createdAt: "2024-01-15",
      lastModified: "2024-06-25",
    },
    {
      id: "FS-003",
      name: "Grade 9-10 Science",
      description: "Fee structure for high school science stream",
      applicableClasses: ["Grade 9", "Grade 10"],
      academicYear: "2024-25",
      status: "active",
      totalStudents: 280,
      components: [
        { name: "Tuition Fee", amount: 15000, mandatory: true },
        { name: "Lab Fee", amount: 3000, mandatory: true },
        { name: "Library Fee", amount: 800, mandatory: true },
        { name: "Exam Fee", amount: 1200, mandatory: true },
      ],
      totalAmount: 20000,
      createdAt: "2024-01-15",
      lastModified: "2024-07-01",
    },
    {
      id: "FS-004",
      name: "Grade 11-12 Commerce",
      description: "Fee structure for senior secondary commerce",
      applicableClasses: ["Grade 11", "Grade 12"],
      academicYear: "2024-25",
      status: "active",
      totalStudents: 120,
      components: [
        { name: "Tuition Fee", amount: 18000, mandatory: true },
        { name: "Computer Lab Fee", amount: 2500, mandatory: true },
        { name: "Library Fee", amount: 1000, mandatory: true },
        { name: "Board Exam Fee", amount: 2000, mandatory: true },
      ],
      totalAmount: 23500,
      createdAt: "2024-01-15",
      lastModified: "2024-06-30",
    },
    {
      id: "FS-005",
      name: "Transport Fee",
      description: "Monthly transport charges",
      applicableClasses: ["All Classes"],
      academicYear: "2024-25",
      status: "active",
      totalStudents: 600,
      components: [
        { name: "Bus Fee - Zone 1", amount: 2000, mandatory: true },
        { name: "Bus Fee - Zone 2", amount: 2500, mandatory: true },
        { name: "Bus Fee - Zone 3", amount: 3000, mandatory: true },
      ],
      totalAmount: 2500, // Average
      createdAt: "2024-02-01",
      lastModified: "2024-06-15",
    },
  ];

  const feeCategories = [
    {
      name: "Tuition Fee",
      description: "Monthly academic fee",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      totalAmount: 1850000,
      students: 1234,
    },
    {
      name: "Lab Fee",
      description: "Science and computer lab charges",
      icon: TestTube,
      color: "text-green-600",
      bgColor: "bg-green-50",
      totalAmount: 245000,
      students: 650,
    },
    {
      name: "Transport Fee",
      description: "School bus transportation",
      icon: Bus,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      totalAmount: 180000,
      students: 600,
    },
    {
      name: "Development Fee",
      description: "Infrastructure development",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      totalAmount: 156000,
      students: 1234,
    },
    {
      name: "Meal Fee",
      description: "Cafeteria and meal charges",
      icon: Utensils,
      color: "text-red-600",
      bgColor: "bg-red-50",
      totalAmount: 98000,
      students: 400,
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
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-red-100 text-red-600 border-red-200">
            Archived
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
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
=======
import FeeStructureForm from "../components/fees/FeeStructureForm";
import { useInvoices } from "@/hooks/useInvoices";

const getFeeStructures = async () => {
  const { data, error } = await supabase.from("fee_structures").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const deleteFeeStructure = async (id: string) => {
  const { data, error } = await supabase
    .from("fee_structures")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export default function FeeStructures() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<any>(null);

  const {
    data: feeStructures,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feeStructures"],
    queryFn: getFeeStructures,
  });

  const { generateInvoicesMutation } = useInvoices();

  const deleteMutation = useMutation({
    mutationFn: deleteFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });

  const handleEdit = (feeStructure: any) => {
    setSelectedFeeStructure(feeStructure);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedFeeStructure(null);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Fee Structures</h1>
>>>>>>> origin/main
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fee Structure Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure and manage fee structures for different classes and
            categories
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
                Create Structure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Fee Structure</DialogTitle>
              </DialogHeader>
<<<<<<< HEAD
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Structure Name
                    </label>
                    <Input placeholder="Enter structure name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Academic Year</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Enter description" rows={3} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Applicable Classes
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">Grade 1-5</SelectItem>
                      <SelectItem value="6-8">Grade 6-8</SelectItem>
                      <SelectItem value="9-10">Grade 9-10</SelectItem>
                      <SelectItem value="11-12">Grade 11-12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Fee Components</label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Component name" />
                      <Input type="number" placeholder="Amount" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mandatory">Mandatory</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Component
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Structure
                  </Button>
                </div>
              </div>
=======
              <FeeStructureForm
                feeStructure={selectedFeeStructure}
                onSuccess={handleSuccess}
              />
>>>>>>> origin/main
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {feeStats.map((stat, index) => (
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
          <TabsTrigger value="structures">Structures</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Active Fee Structures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Active Fee Structures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeStructures.slice(0, 4).map((structure) => (
                    <div
                      key={structure.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{structure.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {structure.totalStudents} students •{" "}
                          {formatCurrency(structure.totalAmount)}
                        </p>
                      </div>
                      {getStatusBadge(structure.status)}
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full">
                    View All Structures
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeCategories.slice(0, 4).map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.bgColor}`}>
                          <category.icon
                            className={`h-4 w-4 ${category.color}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {category.students} students
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(category.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="structures" className="space-y-6">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search fee structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Structure Name</TableHead>
                    <TableHead>Applicable Classes</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructures.map((structure) => (
                    <TableRow key={structure.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{structure.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {structure.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {structure.applicableClasses
                            .slice(0, 2)
                            .map((cls, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {cls}
                              </Badge>
                            ))}
                          {structure.applicableClasses.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{structure.applicableClasses.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(structure.totalAmount)}
                      </TableCell>
                      <TableCell>{structure.totalStudents}</TableCell>
                      <TableCell>{structure.academicYear}</TableCell>
                      <TableCell>{getStatusBadge(structure.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
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

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {feeCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    {category.name}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Revenue</span>
                      <span className="font-medium">
                        {formatCurrency(category.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Students Enrolled</span>
                      <span className="font-medium">{category.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg per Student</span>
                      <span className="font-medium">
                        {formatCurrency(
                          Math.round(category.totalAmount / category.students),
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Fee Collection Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Monthly Revenue</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹18.5L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Collection Rate</span>
                    <span className="text-xl font-bold text-blue-600">
                      94.2%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Fee per Student</span>
                    <span className="text-xl font-bold text-purple-600">
                      ₹15,000
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Class-wise Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      class: "Grade 1-5",
                      students: 450,
                      revenue: 4275000,
                      color: "bg-blue-500",
                    },
                    {
                      class: "Grade 6-8",
                      students: 350,
                      revenue: 5705000,
                      color: "bg-green-500",
                    },
                    {
                      class: "Grade 9-10",
                      students: 280,
                      revenue: 5600000,
                      color: "bg-purple-500",
                    },
                    {
                      class: "Grade 11-12",
                      students: 154,
                      revenue: 3619000,
                      color: "bg-orange-500",
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {item.class}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.students} students •{" "}
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${(item.students / 1234) * 100}%` }}
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
