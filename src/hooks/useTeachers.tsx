import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { useSchool } from './useSchool';

export interface Teacher {
  id: string;
  school_id: string;
  profile_id: string;
  class_id: string | null;
  qualification: string | null;
  experience_years: number | null;
  salary: number | null;
  is_class_teacher: boolean | null;
  joining_date: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
}

export const useTeachers = () => {
  const { schoolId } = useSchool();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: teachers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teachers', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          profiles!teachers_profile_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Teacher[];
    },
    enabled: !!schoolId,
  });

  const createTeacher = useMutation({
    mutationFn: async (teacherData: { first_name: string; last_name: string; email: string; qualification?: string; experience_years?: number; salary?: number; class_id?: string }) => {
      if (!schoolId) throw new Error('No active school selected');

      // First create a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          first_name: teacherData.first_name,
          last_name: teacherData.last_name,
          email: teacherData.email,
          role: 'teacher',
          school_id: schoolId,
          // Don't set user_id for teachers created through admin panel
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create the teacher record
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          profile_id: profile.id,
          school_id: schoolId,
          qualification: teacherData.qualification,
          experience_years: teacherData.experience_years,
          salary: teacherData.salary,
          class_id: teacherData.class_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create teacher',
        variant: 'destructive',
      });
    },
  });

  const updateTeacher = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Teacher> }) => {
      const { data, error } = await supabase
        .from('teachers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update teacher',
        variant: 'destructive',
      });
    },
  });

  const deleteTeacher = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete teacher',
        variant: 'destructive',
      });
    },
  });

  return {
    teachers,
    isLoading,
    error,
    createTeacher: createTeacher.mutate,
    updateTeacher: updateTeacher.mutate,
    deleteTeacher: deleteTeacher.mutate,
    isCreating: createTeacher.isPending,
    isUpdating: updateTeacher.isPending,
    isDeleting: deleteTeacher.isPending,
  };
};
