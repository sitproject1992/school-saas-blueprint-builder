import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import TestForm from '../components/tests/TestForm';

const getTests = async () => {
  const { data, error } = await supabase.from('tests').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const TestsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: getTests,
  });

  const deleteTest = useMutation({
    mutationFn: async (testId: string) => {
      const { error } = await supabase.from('tests').delete().eq('id', testId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast({ title: 'Test deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (test: any) => {
    setSelectedTest(test);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedTest(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['tests'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Tests</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Test</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTest ? 'Edit Test' : 'Add New Test'}</DialogTitle>
            </DialogHeader>
            <TestForm test={selectedTest} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Max Marks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests?.map((test) => (
            <TableRow key={test.id}>
              <TableCell>{test.title}</TableCell>
              <TableCell>{test.test_type}</TableCell>
              <TableCell>{test.test_date}</TableCell>
              <TableCell>{test.max_marks}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(test)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTest.mutate(test.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TestsPage;
