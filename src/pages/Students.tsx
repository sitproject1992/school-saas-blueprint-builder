import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStudents } from "@/hooks/useStudents";
import { StudentForm } from "@/components/students/StudentForm";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Students() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const { data: students = [], isLoading, error } = useStudents();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.profiles.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.profiles.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass === "all" || student.class_id === selectedClass;

    return matchesSearch && matchesClass;
  });

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: GraduationCap,
      color: "text-blue-600",
    },
    {
      title: "Active Students",
      value: students.length, // You can add an active status field
      icon: GraduationCap,
      color: "text-green-600",
    },
  ];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const { error } = await supabase.from("students").delete().eq("id", id);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["students"] });
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const openForm = (student = null) => {
    setEditingStudent(student);
    setIsCreateDialogOpen(true);
  };

  const closeForm = () => {
    setEditingStudent(null);
    setIsCreateDialogOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage your school's students</p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Emergency Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {student.profiles.first_name} {student.profiles.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.profiles.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.admission_number}</Badge>
                  </TableCell>
                  <TableCell>
                    {student.classes
                      ? `${student.classes.name}${
                          student.classes.section ? ` - ${student.classes.section}` : ""
                        }`
                      : "Not assigned"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{student.profiles.phone || "N/A"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{student.emergency_contact_name || "N/A"}</div>
                      {student.emergency_contact_phone && (
                        <div className="text-muted-foreground">
                          {student.emergency__contact_phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openForm(student)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <a
                            href={`/students/${student.id}/report-card`}
                            className="flex items-center"
                          >
                            <GraduationCap className="h-4 w-4 mr-2" />
                            View Report Card
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
            <DialogDescription>
              {editingStudent ? "Update student information below." : "Fill in the student information below."}
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            student={editingStudent}
            onSuccess={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}