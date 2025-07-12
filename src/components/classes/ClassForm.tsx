import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  teacher_id: z.coerce.number().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  classItem?: ClassFormValues & { id: number };
  onSuccess: () => void;
}

const fetchTeachers = async () => {
  const { data, error } = await supabase.from("teachers").select("id, first_name, last_name");
  if (error) throw new Error(error.message);
  return data;
};

export function ClassForm({ classItem, onSuccess }: ClassFormProps) {
  const queryClient = useQueryClient();
  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: classItem || {},
  });

  const onSubmit = async (data: ClassFormValues) => {
    try {
      if (classItem) {
        const { error } = await supabase.from("classes").update(data).eq("id", classItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("classes").insert(data);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onSuccess();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{classItem ? "Edit Class" : "Add Class"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Class Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher_id">Teacher</Label>
              <select id="teacher_id" {...register("teacher_id")} className="w-full p-2 border rounded">
                <option value="">Select a teacher</option>
                {teachers?.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full">
              {classItem ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}