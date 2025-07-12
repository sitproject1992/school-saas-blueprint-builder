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
import { TeacherForm } from "@/components/teachers/TeacherForm";
import { useState } from "react";

const fetchTeachers = async () => {
  const { data, error } = await supabase.from("teachers").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export default function TeachersPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const { error } = await supabase.from("teachers").delete().eq("id", id);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const openForm = (teacher = null) => {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedTeacher(null);
    setIsFormOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Button onClick={() => openForm()}>Add Teacher</Button>
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
          {teachers?.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.first_name}</TableCell>
              <TableCell>{teacher.last_name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => openForm(teacher)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(teacher.id)}
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
            <DialogTitle>{selectedTeacher ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
          </DialogHeader>
          <TeacherForm teacher={selectedTeacher} onSuccess={closeForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
