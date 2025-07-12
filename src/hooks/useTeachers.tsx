import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Teacher } from "@/integrations/supabase/types";

// Fetch all teachers
const getTeachers = async () => {
  const { data, error } = await supabase.from("teachers").select("*");
  if (error) throw new Error(error.message);
  return data;
};

// Add a new teacher
const addTeacher = async (teacher: Omit<Teacher, "id" | "created_at">) => {
  const { data, error } = await supabase.from("teachers").insert(teacher).select();
  if (error) throw new Error(error.message);
  return data;
};

// Update an existing teacher
const updateTeacher = async (teacher: Teacher) => {
  const { data, error } = await supabase
    .from("teachers")
    .update(teacher)
    .eq("id", teacher.id)
    .select();
  if (error) throw new Error(error.message);
  return data;
};

// Delete a teacher
const deleteTeacher = async (id: number) => {
  const { data, error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export const useTeachers = () => {
  const queryClient = useQueryClient();

  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const addTeacherMutation = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  const updateTeacherMutation = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  return {
    teachers,
    isLoading,
    error,
    addTeacher: addTeacherMutation.mutate,
    updateTeacher: updateTeacherMutation.mutate,
    deleteTeacher: deleteTeacherMutation.mutate,
  };
};
