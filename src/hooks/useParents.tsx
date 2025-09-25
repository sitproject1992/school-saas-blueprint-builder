import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from './useSchool';

export interface Parent {
  id: string;
  school_id: string;
  profile_id: string;
  occupation: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
}

export function useParents() {
  const { schoolId } = useSchool();
  
  return useQuery({
    queryKey: ['parents', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('parents')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching parents:', error);
        return [];
      }
      return data?.map(parent => ({
        ...parent,
        profiles: parent.profiles || {
          first_name: '',
          last_name: '',
          email: '',
          phone: null
        }
      })) as Parent[] || [];
    },
    enabled: !!schoolId,
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { schoolId } = useSchool();

  return useMutation({
    mutationFn: async (parentData: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      occupation?: string;
    }) => {
      if (!schoolId) throw new Error('No active school selected');

      const { data, error } = await supabase.rpc('create_parent_with_profile', {
        p_school_id: schoolId,
        p_first_name: parentData.first_name,
        p_last_name: parentData.last_name,
        p_email: parentData.email,
        p_phone: parentData.phone || null,
        p_occupation: parentData.occupation || null,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast({
        title: 'Success',
        description: 'Parent created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create parent',
        variant: 'destructive',
      });
    },
  });
}

export function useLinkParentToStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (linkData: {
      parent_id: string;
      student_id: string;
      relationship?: string;
    }) => {
      const { error } = await supabase.rpc('link_parent_to_student', {
        p_parent_id: linkData.parent_id,
        p_student_id: linkData.student_id,
        p_relationship: linkData.relationship || 'parent',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Parent linked to student successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to link parent to student',
        variant: 'destructive',
      });
    },
  });
}