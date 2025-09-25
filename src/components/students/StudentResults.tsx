import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
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
import StudentResultForm from './StudentResultForm';

const getStudentResults = async (studentId: string) => {
  const { data, error } = await supabase
    .from('exam_results')
    .select('*, exams(*)')
    .eq('student_id', studentId);
  if (error) throw new Error(error.message);
  return data;
};

interface StudentResultsProps {
  studentId: string;
}

const StudentResults: React.FC<StudentResultsProps> = ({ studentId }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['studentResults', studentId],
    queryFn: () => getStudentResults(studentId),
  });

  const deleteResult = useMutation({
    mutationFn: async (resultId: string) => {
      const { error } = await supabase
        .from('exam_results')
        .delete()
        .eq('id', resultId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentResults', studentId] });
      toast({ title: 'Result deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (result: any) => {
    setSelectedResult(result);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedResult(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['studentResults', studentId] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Student Results</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Result</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedResult ? 'Edit Result' : 'Add New Result'}
              </DialogTitle>
            </DialogHeader>
            <StudentResultForm
              result={selectedResult}
              studentId={studentId}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test</TableHead>
            <TableHead>Marks Obtained</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results?.map((result) => (
            <TableRow key={result.id}>
              <TableCell>No exam data</TableCell>
              <TableCell>{result.marks_obtained}</TableCell>
              <TableCell>{result.remarks}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(result)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteResult.mutate(result.id)}
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

export default StudentResults;
