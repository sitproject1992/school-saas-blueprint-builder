import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { useSchool } from './useSchool';

export interface Student {
  id: string;
  school_id: string;
  class_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | null;
  admission_number: string;
  digital_id_card_url: string | null;
  health_records: any;
  created_at: string;
  updated_at: string;
  classes: {
    name: string;
    section: string | null;
  } | null;
}

export function useStudents() {
  const { schoolId } = useSchool();
  return useQuery({
    queryKey: ['students', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!students_profile_id_fkey (
            first_name,
            last_name,
            email,
            date_of_birth
          ),
          classes (
            name,
            section
          )
        `)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(student => ({
        id: student.id,
        school_id: student.school_id,
        class_id: student.class_id,
        admission_number: student.admission_number,
        first_name: student.profiles?.first_name || '',
        last_name: student.profiles?.last_name || '',
        email: student.profiles?.email || '',
        date_of_birth: student.profiles?.date_of_birth || null,
        digital_id_card_url: null,
        health_records: student.medical_conditions,
        created_at: student.created_at,
        updated_at: student.updated_at,
        classes: student.classes,
      })) as Student[] || [];
    },
    enabled: !!schoolId,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { schoolId } = useSchool();

  return useMutation({
    mutationFn: async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'classes' | 'school_id'>) => {
      if (!schoolId) throw new Error('No active school selected');
      if (!studentData.class_id) throw new Error('Class is required');

      const { data, error } = await supabase.rpc('create_student_with_profile', {
        p_school_id: schoolId,
        p_class_id: studentData.class_id,
        p_first_name: studentData.first_name,
        p_last_name: studentData.last_name,
        p_email: studentData.email,
        p_date_of_birth: studentData.date_of_birth,
        p_admission_number: studentData.admission_number,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create student',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, student }: { id: string; student: Partial<Student> }) => {
      const { data, error } = await supabase
        .from('students')
        .update(student)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update student',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete student',
        variant: 'destructive',
      });
    },
  });
}