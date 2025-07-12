import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateClass, useUpdateClass } from "@/hooks/useClasses";

const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  section: z.string().optional(),
  grade_level: z.number().min(1).max(12).optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").default(30),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  classData?: any;
  onSuccess: () => void;
}

export function ClassForm({ classData, onSuccess }: ClassFormProps) {
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: classData?.name || "",
      section: classData?.section || "",
      grade_level: classData?.grade_level || undefined,
      capacity: classData?.capacity || 30,
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    try {
      const formData = {
        name: data.name,
        section: data.section,
        grade_level: data.grade_level,
        capacity: data.capacity
      };

      if (classData) {
        // Update existing class
        await updateClass.mutateAsync({
          id: classData.id,
          updates: formData
        });
      } else {
        // Create new class
        await createClass.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Mathematics, Science" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., A, B, C" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="grade_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Level</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="1-12" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    placeholder="30" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={createClass.isPending || updateClass.isPending}>
            {createClass.isPending || updateClass.isPending ? "Saving..." : classData ? "Update Class" : "Create Class"}
          </Button>
        </div>
      </form>
    </Form>
  );
}