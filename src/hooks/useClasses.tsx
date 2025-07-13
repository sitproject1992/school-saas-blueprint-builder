import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { MockApiService, Class } from '@/lib/mockData';

export { type Class } from '@/lib/mockData';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: MockApiService.getClasses
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      name: string;
      section?: string;
      grade?: string;
      capacity: number;
      teacher_id?: string;
    }) => MockApiService.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create class',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Class> }) => 
      MockApiService.updateClass(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update class',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: MockApiService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete class',
        variant: 'destructive',
      });
    },
  });
}