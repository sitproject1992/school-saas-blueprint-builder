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
import { useStudents, useDeleteStudent } from "@/hooks/useStudents";

export default function StudentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: students, isLoading, error } = useStudents();
  const deleteStudent = useDeleteStudent();

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
            <TableHead>Class</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.profiles?.first_name}</TableCell>
              <TableCell>{student.profiles?.last_name}</TableCell>
              <TableCell>{student.profiles?.email}</TableCell>
              <TableCell>{student.classes?.name || "No class assigned"}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => openForm(student)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(student.id)}
                  className="ml-2"
                  disabled={deleteStudent.isPending}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStudent ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <StudentForm student={selectedStudent} onSuccess={closeForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}