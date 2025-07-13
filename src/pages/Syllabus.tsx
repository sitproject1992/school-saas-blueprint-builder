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
import { useSchool } from "@/hooks/useSchool";

const syllabusSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  file_url: z.string().optional(),
  class_id: z.string().min(1, "Class is required"),
  subject_id: z.string().min(1, "Subject is required"),
});

const getSyllabuses = async () => {
  const { data, error } = await supabase
    .from("syllabus")
    .select("*, classes(name), subjects(name)");
  if (error) throw new Error(error.message);
  return data;
};

const createSyllabus = async (
  newSyllabus: z.infer<typeof syllabusSchema> & { school_id: string },
) => {
  const { data, error } = await supabase
    .from("syllabus")
    .insert(newSyllabus)
    .select();
  if (error) throw new Error(error.message);
  return data;
};

const updateSyllabus = async (
  updatedSyllabus: { id: string } & z.infer<typeof syllabusSchema>,
) => {
  const { id, ...rest } = updatedSyllabus;
  const { data, error } = await supabase
    .from("syllabus")
    .update(rest)
    .eq("id", id)
    .select();
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
  const { user } = useAuth();
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

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subjects").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createSyllabus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSyllabus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
      setOpen(false);
      setSelectedSyllabus(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSyllabus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
    },
  });

  const form = useForm<z.infer<typeof syllabusSchema>>({
    resolver: zodResolver(syllabusSchema),
    defaultValues: {
      title: "",
      description: "",
      file_url: "",
      class_id: "",
      subject_id: "",
    },
  });

  const onSubmit = (values: z.infer<typeof syllabusSchema>) => {
    if (selectedSyllabus) {
      updateMutation.mutate({ id: selectedSyllabus.id, ...values });
    } else {
      createMutation.mutate({ ...values, school_id: "your_school_id" });
    }
  };

  const handleEdit = (syllabus: any) => {
    setSelectedSyllabus(syllabus);
    form.reset(syllabus);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSyllabus(null);
    form.reset({
      title: "",
      description: "",
      file_url: "",
      class_id: "",
      subject_id: "",
    });
    setOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Syllabus</h1>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <select {...field}>
                        <option value="">Select Class</option>
                        {classes?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <select {...field}>
                        <option value="">Select Subject</option>
                        {subjects?.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {selectedSyllabus ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
