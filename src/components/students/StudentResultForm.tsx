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
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
  test_id: z.string().min(1, 'Test is required'),
  marks_obtained: z.coerce.number().min(0, 'Marks must be a positive number'),
  comments: z.string().optional(),
});

const getTests = async () => {
  const { data, error } = await supabase.from('tests').select('*');
  if (error) throw new Error(error.message);
  return data;
};

interface StudentResultFormProps {
  result?: any;
  studentId: string;
  onSuccess: () => void;
}

const StudentResultForm: React.FC<StudentResultFormProps> = ({
  result,
  studentId,
  onSuccess,
}) => {
  const { data: tests } = useQuery({ queryKey: ['tests'], queryFn: getTests });
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: result || {
      test_id: '',
      marks_obtained: 0,
      comments: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (result) {
        const { error } = await supabase
          .from('student_test_results')
          .update(values)
          .eq('id', result.id);
        if (error) throw error;
        toast({ title: 'Result updated successfully' });
      } else {
        const { error } = await supabase.from('student_test_results').insert({
          ...values,
          student_id: studentId,
        });
        if (error) throw error;
        toast({ title: 'Result created successfully' });
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
          name="test_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test</FormLabel>
              <FormControl>
                <select {...field}>
                  <option value="">Select a test</option>
                  {tests?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marks_obtained"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marks Obtained</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
          {result ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default StudentResultForm;
