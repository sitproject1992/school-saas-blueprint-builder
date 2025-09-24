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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useSchool } from "@/hooks/useSchool";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import { useSyllabus } from "@/hooks/useSyllabus";

const lessonPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  objectives: z.string().optional(),
  content: z.string().optional(),
  planned_date: z.string().min(1, "Planned date is required"),
  class_id: z.string().min(1, "Class is required"),
  subject_id: z.string().min(1, "Subject is required"),
  syllabus_id: z.string().optional(),
});

export default function LessonPlans() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { schoolId } = useSchool();
  const [open, setOpen] = useState(false);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<any>(null);

  const { data: classes } = useClasses();
  const { data: subjects } = useSubjects();
  const { syllabuses } = useSyllabus();

  const {
    data: lessonPlans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessonPlans", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("lesson_plans")
        .select("*, classes(name), subjects(name), syllabus(title)")
        .eq("school_id", schoolId);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!schoolId,
  });

  const createLessonPlan = async (
    newLessonPlan: z.infer<typeof lessonPlanSchema> & { teacher_id: string },
  ) => {
    const { data, error } = await supabase
      .from("lesson_plans")
      .insert({
        ...newLessonPlan,
        school_id: schoolId,
        teacher_id: user?.id,
      })
      .select();
    if (error) throw new Error(error.message);
    return data;
  };

  const updateLessonPlan = async (
    updatedLessonPlan: { id: string } & z.infer<typeof lessonPlanSchema>,
  ) => {
    const { id, ...rest } = updatedLessonPlan;
    const { data, error } = await supabase
      .from("lesson_plans")
      .update(rest)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);
    return data;
  };

  const deleteLessonPlan = async (id: string) => {
    const { data, error } = await supabase
      .from("lesson_plans")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data;
  };

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
    // Validate required fields
    if (!values.title || !values.planned_date || !values.class_id || !values.subject_id) {
      return;
    }
    
    if (selectedLessonPlan) {
      updateMutation.mutate({ id: selectedLessonPlan.id, ...values });
    } else {
      createMutation.mutate({ ...values, teacher_id: user.id });
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
      syllabus_id: "",
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
            <DialogTitle>
              {selectedLessonPlan ? "Edit" : "Add"} Lesson Plan
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="syllabus_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Syllabus</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Syllabus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {syllabuses?.map((syllabus) => (
                          <SelectItem key={syllabus.id} value={syllabus.id}>
                            {syllabus.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            <TableHead>Syllabus</TableHead>
            <TableHead>Planned Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessonPlans?.map((lp) => (
            <TableRow key={lp.id}>
              <TableCell>{lp.title}</TableCell>
              <TableCell>{lp.classes?.name}</TableCell>
              <TableCell>{lp.subjects?.name}</TableCell>
              <TableCell>{lp.syllabus?.title || 'N/A'}</TableCell>
              <TableCell>
                {new Date(lp.planned_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(lp)}
                >
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
