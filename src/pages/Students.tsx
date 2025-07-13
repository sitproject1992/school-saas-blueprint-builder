import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudentForm } from "@/components/students/StudentForm";
import { useStudents, useDeleteStudent } from "@/hooks/useStudents";
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Users,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Award,
  Target,
} from "lucide-react";

export default function StudentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: students, isLoading, error } = useStudents();
  const deleteStudent = useDeleteStudent();

  // Mock data for enhanced features
  const classes = [
    { id: "all", name: "All Classes" },
    { id: "grade-6", name: "Grade 6" },
    { id: "grade-7", name: "Grade 7" },
    { id: "grade-8", name: "Grade 8" },
    { id: "grade-9", name: "Grade 9" },
    { id: "grade-10", name: "Grade 10" },
  ];

  const mockStudents = [
    {
      id: "1",
      profiles: {
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@student.school.com",
        phone: "+91 98765 43210",
        address: "123 Main Street, Mumbai",
        date_of_birth: "2008-05-15",
        avatar: null,
      },
      classes: { name: "Grade 8A", id: "grade-8" },
      admission_number: "STU001",
      status: "active",
      performance: {
        overall_grade: "A",
        attendance: 92,
        subjects: [
          { name: "Mathematics", grade: "A+", marks: 95 },
          { name: "Science", grade: "A", marks: 88 },
          { name: "English", grade: "B+", marks: 82 },
          { name: "History", grade: "A", marks: 90 },
        ],
      },
      parent_contact: {
        father_name: "Robert Johnson",
        mother_name: "Sarah Johnson",
        father_phone: "+91 98765 43211",
        mother_phone: "+91 98765 43212",
      },
      fees: {
        total: 50000,
        paid: 35000,
        pending: 15000,
        status: "partial",
      },
    },
    {
      id: "2",
      profiles: {
        first_name: "David",
        last_name: "Smith",
        email: "david.smith@student.school.com",
        phone: "+91 98765 43213",
        address: "456 Oak Avenue, Delhi",
        date_of_birth: "2007-08-22",
        avatar: null,
      },
      classes: { name: "Grade 9B", id: "grade-9" },
      admission_number: "STU002",
      status: "active",
      performance: {
        overall_grade: "B+",
        attendance: 88,
        subjects: [
          { name: "Mathematics", grade: "B", marks: 78 },
          { name: "Science", grade: "B+", marks: 82 },
          { name: "English", grade: "A", marks: 88 },
          { name: "History", grade: "B", marks: 75 },
        ],
      },
      parent_contact: {
        father_name: "Michael Smith",
        mother_name: "Linda Smith",
        father_phone: "+91 98765 43214",
        mother_phone: "+91 98765 43215",
      },
      fees: {
        total: 50000,
        paid: 50000,
        pending: 0,
        status: "paid",
      },
    },
    {
      id: "3",
      profiles: {
        first_name: "Emma",
        last_name: "Wilson",
        email: "emma.wilson@student.school.com",
        phone: "+91 98765 43216",
        address: "789 Pine Street, Bangalore",
        date_of_birth: "2009-02-10",
        avatar: null,
      },
      classes: { name: "Grade 7A", id: "grade-7" },
      admission_number: "STU003",
      status: "active",
      performance: {
        overall_grade: "A+",
        attendance: 96,
        subjects: [
          { name: "Mathematics", grade: "A+", marks: 98 },
          { name: "Science", grade: "A+", marks: 94 },
          { name: "English", grade: "A", marks: 90 },
          { name: "History", grade: "A+", marks: 96 },
        ],
      },
      parent_contact: {
        father_name: "James Wilson",
        mother_name: "Emily Wilson",
        father_phone: "+91 98765 43217",
        mother_phone: "+91 98765 43218",
      },
      fees: {
        total: 50000,
        paid: 25000,
        pending: 25000,
        status: "partial",
      },
    },
  ];

  const displayStudents =
    students && students.length > 0 ? students : mockStudents;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent.mutateAsync(id);
    }
  };

  const openForm = (student = null) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedStudent(null);
    setIsFormOpen(false);
  };

  const openProfile = (student) => {
    setSelectedStudentProfile(student);
    setIsProfileOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    return "text-red-600";
  };

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "partial":
        return "text-yellow-600";
      case "overdue":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredStudents = displayStudents.filter((student) => {
    const matchesSearch =
      student.profiles?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.profiles?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.admission_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || student.classes?.id === selectedClass;
    const matchesStatus =
      selectedStatus === "all" || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Students</h3>
          <p className="text-muted-foreground">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  const totalStudents = displayStudents.length;
  const activeStudents = displayStudents.filter(
    (s) => s.status === "active",
  ).length;
  const averageAttendance =
    displayStudents.reduce(
      (acc, s) => acc + (s.performance?.attendance || 0),
      0,
    ) / totalStudents;
  const highPerformers = displayStudents.filter((s) =>
    s.performance?.overall_grade?.startsWith("A"),
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student profiles, track performance, and monitor progress
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => openForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Attendance
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageAttendance.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Performers
            </CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPerformers}</div>
            <p className="text-xs text-muted-foreground">Grade A students</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>
            Search and filter students by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                Table
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.profiles?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {student.profiles?.first_name?.[0]}
                          {student.profiles?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {student.profiles?.first_name}{" "}
                          {student.profiles?.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {student.admission_number}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openProfile(student)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openForm(student)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Class
                      </span>
                      <Badge variant="outline">
                        {student.classes?.name || "No class"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(student.status)}
                      >
                        {student.status}
                      </Badge>
                    </div>
                    {student.performance && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Grade
                          </span>
                          <span
                            className={`font-semibold ${getGradeColor(student.performance.overall_grade)}`}
                          >
                            {student.performance.overall_grade}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Attendance</span>
                            <span>{student.performance.attendance}%</span>
                          </div>
                          <Progress
                            value={student.performance.attendance}
                            className="h-2"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.profiles?.avatar} />
                            <AvatarFallback className="text-xs">
                              {student.profiles?.first_name?.[0]}
                              {student.profiles?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {student.profiles?.first_name}{" "}
                              {student.profiles?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.profiles?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.admission_number}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {student.classes?.name || "No class"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {student.profiles?.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.performance && (
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${getGradeColor(student.performance.overall_grade)}`}
                            >
                              {student.performance.overall_grade}
                            </span>
                            <div className="text-xs text-muted-foreground">
                              {student.performance.attendance}% attendance
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(student.status)}
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openProfile(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openForm(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? "Edit Student" : "Add Student"}
            </DialogTitle>
          </DialogHeader>
          <StudentForm student={selectedStudent} onSuccess={closeForm} />
        </DialogContent>
      </Dialog>

      {/* Student Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudentProfile && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedStudentProfile.profiles?.avatar} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {selectedStudentProfile.profiles?.first_name?.[0]}
                    {selectedStudentProfile.profiles?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {selectedStudentProfile.profiles?.first_name}{" "}
                    {selectedStudentProfile.profiles?.last_name}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedStudentProfile.admission_number}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedStudentProfile.status)}
                    >
                      {selectedStudentProfile.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedStudentProfile.classes?.name}
                    </Badge>
                    {selectedStudentProfile.performance && (
                      <Badge
                        variant="outline"
                        className={getGradeColor(
                          selectedStudentProfile.performance.overall_grade,
                        )}
                      >
                        Grade:{" "}
                        {selectedStudentProfile.performance.overall_grade}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="fees">Fees</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Date of Birth:
                          </span>
                          <span>
                            {new Date(
                              selectedStudentProfile.profiles?.date_of_birth,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{selectedStudentProfile.profiles?.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{selectedStudentProfile.profiles?.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Address:
                          </span>
                          <span className="text-right">
                            {selectedStudentProfile.profiles?.address}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedStudentProfile.performance && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Performance Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Overall Grade:</span>
                            <Badge
                              className={getGradeColor(
                                selectedStudentProfile.performance
                                  .overall_grade,
                              )}
                            >
                              {selectedStudentProfile.performance.overall_grade}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Attendance:</span>
                              <span>
                                {selectedStudentProfile.performance.attendance}%
                              </span>
                            </div>
                            <Progress
                              value={
                                selectedStudentProfile.performance.attendance
                              }
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                  {selectedStudentProfile.performance?.subjects && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Subject Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedStudentProfile.performance.subjects.map(
                            (subject, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                              >
                                <div>
                                  <h4 className="font-medium">
                                    {subject.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Grade: {subject.grade}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold">
                                    {subject.marks}%
                                  </div>
                                  <Progress
                                    value={subject.marks}
                                    className="w-20 h-2"
                                  />
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  {selectedStudentProfile.parent_contact && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Parent Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <h4 className="font-medium">Father's Details</h4>
                            <div className="text-sm space-y-1">
                              <div>
                                Name:{" "}
                                {
                                  selectedStudentProfile.parent_contact
                                    .father_name
                                }
                              </div>
                              <div>
                                Phone:{" "}
                                {
                                  selectedStudentProfile.parent_contact
                                    .father_phone
                                }
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Mother's Details</h4>
                            <div className="text-sm space-y-1">
                              <div>
                                Name:{" "}
                                {
                                  selectedStudentProfile.parent_contact
                                    .mother_name
                                }
                              </div>
                              <div>
                                Phone:{" "}
                                {
                                  selectedStudentProfile.parent_contact
                                    .mother_phone
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="fees" className="space-y-4">
                  {selectedStudentProfile.fees && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Fee Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              ₹
                              {selectedStudentProfile.fees.total.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Fees
                            </div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              ₹
                              {selectedStudentProfile.fees.paid.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Paid
                            </div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              ₹
                              {selectedStudentProfile.fees.pending.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Pending
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Payment Status:</span>
                            <Badge
                              className={getFeeStatusColor(
                                selectedStudentProfile.fees.status,
                              )}
                            >
                              {selectedStudentProfile.fees.status}
                            </Badge>
                          </div>
                          <Progress
                            value={
                              (selectedStudentProfile.fees.paid /
                                selectedStudentProfile.fees.total) *
                              100
                            }
                            className="h-3"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
