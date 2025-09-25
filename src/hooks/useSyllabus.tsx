import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from './useSchool';

export interface Syllabus {
  id: string;
  school_id: string;
  subject_id: string;
  class_id: string;
  title: string;
  description: string | null;
  academic_year_id: string | null;
  created_at: string;
  updated_at: string;
  subjects?: { name: string; code: string | null };
  classes?: { name: string; section: string | null };
}

export interface SyllabusInput {
  subject_id: string;
  class_id: string;
  title: string;
  description?: string;
  academic_year_id?: string;
}

export const useSyllabus = () => {
  const { schoolId } = useSchool();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: syllabuses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['syllabus', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('syllabus')
        .select('*, subjects(name, code), classes(name, section)')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
  return (data as any[])?.map((item: any) => ({
    ...item,
    subjects: { name: item.subjects?.name || 'Unknown Subject', code: item.subjects?.code || 'UNK' },
    classes: { name: item.classes?.name || 'Unknown Class' }
  })) || [] as Syllabus[];
    },
    enabled: !!schoolId,
  });

  const createSyllabus = useMutation({
    mutationFn: async (data: SyllabusInput) => {
      if (!schoolId) throw new Error('No active school selected');

      const { data: result, error } = await supabase
        .from('syllabus')
        .insert({
          school_id: schoolId,
          subject_id: data.subject_id,
          class_id: data.class_id,
          title: data.title,
          description: data.description || null,
          academic_year_id: data.academic_year_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
      toast({
        title: 'Success',
        description: 'Syllabus created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create syllabus',
        variant: 'destructive',
      });
    },
  });

  const updateSyllabus = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SyllabusInput> }) => {
      const { data, error } = await supabase
        .from('syllabus')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
      toast({
        title: 'Success',
        description: 'Syllabus updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update syllabus',
        variant: 'destructive',
      });
    },
  });

  const deleteSyllabus = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('syllabus')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
      toast({
        title: 'Success',
        description: 'Syllabus deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete syllabus',
        variant: 'destructive',
      });
    },
  });

  return {
    syllabuses,
    isLoading,
    error,
    createSyllabus: createSyllabus.mutate,
    updateSyllabus: updateSyllabus.mutate,
    deleteSyllabus: deleteSyllabus.mutate,
    isCreating: createSyllabus.isPending,
    isUpdating: updateSyllabus.isPending,
    isDeleting: deleteSyllabus.isPending,
  };
};