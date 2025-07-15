import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from './useSchool';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent' | 'accountant' | 'inventory_manager';
}

export function useUsers() {
  const { schoolId } = useSchool();
  return useQuery({
    queryKey: ['users', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('school_id', schoolId);

      if (error) throw new Error(error.message);
      return data as User[];
    },
    enabled: !!schoolId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { schoolId } = useSchool();

  return useMutation({
    mutationFn: async (userData: Omit<User, 'id'>) => {
      if (!schoolId) throw new Error('No active school selected');

      // Create a user in auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: Math.random().toString(36).slice(-8), // Generate a random password
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Could not create user');

      // Create a profile for the user
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          school_id: schoolId,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, email, first_name, last_name, role }: User) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ email, first_name, last_name, role })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      // This is a protected admin function, so we need to use the service key
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });
}
