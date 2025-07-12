import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const studentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  class_id: z.coerce.number().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: StudentFormValues & { id: number };
  onSuccess: () => void;
}

export function StudentForm({ student, onSuccess }: StudentFormProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {},
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      if (student) {
        const { error } = await supabase.from("students").update(data).eq("id", student.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("students").insert(data);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onSuccess();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student ? "Edit Student" : "Add Student"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" {...register("first_name")} />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" {...register("last_name")} />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
              {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="class_id">Class</Label>
              {/* In a real app, this would be a select with a list of classes */}
              <Input id="class_id" type="number" {...register("class_id")} />
            </div>
            <Button type="submit" className="w-full">
              {student ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}