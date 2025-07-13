import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SyllabusForm from "../components/syllabus/SyllabusForm";

const getSyllabuses = async () => {
  const { data, error } = await supabase
    .from("syllabus")
    .select("*, classes(name), subjects(name)");
  if (error) throw new Error(error.message);
  return data;
};

const deleteSyllabus = async (id: string) => {
  const { data, error } = await supabase.from("syllabus").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export default function Syllabus() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState<any>(null);

  const {
    data: syllabuses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["syllabus"],
    queryFn: getSyllabuses,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSyllabus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
    },
  });

  const handleEdit = (syllabus: any) => {
    setSelectedSyllabus(syllabus);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSyllabus(null);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["syllabus"] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Syllabus</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Syllabus</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedSyllabus ? "Edit" : "Add"} Syllabus
              </DialogTitle>
            </DialogHeader>
            <SyllabusForm
              syllabus={selectedSyllabus}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {syllabuses?.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.title}</TableCell>
              <TableCell>{s.classes.name}</TableCell>
              <TableCell>{s.subjects.name}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(s.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
