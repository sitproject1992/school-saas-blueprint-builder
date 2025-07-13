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
  Receipt,
  DollarSign,
  Calendar,
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Printer,
  Mail,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function Invoices() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data for invoices
  const invoiceStats = [
    {
      title: "Total Invoices",
      value: "1,234",
      change: "+52 this month",
      icon: Receipt,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Paid Invoices",
      value: "1,098",
      change: "89% paid",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Amount",
      value: "₹35,300",
      change: "136 invoices",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Overdue Amount",
      value: "₹12,200",
      change: "24 invoices",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const invoices = [
    {
      id: "INV-2024-001",
      studentId: "STU001",
      studentName: "John Smith",
      class: "Grade 10A",
      feeStructure: "Monthly Tuition",
      amount: 15000,
      dueDate: "2024-07-15",
      issueDate: "2024-06-15",
      status: "paid",
      paymentDate: "2024-07-12",
      paymentMethod: "Online",
      parentEmail: "john.parent@email.com",
      parentPhone: "+1234567890",
    },
    {
      id: "INV-2024-002",
      studentId: "STU002",
      studentName: "Sarah Johnson",
      class: "Grade 9B",
      feeStructure: "Monthly Tuition + Lab",
      amount: 18000,
      dueDate: "2024-07-15",
      issueDate: "2024-06-15",
      status: "pending",
      paymentDate: null,
      paymentMethod: null,
      parentEmail: "sarah.parent@email.com",
      parentPhone: "+1234567891",
    },
    {
      id: "INV-2024-003",
      studentId: "STU003",
      studentName: "Mike Wilson",
      class: "Grade 11A",
      feeStructure: "Monthly Tuition",
      amount: 15000,
      dueDate: "2024-07-10",
      issueDate: "2024-06-10",
      status: "overdue",
      paymentDate: null,
      paymentMethod: null,
      parentEmail: "mike.parent@email.com",
      parentPhone: "+1234567892",
    },
    {
      id: "INV-2024-004",
      studentId: "STU004",
      studentName: "Emily Davis",
      class: "Grade 8A",
      feeStructure: "Monthly Tuition + Transport",
      amount: 20000,
      dueDate: "2024-07-15",
      issueDate: "2024-06-15",
      status: "draft",
      paymentDate: null,
      paymentMethod: null,
      parentEmail: "emily.parent@email.com",
      parentPhone: "+1234567893",
    },
    {
      id: "INV-2024-005",
      studentId: "STU005",
      studentName: "David Brown",
      class: "Grade 12B",
      feeStructure: "Monthly Tuition + Exam",
      amount: 22000,
      dueDate: "2024-07-15",
      issueDate: "2024-06-15",
      status: "partially_paid",
      paymentDate: "2024-07-08",
      paymentMethod: "Cash",
      parentEmail: "david.parent@email.com",
      parentPhone: "+1234567894",
    },
  ];

  const recentPayments = [
    {
      id: "PAY-001",
      invoiceId: "INV-2024-001",
      studentName: "John Smith",
      amount: 15000,
      method: "Online",
      date: "2024-07-12",
      time: "10:30 AM",
    },
    {
      id: "PAY-002",
      invoiceId: "INV-2024-005",
      studentName: "David Brown",
      amount: 10000,
      method: "Cash",
      date: "2024-07-08",
      time: "02:15 PM",
    },
    {
      id: "PAY-003",
      invoiceId: "INV-2024-007",
      studentName: "Lisa Garcia",
      amount: 18000,
      method: "Bank Transfer",
      date: "2024-07-05",
      time: "11:45 AM",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-600 border-green-200">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-600 border-red-200">
            Overdue
          </Badge>
        );
      case "partially_paid":
        return (
          <Badge className="bg-blue-100 text-blue-600 border-blue-200">
            Partially Paid
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Draft
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

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Invoice Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student fee invoices, payments, and billing efficiently
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
                Generate Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Invoice</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stu001">
                          John Smith - Grade 10A
                        </SelectItem>
                        <SelectItem value="stu002">
                          Sarah Johnson - Grade 9B
                        </SelectItem>
                        <SelectItem value="stu003">
                          Mike Wilson - Grade 11A
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fee Structure</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly Tuition</SelectItem>
                        <SelectItem value="monthly_lab">
                          Monthly Tuition + Lab
                        </SelectItem>
                        <SelectItem value="monthly_transport">
                          Monthly Tuition + Transport
                        </SelectItem>
                        <SelectItem value="exam">Exam Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input placeholder="Monthly fee for July 2024" />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>
                    <Receipt className="w-4 h-4 mr-2" />
                    Generate Invoice
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {invoiceStats.map((stat, index) => (
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
          <TabsTrigger value="invoices">All Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  Recent Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{invoice.studentName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {invoice.id} • {formatCurrency(invoice.amount)}
                        </p>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full">
                    View All Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{payment.studentName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {payment.method} • {payment.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.time}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full">
                    View All Payments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Collection Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Monthly Collection Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹2,10,500
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Collected This Month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ₹35,300
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pending Amount
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85.7%</div>
                  <div className="text-sm text-muted-foreground">
                    Collection Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Fee Structure</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {invoice.studentName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.studentId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{invoice.class}</TableCell>
                      <TableCell>{invoice.feeStructure}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
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

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.id}
                      </TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>{payment.studentName}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <div>
                          <div>{payment.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.time}
                          </div>
                        </div>
                      </TableCell>
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

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Collection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Invoiced</span>
                    <span className="font-medium">₹2,45,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Collected</span>
                    <span className="font-medium text-green-600">
                      ₹2,10,500
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Collection</span>
                    <span className="font-medium text-orange-600">₹35,300</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Collection Rate</span>
                    <span className="font-medium text-blue-600">85.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      method: "Online Payment",
                      count: 456,
                      percentage: 60,
                      color: "bg-blue-500",
                    },
                    {
                      method: "Bank Transfer",
                      count: 234,
                      percentage: 31,
                      color: "bg-green-500",
                    },
                    {
                      method: "Cash",
                      count: 68,
                      percentage: 9,
                      color: "bg-orange-500",
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {item.method}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
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
