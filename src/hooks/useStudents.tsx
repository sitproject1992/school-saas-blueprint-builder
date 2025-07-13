import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  profile_id: string;
  school_id: string;
  class_id: string | null;
  admission_number: string;
  admission_date: string | null;
  blood_group: string | null;
  medical_conditions: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
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
  classes: {
    name: string;
    section: string | null;
  } | null;
}

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles:profile_id (
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address
          ),
          classes:class_id (
            name,
            section
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Student[];
    }
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      student: {
        admission_number: string;
        admission_date?: string;
        class_id?: string;
        blood_group?: string;
        medical_conditions?: string;
        emergency_contact_name?: string;
        emergency_contact_phone?: string;
      };
      profile: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
        date_of_birth?: string;
        address?: string;
      };
    }) => {
      // Create a user account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.profile.email,
        password: Math.random().toString(36).slice(-8), // Temporary password
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('Failed to create user');

      // Create the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          ...data.profile,
          role: 'student'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create the student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          profile_id: profile.id,
          school_id: profile.school_id || '1', // Default school
          ...data.student
        })
        .select()
        .single();

      if (studentError) throw studentError;
      return student;
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