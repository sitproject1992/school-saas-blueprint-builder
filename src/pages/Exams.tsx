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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const examSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

const getExams = async () => {
  const { data, error } = await supabase.from("exams").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const createExam = async (newExam: z.infer<typeof examSchema>) => {
  const { data, error } = await supabase.from("exams").insert(newExam).select();
  if (error) throw new Error(error.message);
  return data;
};

const updateExam = async (updatedExam: { id: string } & z.infer<typeof examSchema>) => {
  const { id, ...rest } = updatedExam;
  const { data, error } = await supabase.from("exams").update(rest).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data;
};

const deleteExam = async (id: string) => {
  const { data, error } = await supabase.from("exams").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export default function Exams() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ["exams"],
    queryFn: getExams,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setOpen(false);
      setSelectedExam(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  const form = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "",
      type: "",
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = (values: z.infer<typeof examSchema>) => {
    if (selectedExam) {
      updateMutation.mutate({ id: selectedExam.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (exam: any) => {
    setSelectedExam(exam);
    form.reset({
      ...exam,
      start_date: new Date(exam.start_date).toISOString().split("T")[0],
      end_date: new Date(exam.end_date).toISOString().split("T")[0],
    });
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedExam(null);
    form.reset({
      name: "",
      type: "",
      start_date: "",
      end_date: "",
    });
    setOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Exams</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleAddNew}>Add New Exam</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExam ? "Edit" : "Add"} Exam</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {selectedExam ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams?.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{exam.type}</TableCell>
              <TableCell>{new Date(exam.start_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(exam.end_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(exam)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(exam.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      Manage Results
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Class</DialogTitle>
                    </DialogHeader>
                    <div>
                      <select
                        onChange={(e) =>
                          (window.location.href = `/exams/${exam.id}/classes/${e.target.value}/results`)
                        }
                      >
                        <option value="">Select Class</option>
                        {classes?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
