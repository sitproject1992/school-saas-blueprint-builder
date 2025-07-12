import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { StudentForm } from "@/components/students/StudentForm";
import { useState } from "react";

const fetchStudents = async () => {
  const { data, error } = await supabase.from("students").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: students, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const { error } = await supabase.from("students").delete().eq("id", id);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["students"] });
      } catch (error: any) {
        alert(error.message);
      }
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button onClick={() => openForm()}>Add Student</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.first_name}</TableCell>
              <TableCell>{student.last_name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => openForm(student)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(student.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStudent ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <StudentForm student={selectedStudent} onSuccess={closeForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}