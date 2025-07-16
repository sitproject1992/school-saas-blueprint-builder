import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateStudent, useUpdateStudent, Student } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";

const studentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  date_of_birth: z.string().optional(),
  class_id: z.string().optional(),
  admission_number: z.string().optional(),
  digital_id_card_url: z.string().optional(),
  health_records: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student;
  onSuccess: () => void;
}

export function StudentForm({ student, onSuccess }: StudentFormProps) {
  const { data: classes } = useClasses();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {},
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      if (student) {
        await updateStudent.mutateAsync({
          id: student.id,
          student: data,
        });
      } else {
        await createStudent.mutateAsync({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          date_of_birth: data.date_of_birth,
          class_id: data.class_id,
          admission_number: data.admission_number || `STU${Date.now()}`,
          digital_id_card_url: data.digital_id_card_url || '',
          health_records: data.health_records || '',
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student ? "Edit Student" : "Add Student"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
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
                      {cls.name} {cls.section ? `- ${cls.section}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="admission_number">Admission Number</Label>
            <Input id="admission_number" {...register("admission_number")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="digital_id_card_url">Digital ID Card URL</Label>
            <Input id="digital_id_card_url" {...register("digital_id_card_url")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="health_records">Health Records</Label>
            <Input id="health_records" {...register("health_records")} />
          </div>
          
          <Button type="submit" className="w-full" disabled={createStudent.isPending || updateStudent.isPending}>
            {student ? "Update Student" : "Add Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}