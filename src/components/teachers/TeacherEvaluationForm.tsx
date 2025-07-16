import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useToast } from '@/hooks/use-toast';

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
    // Note: Since teacher_evaluations table doesn't exist in the database,
    // this is a placeholder implementation
    toast({ 
      title: 'Feature Coming Soon',
      description: 'Teacher evaluations will be available once the database table is created.',
    });
    onSuccess();
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
              <FormLabel>Rating (1-5)</FormLabel>
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