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
import { ClassForm } from "@/components/classes/ClassForm";
import { useState } from "react";
import { useSchool } from "@/hooks/useSchool";

export default function ClassesPage() {
  const queryClient = useQueryClient();
  const { schoolId } = useSchool();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchClasses = async () => {
    if (!schoolId) return [];
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("school_id", schoolId);
    if (error) throw new Error(error.message);
    return data;
  };

  const { data: classes, isLoading, error } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: fetchClasses,
    enabled: !!schoolId,
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        const { error } = await supabase.from("classes").delete().eq("id", id);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["classes"] });
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const openForm = (classItem = null) => {
    setSelectedClass(classItem);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedClass(null);
    setIsFormOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Button onClick={() => openForm()}>Add Class</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes?.map((classItem) => (
            <TableRow key={classItem.id}>
              <TableCell>{classItem.name}</TableCell>
              <TableCell>{classItem.section || 'N/A'}</TableCell>
              <TableCell>{classItem.capacity || 0}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => openForm(classItem)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(classItem.id)}
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
            <DialogTitle>{selectedClass ? "Edit Class" : "Add Class"}</DialogTitle>
          </DialogHeader>
          <ClassForm classItem={selectedClass} onSuccess={closeForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}