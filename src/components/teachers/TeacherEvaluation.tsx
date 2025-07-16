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
import { useToast } from '@/hooks/use-toast';
import TeacherEvaluationForm from './TeacherEvaluationForm';

// Note: Since teacher_evaluations table doesn't exist in the database,
// this component will show a placeholder message
interface TeacherEvaluationProps {
  teacherId: string;
}

const TeacherEvaluation: React.FC<TeacherEvaluationProps> = ({ teacherId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Teacher Evaluations</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>Add New Evaluation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Evaluation</DialogTitle>
            </DialogHeader>
            <TeacherEvaluationForm
              teacherId={teacherId}
              onSuccess={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="text-center py-8 text-muted-foreground">
        Teacher evaluations feature will be available once the database table is created.
      </div>
    </div>
  );
};

export default TeacherEvaluation;