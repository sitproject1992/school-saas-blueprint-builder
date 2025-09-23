import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from './useSchool';

export interface FeeStructure {
  id: string;
  school_id: string;
  name: string;
  amount: number;
  frequency: string;
  class_id: string | null;
  description: string | null;
  is_active: boolean;
  due_day: number;
  created_at: string;
  updated_at: string;
}

export interface FeeStructureInput {
  name: string;
  amount: number;
  frequency: string;
  class_id?: string;
  description?: string;
  due_day?: number;
}

export const useFeeStructures = () => {
  const { schoolId } = useSchool();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: feeStructures = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fee_structures', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('fee_structures')
        .select('*')
        .eq('school_id', schoolId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FeeStructure[];
    },
    enabled: !!schoolId,
  });

  const createFeeStructure = useMutation({
    mutationFn: async (feeData: FeeStructureInput) => {
      if (!schoolId) throw new Error('No active school selected');

      const { data, error } = await supabase
        .from('fee_structures')
        .insert({
          school_id: schoolId,
          name: feeData.name,
          amount: feeData.amount,
          frequency: feeData.frequency,
          class_id: feeData.class_id || null,
          description: feeData.description || null,
          due_day: feeData.due_day || 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee_structures'] });
      toast({
        title: 'Success',
        description: 'Fee structure created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create fee structure',
        variant: 'destructive',
      });
    },
  });

  const updateFeeStructure = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FeeStructureInput> }) => {
      const { data, error } = await supabase
        .from('fee_structures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee_structures'] });
      toast({
        title: 'Success',
        description: 'Fee structure updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update fee structure',
        variant: 'destructive',
      });
    },
  });

  const deleteFeeStructure = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fee_structures')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee_structures'] });
      toast({
        title: 'Success',
        description: 'Fee structure deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete fee structure',
        variant: 'destructive',
      });
    },
  });

  return {
    feeStructures,
    isLoading,
    error,
    createFeeStructure: createFeeStructure.mutate,
    updateFeeStructure: updateFeeStructure.mutate,
    deleteFeeStructure: deleteFeeStructure.mutate,
    isCreating: createFeeStructure.isPending,
    isUpdating: updateFeeStructure.isPending,
    isDeleting: deleteFeeStructure.isPending,
  };
};