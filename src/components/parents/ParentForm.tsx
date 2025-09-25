import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateParent, useLinkParentToStudent, Parent } from "@/hooks/useParents";
import { useStudents } from "@/hooks/useStudents";

const parentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  student_ids: z.array(z.string()).optional(),
});

type ParentFormValues = z.infer<typeof parentSchema>;

interface ParentFormProps {
  parent?: Parent;
  onSuccess: () => void;
}

export function ParentForm({ parent, onSuccess }: ParentFormProps) {
  const { data: students } = useStudents();
  const createParent = useCreateParent();
  const linkParentToStudent = useLinkParentToStudent();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    defaultValues: parent ? {
      first_name: parent.profiles?.first_name || '',
      last_name: parent.profiles?.last_name || '',
      email: parent.profiles?.email || '',
      phone: parent.profiles?.phone || '',
      occupation: parent.occupation || '',
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      occupation: '',
      student_ids: [],
    },
  });

  const onSubmit = async (data: ParentFormValues) => {
    try {
      const parentId = await createParent.mutateAsync({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        occupation: data.occupation,
      });

      // Link parent to selected students
      if (data.student_ids && data.student_ids.length > 0) {
        for (const studentId of data.student_ids) {
          await linkParentToStudent.mutateAsync({
            parent_id: parentId,
            student_id: studentId,
          });
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving parent:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{parent ? "Edit Parent" : "Add Parent"}</CardTitle>
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
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" {...register("occupation")} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Students to Link</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {students?.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    onChange={(e) => {
                      const currentIds = watch("student_ids") || [];
                      if (e.target.checked) {
                        setValue("student_ids", [...currentIds, student.id]);
                      } else {
                        setValue("student_ids", currentIds.filter(id => id !== student.id));
                      }
                    }}
                  />
                  <Label htmlFor={`student-${student.id}`} className="text-sm">
                    {student.first_name} {student.last_name} ({student.admission_number})
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={createParent.isPending}>
            {parent ? "Update Parent" : "Add Parent"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}