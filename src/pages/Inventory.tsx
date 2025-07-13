import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BookOpen,
  Laptop,
  TestTube,
  Wrench,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  MapPin,
} from "lucide-react";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const categories = [
    {
      id: "books",
      name: "Books & Materials",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: Laptop,
      color: "text-purple-600",
    },
    {
      id: "lab",
      name: "Lab Equipment",
      icon: TestTube,
      color: "text-green-600",
    },
    {
      id: "maintenance",
      name: "Maintenance",
      icon: Wrench,
      color: "text-orange-600",
    },
    {
      id: "furniture",
      name: "Furniture",
      icon: Building,
      color: "text-gray-600",
    },
  ];

  const inventoryItems = [
    {
      id: "INV001",
      name: "Mathematics Textbooks - Grade 10",
      category: "books",
      quantity: 150,
      available: 125,
      location: "Library - Section A",
      condition: "good",
      purchaseDate: "2024-01-15",
      value: 45000,
      assignedTo: "Mathematics Department",
      lastUpdated: "2024-12-20",
    },
    {
      id: "INV002",
      name: "Dell Laptops - Student Lab",
      category: "electronics",
      quantity: 30,
      available: 28,
      location: "Computer Lab 1",
      condition: "excellent",
      purchaseDate: "2024-03-10",
      value: 1500000,
      assignedTo: "IT Department",
      lastUpdated: "2024-12-19",
    },
    {
      id: "INV003",
      name: "Microscopes - Biology Lab",
      category: "lab",
      quantity: 12,
      available: 11,
      location: "Biology Lab",
      condition: "good",
      purchaseDate: "2023-08-20",
      value: 240000,
      assignedTo: "Science Department",
      lastUpdated: "2024-12-18",
    },
    {
      id: "INV004",
      name: "Projectors - Smart Classroom",
      category: "electronics",
      quantity: 25,
      available: 23,
      location: "Various Classrooms",
      condition: "good",
      purchaseDate: "2024-02-05",
      value: 625000,
      assignedTo: "Academic Department",
      lastUpdated: "2024-12-17",
    },
    {
      id: "INV005",
      name: "Student Desks",
      category: "furniture",
      quantity: 200,
      available: 195,
      location: "Storage Room B",
      condition: "fair",
      purchaseDate: "2023-05-15",
      value: 400000,
      assignedTo: "Maintenance Team",
      lastUpdated: "2024-12-16",
    },
  ];

  const getStatusColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "poor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (condition: string) => {
    switch (condition) {
      case "excellent":
        return <CheckCircle className="w-4 h-4" />;
      case "good":
        return <CheckCircle className="w-4 h-4" />;
      case "fair":
        return <Clock className="w-4 h-4" />;
      case "poor":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.condition === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0);
  const totalItems = inventoryItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const availableItems = inventoryItems.reduce(
    (sum, item) => sum + item.available,
    0,
  );
  const lowStockItems = inventoryItems.filter(
    (item) => item.available / item.quantity < 0.2,
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage school assets, equipment, and supplies
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Enter the details for the new inventory item
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input id="item-name" placeholder="Enter item name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-id">Item ID</Label>
                    <Input id="item-id" placeholder="INV001" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Storage location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Total Value (₹)</Label>
                    <Input id="value" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Item description and notes"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Ready for use</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalValue / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">Asset valuation</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Category Overview</CardTitle>
          <CardDescription>
            Inventory distribution across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const categoryItems = inventoryItems.filter(
                (item) => item.category === category.id,
              );
              const categoryValue = categoryItems.reduce(
                (sum, item) => sum + item.value,
                0,
              );
              const categoryQuantity = categoryItems.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );

              return (
                <div
                  key={category.id}
                  className="p-4 bg-muted/30 rounded-lg text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-white rounded-lg">
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <div className="text-lg font-bold">{categoryQuantity}</div>
                  <div className="text-xs text-muted-foreground">
                    ₹{(categoryValue / 1000).toFixed(0)}K
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Manage and track all inventory items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const category = categories.find(
                    (cat) => cat.id === item.category,
                  );
                  const utilization = (
                    ((item.quantity - item.available) / item.quantity) *
                    100
                  ).toFixed(0);

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {item.id}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Assigned to: {item.assignedTo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {category && (
                            <category.icon
                              className={`h-4 w-4 ${category.color}`}
                            />
                          )}
                          <span className="text-sm">{category?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {item.available}/{item.quantity}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {utilization}% in use
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {item.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(item.condition)}
                        >
                          {getStatusIcon(item.condition)}
                          <span className="ml-1 capitalize">
                            {item.condition}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ₹{item.value.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
