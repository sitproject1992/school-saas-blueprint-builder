import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  evaluation_date: z.string().min(1, 'Evaluation date is required'),
  rating: z.coerce.number().min(1).max(5),
  comments: z.string().optional(),
});

interface TeacherEvaluationFormProps {
  evaluation?: any;
  teacherId: string;
  onSuccess: () => void;
}

const TeacherEvaluationForm: React.FC<TeacherEvaluationFormProps> = ({
  evaluation,
  teacherId,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: evaluation || {
      evaluation_date: '',
      rating: 3,
      comments: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (evaluation) {
        const { error } = await supabase
          .from('teacher_evaluations')
          .update(values)
          .eq('id', evaluation.id);
        if (error) throw error;
        toast({ title: 'Evaluation updated successfully' });
      } else {
        const { error } = await supabase.from('teacher_evaluations').insert({
          ...values,
          teacher_id: teacherId,
          evaluator_id: user?.id,
        });
        if (error) throw error;
        toast({ title: 'Evaluation created successfully' });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="evaluation_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evaluation Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {evaluation ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default TeacherEvaluationForm;
