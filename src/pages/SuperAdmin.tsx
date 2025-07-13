import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Activity,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface School {
  id: string;
  name: string;
  subdomain: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription_status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  student_count?: number;
  teacher_count?: number;
  admin_count?: number;
}

export default function SuperAdmin() {
  const { isSuperAdmin } = useTenant();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Fetch all schools
  const { data: schools, isLoading } = useQuery({
    queryKey: ["super-admin-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      
      // Get counts for each school
      const schoolsWithCounts = await Promise.all(
        (data || []).map(async (school) => {
          const [students, teachers, admins] = await Promise.all([
            supabase.from("students").select("*", { count: "exact", head: true }).eq("school_id", school.id),
            supabase.from("teachers").select("*", { count: "exact", head: true }).eq("school_id", school.id),
            supabase.from("users").select("*", { count: "exact", head: true }).eq("school_id", school.id)
          ]);

          return {
            ...school,
            student_count: students.count || 0,
            teacher_count: teachers.count || 0,
            admin_count: admins.count || 0,
          };
        })
      );

      return schoolsWithCounts as School[];
    },
  });

  // System-wide analytics
  const { data: systemStats } = useQuery({
    queryKey: ["super-admin-stats"],
    queryFn: async () => {
      const [
        { count: totalSchools },
        { count: totalStudents },
        { count: totalTeachers },
        { count: totalRevenue }
      ] = await Promise.all([
        supabase.from("schools").select("*", { count: "exact", head: true }),
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("teachers").select("*", { count: "exact", head: true }),
        supabase.from("fee_payments").select("amount", { count: "exact", head: true })
      ]);

      return {
        totalSchools: totalSchools.count || 0,
        totalStudents: totalStudents.count || 0,
        totalTeachers: totalTeachers.count || 0,
        totalRevenue: totalRevenue.count || 0
      };
    },
  });

  // Create school mutation
  const createSchoolMutation = useMutation({
    mutationFn: async (schoolData: { name: string; subdomain: string; email: string; phone: string; address: string; status: string }) => {
      const { data, error } = await supabase
        .from("schools")
        .insert([schoolData])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-schools"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-stats"] });
      toast({
        title: "School created successfully",
        description: "The new school has been added to the system.",
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating school",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update school mutation
  const updateSchoolMutation = useMutation({
    mutationFn: async ({ id, ...schoolData }: { id: string; name?: string; subdomain?: string; email?: string; phone?: string; address?: string; status?: string }) => {
      const { data, error } = await supabase
        .from("schools")
        .update(schoolData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-schools"] });
      toast({
        title: "School updated successfully",
        description: "The school information has been updated.",
      });
      setIsEditDialogOpen(false);
      setSelectedSchool(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating school",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter schools based on search and status
  const filteredSchools = schools?.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || school.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert>
          <AlertDescription>
            You don't have permission to access the Super Admin portal.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Portal</h1>
          <p className="text-muted-foreground">
            Manage all schools and system-wide operations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
              <DialogDescription>
                Create a new school in the system with all necessary details.
              </DialogDescription>
            </DialogHeader>
            <CreateSchoolForm onSubmit={createSchoolMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.totalSchools || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active schools in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students across all schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active teachers in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{systemStats?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total revenue from all schools
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schools Management */}
      <Tabs defaultValue="schools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Schools List */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="text-center py-8">Loading schools...</div>
            ) : filteredSchools?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No schools found matching your criteria.
              </div>
            ) : (
              filteredSchools?.map((school) => (
                <Card key={school.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{school.name}</span>
                          <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                            {school.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {school.subdomain}.skooler.com • {school.email}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSchool(school);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Students:</span> {school.student_count || 0}
                      </div>
                      <div>
                        <span className="font-medium">Teachers:</span> {school.teacher_count || 0}
                      </div>
                      <div>
                        <span className="font-medium">Admins:</span> {school.admin_count || 0}
                      </div>
                      <div>
                        <span className="font-medium">Plan:</span> {school.subscription_plan || 'Basic'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>
                Comprehensive analytics across all schools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                System settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit School Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>
              Update school information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <EditSchoolForm 
              school={selectedSchool} 
              onSubmit={(data) => updateSchoolMutation.mutate({ id: selectedSchool.id, ...data })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create School Form Component
function CreateSchoolForm({ onSubmit }: { onSubmit: (data: { name: string; subdomain: string; email: string; phone: string; address: string; status: string }) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    email: "",
    phone: "",
    address: "",
    status: "active" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">School Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="subdomain">Subdomain</Label>
          <Input
            id="subdomain"
            value={formData.subdomain}
            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
            placeholder="school-name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full px-3 py-2 border border-input rounded-md"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <DialogFooter>
        <Button type="submit">Create School</Button>
      </DialogFooter>
    </form>
  );
}

// Edit School Form Component
function EditSchoolForm({ school, onSubmit }: { school: School; onSubmit: (data: { name?: string; subdomain?: string; email?: string; phone?: string; address?: string; status?: string }) => void }) {
  const [formData, setFormData] = useState({
    name: school.name,
    subdomain: school.subdomain,
    email: school.email,
    phone: school.phone,
    address: school.address,
    status: school.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">School Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-subdomain">Subdomain</Label>
          <Input
            id="edit-subdomain"
            value={formData.subdomain}
            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-address">Address</Label>
        <Textarea
          id="edit-address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-status">Status</Label>
        <select
          id="edit-status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full px-3 py-2 border border-input rounded-md"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <DialogFooter>
        <Button type="submit">Update School</Button>
      </DialogFooter>
    </form>
  );
}