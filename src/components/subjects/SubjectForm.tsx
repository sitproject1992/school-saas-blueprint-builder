import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useClasses } from "@/hooks/useClasses";
import { useTeachers } from "@/hooks/useTeachers";
import { useCreateSubject, useUpdateSubject } from "@/hooks/useSubjects";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  teacher_id: z.string().optional(),
  class_id: z.string().optional(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subject?: any;
  onSuccess: () => void;
}

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { data: classes } = useClasses();
  const { data: teachers } = useTeachers();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: subject ? {
      name: subject.name || "",
      teacher_id: subject.teacher_id || "",
      class_id: subject.class_id || "",
    } : {},
  });

  const onSubmit = async (data: SubjectFormValues) => {
    try {
      if (subject) {
        await updateSubject.mutateAsync({
          id: subject.id,
          updates: {
            name: data.name,
            teacher_id: data.teacher_id || null,
            class_id: data.class_id || null,
          }
        });
      } else {
        await createSubject.mutateAsync({
          name: data.name,
          teacher_id: data.teacher_id || null,
          class_id: data.class_id || null,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subject ? "Edit Subject" : "Add Subject"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher_id">Teacher</Label>
              <Select value={watch("teacher_id")} onValueChange={(value) => setValue("teacher_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="class_id">Class</Label>
              <Select value={watch("class_id")} onValueChange={(value) => setValue("class_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createSubject.isPending || updateSubject.isPending}>
            {subject ? "Update Subject" : "Add Subject"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
