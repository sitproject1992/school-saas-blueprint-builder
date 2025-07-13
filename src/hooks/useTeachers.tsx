import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { MockApiService, Teacher } from '@/lib/mockData';

export { type Teacher } from '@/lib/mockData';

type TeacherInsert = {
  employee_id: string;
  department?: string;
  designation?: string;
  salary?: number;
  join_date?: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: string | null;
  };
};

export const useTeachers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: teachers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teachers'],
    queryFn: MockApiService.getTeachers,
  });

  const createTeacher = useMutation({
    mutationFn: (teacherData: TeacherInsert) => MockApiService.createTeacher({
      employee_id: teacherData.employee_id,
      department: teacherData.department,
      designation: teacherData.designation,
      salary: teacherData.salary,
      join_date: teacherData.join_date,
      profiles: teacherData.profile
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create teacher',
        variant: 'destructive',
      });
    },
  });

  const updateTeacher = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Teacher> }) => 
      MockApiService.updateTeacher(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update teacher',
        variant: 'destructive',
      });
    },
  });

  const deleteTeacher = useMutation({
    mutationFn: MockApiService.deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete teacher',
        variant: 'destructive',
      });
    },
  });

  return {
    teachers,
    isLoading,
    error,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
