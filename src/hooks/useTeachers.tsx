import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Teacher = Tables<'teachers'> & {
  profile: Tables<'profiles'>;
  class?: Tables<'classes'>;
};

type TeacherInsert = TablesInsert<'teachers'> & {
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
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
          profile:profiles(*),
          class:classes(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Teacher[];
    },
  });

  const createTeacher = useMutation({
    mutationFn: async (teacherData: TeacherInsert) => {
      // First create the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          first_name: teacherData.profile.first_name,
          last_name: teacherData.profile.last_name,
          email: teacherData.profile.email,
          phone: teacherData.profile.phone,
          address: teacherData.profile.address,
          date_of_birth: teacherData.profile.date_of_birth,
          role: 'teacher',
          user_id: crypto.randomUUID(), // Temporary - in real app this would come from auth
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create the teacher record
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          profile_id: profile.id,
          qualification: teacherData.qualification,
          experience_years: teacherData.experience_years,
          joining_date: teacherData.joining_date,
          salary: teacherData.salary,
          class_id: teacherData.class_id,
          is_class_teacher: teacherData.is_class_teacher,
          school_id: profile.school_id,
        })
        .select(`
          *,
          profile:profiles(*),
          class:classes(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Success",
        description: "Teacher created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create teacher. Please try again.",
        variant: "destructive",
      });
      console.error('Create teacher error:', error);
    },
  });

  const updateTeacher = useMutation({
    mutationFn: async ({ id, ...teacherData }: Partial<TeacherInsert> & { id: string }) => {
      // Update profile if profile data is provided
      if (teacherData.profile) {
        const teacher = teachers.find(t => t.id === id);
        if (teacher?.profile_id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              first_name: teacherData.profile.first_name,
              last_name: teacherData.profile.last_name,
              email: teacherData.profile.email,
              phone: teacherData.profile.phone,
              address: teacherData.profile.address,
              date_of_birth: teacherData.profile.date_of_birth,
            })
            .eq('id', teacher.profile_id);

          if (profileError) throw profileError;
        }
      }

      // Update teacher record
      const { data, error } = await supabase
        .from('teachers')
        .update({
          qualification: teacherData.qualification,
          experience_years: teacherData.experience_years,
          joining_date: teacherData.joining_date,
          salary: teacherData.salary,
          class_id: teacherData.class_id,
          is_class_teacher: teacherData.is_class_teacher,
        })
        .eq('id', id)
        .select(`
          *,
          profile:profiles(*),
          class:classes(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Success",
        description: "Teacher updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update teacher. Please try again.",
        variant: "destructive",
      });
      console.error('Update teacher error:', error);
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
        title: "Success",
        description: "Teacher deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
        variant: "destructive",
      });
      console.error('Delete teacher error:', error);
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
