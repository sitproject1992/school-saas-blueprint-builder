import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Teacher {
  id: string;
  profile_id: string;
  school_id: string;
  class_id: string | null;
  experience_years: number | null;
  is_class_teacher: boolean | null;
  joining_date: string | null;
  qualification: string | null;
  salary: number | null;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    address: string | null;
  };
}

type TeacherInsert = {
  class_id?: string;
  experience_years?: number;
  is_class_teacher?: boolean;
  joining_date?: string;
  qualification?: string;
  salary?: number;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: string | null;
  };
};

export const useTeachers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: teachers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          profiles:profile_id (
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Teacher[];
    },
  });

  const createTeacher = useMutation({
    mutationFn: async (teacherData: TeacherInsert) => {
      // Create a user account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: teacherData.profile.email,
        password: Math.random().toString(36).slice(-8), // Temporary password
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('Failed to create user');

      // Create the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          ...teacherData.profile,
          role: 'teacher'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create the teacher record
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          profile_id: profile.id,
          school_id: profile.school_id || '1', // Default school
          class_id: teacherData.class_id,
          experience_years: teacherData.experience_years,
          is_class_teacher: teacherData.is_class_teacher,
          joining_date: teacherData.joining_date,
          qualification: teacherData.qualification,
          salary: teacherData.salary,
        })
        .select()
        .single();

      if (teacherError) throw teacherError;
      return teacher;
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
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
