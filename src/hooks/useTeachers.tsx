import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { useSchool } from './useSchool';

export interface Teacher {
  id: string;
  user_id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | null;
  hire_date: string | null;
  contract_details: string | null;
  leave_balance: any;
  created_at: string;
  updated_at: string;
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
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Teacher[];
    },
    enabled: !!schoolId,
  });

  const createTeacher = useMutation({
    mutationFn: async (teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at' | 'school_id'>) => {
      if (!schoolId) throw new Error('No active school selected');

      const { data, error } = await supabase
        .from('teachers')
        .insert({ ...teacherData, school_id: schoolId })
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
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
