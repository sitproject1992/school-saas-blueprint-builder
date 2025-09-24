import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { useSchool } from './useSchool';

export interface Subject {
  id: string;
  school_id: string;
  name: string;
  code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  class_id?: string;
  teacher_id?: string;
  class_name?: string;
  teacher_name?: string;
}

interface SubjectMutation extends Omit<Subject, "id" | "created_at" | "updated_at"> {
  class_id: string;
  teacher_id: string;
}

async function getSubjects(schoolId?: string): Promise<Subject[]> {
  let query = supabase
    .from("subjects")
    .select(`
      *,
      teacher_subjects (
        class_id,
        teacher_id,
        classes ( name ),
        teachers ( profiles ( first_name, last_name ) )
      )
    `)
    .order("name", { ascending: true });

  if (schoolId) {
    query = query.eq("school_id", schoolId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data?.map(s => {
    const assignment = s.teacher_subjects && s.teacher_subjects.length > 0 ? s.teacher_subjects[0] : null;
    const teacher = assignment?.teachers?.profiles;
    return {
      ...s,
      class_id: assignment?.class_id,
      teacher_id: assignment?.teacher_id,
      class_name: assignment?.classes?.name,
      teacher_name: teacher ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() : '',
    }
  }) || [];
}

async function createSubject(
  subject: SubjectMutation,
): Promise<Subject> {
  const { data, error } = await supabase
    .rpc('create_subject_and_assign_teacher', {
      p_name: subject.name,
      p_code: subject.code,
      p_description: subject.description,
      p_school_id: subject.school_id,
      p_class_id: subject.class_id,
      p_teacher_id: subject.teacher_id,
    });

  if (error) throw new Error(error.message);
  return data;
}

async function updateSubject({
  id,
  updates,
}: {
  id: string;
  updates: Partial<SubjectMutation>;
}): Promise<Subject> {
  const { name, code, description, class_id, teacher_id } = updates;

  const { data, error } = await supabase
    .from("subjects")
    .update({ name, code, description })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Only update assignment if class or teacher has changed
  if (class_id || teacher_id) {
    const { error: assignmentError } = await supabase
      .rpc('update_subject_assignment', {
        p_subject_id: id,
        p_class_id: class_id,
        p_teacher_id: teacher_id,
      });

    if (assignmentError) throw new Error(assignmentError.message);
  }

  return data;
}

async function deleteSubject(id: string): Promise<void> {
  const { error } = await supabase.from("subjects").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export function useSubjects() {
  const { schoolId } = useSchool();
  
  return useQuery({
    queryKey: ["subjects", schoolId],
    queryFn: () => getSubjects(schoolId),
    enabled: !!schoolId,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({
        title: "Success",
        description: "Subject created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subject",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({
        title: "Success",
        description: "Subject updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update subject",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({
        title: "Success",
        description: "Subject deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subject",
        variant: "destructive",
      });
    },
  });
}
