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
import { useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
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

const examResultSchema = z.object({
  results: z.array(
    z.object({
      student_id: z.string(),
      marks_obtained: z.coerce.number(),
      max_marks: z.coerce.number(),
      grade: z.string(),
    })
  ),
});

const getExamResults = async (examId: string) => {
  const { data, error } = await supabase
    .from("exam_results")
    .select("*, students(*, profiles(*))")
    .eq("exam_id", examId);
  if (error) throw new Error(error.message);
  return data;
};

const getStudentsByClass = async (classId: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*, profiles(*)")
    .eq("class_id", classId);
  if (error) throw new Error(error.message);
  return data;
};

const createExamResults = async ({
  examId,
  results,
}: {
  examId: string;
  results: z.infer<typeof examResultSchema>["results"];
}) => {
  const resultsWithExamId = results.map((r) => ({ ...r, exam_id: examId }));
  const { data, error } = await supabase.from("exam_results").insert(resultsWithExamId).select();
  if (error) throw new Error(error.message);
  return data;
};

export default function ExamResults() {
  const { examId, classId } = useParams();
  const queryClient = useQueryClient();

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", classId],
    queryFn: () => getStudentsByClass(classId!),
    enabled: !!classId,
  });

  const { data: examResults, isLoading: isLoadingExamResults } = useQuery({
    queryKey: ["examResults", examId],
    queryFn: () => getExamResults(examId!),
    enabled: !!examId,
  });

  const form = useForm<z.infer<typeof examResultSchema>>({
    resolver: zodResolver(examResultSchema),
    defaultValues: {
      results: [],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "results",
  });

  useState(() => {
    if (students && !examResults?.length) {
      students.forEach((student) => {
        append({
          student_id: student.id,
          marks_obtained: 0,
          max_marks: 100,
          grade: "",
        });
      });
    } else if (examResults) {
      form.reset({ results: examResults });
    }
  }, [students, examResults]);

  const createMutation = useMutation({
    mutationFn: createExamResults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examResults", examId] });
    },
  });

  const onSubmit = (values: z.infer<typeof examResultSchema>) => {
    createMutation.mutate({ examId: examId!, results: values.results });
  };

  if (isLoadingStudents || isLoadingExamResults) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Exam Results</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Marks Obtained</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const student = students?.find((s) => s.id === field.student_id);
                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      {student?.profiles?.first_name} {student?.profiles?.last_name}
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`results.${index}.marks_obtained`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`results.${index}.max_marks`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`results.${index}.grade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button type="submit" className="mt-4">
            Save Results
          </Button>
        </form>
      </Form>
    </div>
  );
}
