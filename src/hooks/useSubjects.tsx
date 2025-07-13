import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface Subject {
  id: string;
  name: string;
  teacher_id: string | null;
  class_id: string | null;
}

const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', teacher_id: '1', class_id: '1' },
  { id: '2', name: 'English', teacher_id: '2', class_id: '1' },
  { id: '3', name: 'Science', teacher_id: '1', class_id: '2' },
];

async function getSubjects(): Promise<Subject[]> {
  console.log('Fetching subjects...');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Fetched subjects:', mockSubjects);
  return mockSubjects;
}

async function createSubject(subject: Omit<Subject, 'id'>): Promise<Subject> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newSubject = { ...subject, id: Date.now().toString() };
  mockSubjects.push(newSubject);
  return newSubject;
}

async function updateSubject({ id, updates }: { id: string; updates: Partial<Subject> }): Promise<Subject> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockSubjects.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Subject not found');

  mockSubjects[index] = { ...mockSubjects[index], ...updates };
  return mockSubjects[index];
}

async function deleteSubject(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockSubjects.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Subject not found');

  mockSubjects.splice(index, 1);
}

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: 'Success',
        description: 'Subject created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create subject',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: 'Success',
        description: 'Subject updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subject',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: 'Success',
        description: 'Subject deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete subject',
        variant: 'destructive',
      });
    },
  });
}
