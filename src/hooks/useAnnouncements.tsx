import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from './useSchool';

export interface Announcement {
  id: string;
  school_id: string;
  title: string;
  content: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface AnnouncementInput {
  title: string;
  content?: string;
  published_at?: string;
}

export const useAnnouncements = () => {
  const { schoolId } = useSchool();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: announcements = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['announcements', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('school_id', schoolId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Announcement[];
    },
    enabled: !!schoolId,
  });

  const createAnnouncement = useMutation({
    mutationFn: async (data: AnnouncementInput) => {
      if (!schoolId) throw new Error('No active school selected');

      const { data: result, error } = await supabase
        .from('announcements')
        .insert({
          school_id: schoolId,
          title: data.title,
          content: data.content || null,
          published_at: data.published_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create announcement',
        variant: 'destructive',
      });
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AnnouncementInput> }) => {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: 'Success',
        description: 'Announcement updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update announcement',
        variant: 'destructive',
      });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: 'Success',
        description: 'Announcement deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete announcement',
        variant: 'destructive',
      });
    },
  });

  return {
    announcements,
    isLoading,
    error,
    createAnnouncement: createAnnouncement.mutate,
    updateAnnouncement: updateAnnouncement.mutate,
    deleteAnnouncement: deleteAnnouncement.mutate,
    isCreating: createAnnouncement.isPending,
    isUpdating: updateAnnouncement.isPending,
    isDeleting: deleteAnnouncement.isPending,
  };
};