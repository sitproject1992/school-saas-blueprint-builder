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
import { useSchool } from "@/hooks/useSchool";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  class_id: z.string().min(1, "Class is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subject?: any;
  onSuccess: () => void;
}

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { data: classes } = useClasses();
  const { teachers } = useTeachers();
  const { schoolId } = useSchool();
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
      code: subject.code || "",
      description: subject.description || "",
      class_id: subject.class_id || "",
      teacher_id: subject.teacher_id || "",
    } : {
      name: "",
      code: "",
      description: "",
      class_id: "",
      teacher_id: "",
    },
  });

  const onSubmit = async (data: SubjectFormValues) => {
    try {
      if (subject) {
        await updateSubject.mutateAsync({
          id: subject.id,
          updates: {
            name: data.name,
            code: data.code || null,
            description: data.description || null,
            class_id: data.class_id,
            teacher_id: data.teacher_id,
          }
        });
      } else {
        if (!schoolId) throw new Error('No school selected');
        await createSubject.mutateAsync({
          name: data.name,
          code: data.code || null,
          description: data.description || null,
          school_id: schoolId,
          class_id: data.class_id,
          teacher_id: data.teacher_id,
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

          <div className="grid gap-2">
            <Label htmlFor="code">Subject Code</Label>
            <Input id="code" {...register("code")} />
            {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="class_id">Class</Label>
              <Select onValueChange={(value) => setValue("class_id", value)} defaultValue={watch("class_id")}>
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
              {errors.class_id && <p className="text-red-500 text-sm">{errors.class_id.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher_id">Teacher</Label>
              <Select onValueChange={(value) => setValue("teacher_id", value)} defaultValue={watch("teacher_id")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.profiles?.first_name} {teacher.profiles?.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teacher_id && <p className="text-red-500 text-sm">{errors.teacher_id.message}</p>}
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
