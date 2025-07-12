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

const lessonPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  objectives: z.string().optional(),
  content: z.string().optional(),
  planned_date: z.string().min(1, "Planned date is required"),
  class_id: z.string().min(1, "Class is required"),
  subject_id: z.string().min(1, "Subject is required"),
});

const getLessonPlans = async () => {
  const { data, error } = await supabase.from("lesson_plans").select("*, classes(name), subjects(name)");
  if (error) throw new Error(error.message);
  return data;
};

const createLessonPlan = async (newLessonPlan: z.infer<typeof lessonPlanSchema>) => {
  const { data, error } = await supabase.from("lesson_plans").insert(newLessonPlan).select();
  if (error) throw new Error(error.message);
  return data;
};

const updateLessonPlan = async (updatedLessonPlan: { id: string } & z.infer<typeof lessonPlanSchema>) => {
  const { id, ...rest } = updatedLessonPlan;
  const { data, error } = await supabase.from("lesson_plans").update(rest).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data;
};

const deleteLessonPlan = async (id: string) => {
  const { data, error } = await supabase.from("lesson_plans").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export default function LessonPlans() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<any>(null);

  const { data: lessonPlans, isLoading, error } = useQuery({
    queryKey: ["lessonPlans"],
    queryFn: getLessonPlans,
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
    mutationFn: createLessonPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonPlans"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateLessonPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonPlans"] });
      setOpen(false);
      setSelectedLessonPlan(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLessonPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonPlans"] });
    },
  });

  const form = useForm<z.infer<typeof lessonPlanSchema>>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: {
      title: "",
      objectives: "",
      content: "",
      planned_date: "",
      class_id: "",
      subject_id: "",
    },
  });

  const onSubmit = (values: z.infer<typeof lessonPlanSchema>) => {
    if (selectedLessonPlan) {
      updateMutation.mutate({ id: selectedLessonPlan.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (lessonPlan: any) => {
    setSelectedLessonPlan(lessonPlan);
    form.reset(lessonPlan);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedLessonPlan(null);
    form.reset({
      title: "",
      objectives: "",
      content: "",
      planned_date: "",
      class_id: "",
      subject_id: "",
    });
    setOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lesson Plans</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={handleAddNew}>Add New Lesson Plan</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLessonPlan ? "Edit" : "Add"} Lesson Plan</DialogTitle>
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
                name="objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectives</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="planned_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planned Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                {selectedLessonPlan ? "Update" : "Create"}
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
            <TableHead>Planned Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessonPlans?.map((lp) => (
            <TableRow key={lp.id}>
              <TableCell>{lp.title}</TableCell>
              <TableCell>{lp.classes.name}</TableCell>
              <TableCell>{lp.subjects.name}</TableCell>
              <TableCell>{new Date(lp.planned_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(lp)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(lp.id)}
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
