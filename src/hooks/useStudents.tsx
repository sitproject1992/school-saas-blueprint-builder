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

      // First create a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          email: studentData.email,
          date_of_birth: studentData.date_of_birth,
          role: 'student',
          school_id: schoolId,
          user_id: crypto.randomUUID(), // This should be a real user ID in production
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create the student record
      const { data, error } = await supabase
        .from('students')
        .insert({
          admission_number: studentData.admission_number,
          class_id: studentData.class_id,
          medical_conditions: studentData.health_records,
          school_id: schoolId,
          profile_id: profile.id,
        })
        .select()
        .single();

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