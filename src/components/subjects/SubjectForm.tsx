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
    } : {},
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
          }
        });
      } else {
        if (!schoolId) throw new Error('No school selected');
        await createSubject.mutateAsync({
          name: data.name,
          code: data.code || null,
          description: data.description || null,
          school_id: schoolId,
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

          <Button type="submit" className="w-full" disabled={createSubject.isPending || updateSubject.isPending}>
            {subject ? "Update Subject" : "Add Subject"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
