import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from './useSchool';

export interface InventoryCategory {
  id: string;
  school_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  school_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number | null;
  total_value: number | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  inventory_categories?: InventoryCategory;
}

export interface InventoryItemInput {
  name: string;
  description?: string;
  quantity: number;
  unit_price?: number;
  total_value?: number;
  location?: string;
  category_id?: string;
}

export const useInventory = () => {
  const { schoolId } = useSchool();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inventory_items', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*, inventory_categories(*)')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
  return (data as any[])?.map((item: any) => ({
    ...item,
    inventory_categories: item.inventory_categories || { name: 'Unknown' }
  })) || [] as InventoryItem[];
    },
    enabled: !!schoolId,
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ['inventory_categories', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('school_id', schoolId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as InventoryCategory[];
    },
    enabled: !!schoolId,
  });

  const createItem = useMutation({
    mutationFn: async (data: InventoryItemInput) => {
      if (!schoolId) throw new Error('No active school selected');

      const { data: result, error } = await supabase
        .from('inventory_items')
        .insert({
          school_id: schoolId,
          name: data.name,
          description: data.description || null,
          quantity: data.quantity,
          unit_price: data.unit_price || null,
          total_value: data.total_value || null,
          location: data.location || null,
          category_id: data.category_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      toast({
        title: 'Success',
        description: 'Item created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create item',
        variant: 'destructive',
      });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InventoryItemInput> }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update item',
        variant: 'destructive',
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete item',
        variant: 'destructive',
      });
    },
  });

  return {
    items,
    categories,
    isLoading,
    categoriesLoading,
    error,
    createItem: createItem.mutate,
    updateItem: updateItem.mutate,
    deleteItem: deleteItem.mutate,
    isCreating: createItem.isPending,
    isUpdating: updateItem.isPending,
    isDeleting: deleteItem.isPending,
  };
};