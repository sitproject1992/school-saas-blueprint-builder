import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSchool } from "@/hooks/useSchool";

type Teacher = {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
  };
};

const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  section: z.string().optional(),
  grade_level: z.coerce.number().optional(),
  capacity: z.coerce.number().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  classItem?: any;
  onSuccess: () => void;
}

const fetchTeachers = async () => {
  const { data, error } = await supabase.from("teachers").select(`
      *,
      profile:profiles(*)
    `);
  if (error) throw new Error(error.message);
  return data as Teacher[];
};

export function ClassForm({ classItem, onSuccess }: ClassFormProps) {
  const queryClient = useQueryClient();
  const { schoolId } = useSchool();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    classItem?.id || "none",
  );

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
    defaultValues: {
      name: classItem?.name || "",
      section: classItem?.section || "",
      grade_level: classItem?.grade_level || undefined,
      capacity: classItem?.capacity || undefined,
    },
  });

  const onSubmit = async (data: ClassFormValues) => {
    try {
      const classData = {
        name: data.name,
        section: data.section || null,
        grade_level: data.grade_level || null,
        capacity: data.capacity || null,
        school_id: schoolId || null,
      };

      if (classItem) {
        const { error } = await supabase
          .from("classes")
          .update(classData)
          .eq("id", classItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("classes").insert(classData);
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
              <Label htmlFor="name">Class Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                {...register("section")}
                placeholder="e.g., A, B, C"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="grade_level">Grade Level</Label>
                <Input
                  id="grade_level"
                  type="number"
                  min="1"
                  max="12"
                  {...register("grade_level")}
                  placeholder="1-12"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  {...register("capacity")}
                  placeholder="Max students"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacher">Class Teacher (Optional)</Label>
              <Select
                value={selectedTeacherId}
                onValueChange={setSelectedTeacherId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No teacher assigned</SelectItem>
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.profile.first_name} {teacher.profile.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
