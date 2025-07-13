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
import TeacherEvaluationForm from './TeacherEvaluationForm';

const getTeacherEvaluations = async (teacherId: string) => {
  const { data, error } = await supabase
    .from('teacher_evaluations')
    .select('*')
    .eq('teacher_id', teacherId);
  if (error) throw new Error(error.message);
  return data;
};

interface TeacherEvaluationProps {
  teacherId: string;
}

const TeacherEvaluation: React.FC<TeacherEvaluationProps> = ({ teacherId }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);

  const { data: evaluations, isLoading, error } = useQuery({
    queryKey: ['teacherEvaluations', teacherId],
    queryFn: () => getTeacherEvaluations(teacherId),
  });

  const deleteEvaluation = useMutation({
    mutationFn: async (evaluationId: string) => {
      const { error } = await supabase
        .from('teacher_evaluations')
        .delete()
        .eq('id', evaluationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherEvaluations', teacherId] });
      toast({ title: 'Evaluation deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (evaluation: any) => {
    setSelectedEvaluation(evaluation);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedEvaluation(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['teacherEvaluations', teacherId] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Teacher Evaluations</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Evaluation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEvaluation ? 'Edit Evaluation' : 'Add New Evaluation'}
              </DialogTitle>
            </DialogHeader>
            <TeacherEvaluationForm
              evaluation={selectedEvaluation}
              teacherId={teacherId}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations?.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell>{evaluation.evaluation_date}</TableCell>
              <TableCell>{evaluation.rating}</TableCell>
              <TableCell>{evaluation.comments}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(evaluation)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteEvaluation.mutate(evaluation.id)}
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

export default TeacherEvaluation;
