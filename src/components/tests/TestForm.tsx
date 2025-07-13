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
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSchool } from '@/hooks/useSchool';
import { useClasses } from '@/hooks/useClasses';
import { useSubjects } from '@/hooks/useSubjects';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  test_type: z.string().min(1, 'Test type is required'),
  test_date: z.string().min(1, 'Test date is required'),
  max_marks: z.coerce.number().min(1, 'Max marks must be a positive number'),
  duration: z.coerce.number().optional(),
  class_id: z.string().min(1, 'Class is required'),
  subject_id: z.string().min(1, 'Subject is required'),
});

interface TestFormProps {
  test?: any;
  onSuccess: () => void;
}

const TestForm: React.FC<TestFormProps> = ({ test, onSuccess }) => {
  const { user } = useAuth();
  const { school } = useSchool();
  const { data: classes } = useClasses();
  const { data: subjects } = useSubjects();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: test || {
      title: '',
      test_type: '',
      test_date: '',
      max_marks: 100,
      duration: 60,
      class_id: '',
      subject_id: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (test) {
        const { error } = await supabase
          .from('tests')
          .update(values)
          .eq('id', test.id);
        if (error) throw error;
        toast({ title: 'Test updated successfully' });
      } else {
        const { data: teacher } = await supabase
          .from('teachers')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (teacher) {
          const { error } = await supabase.from('tests').insert({
            ...values,
            school_id: school?.id,
            teacher_id: teacher.id,
          });
          if (error) throw error;
          toast({ title: 'Test created successfully' });
        }
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="test_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="test_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="max_marks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Marks</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="class_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <select {...field}>
                  <option value="">Select a class</option>
                  {classes?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
          name="subject_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <select {...field}>
                  <option value="">Select a subject</option>
                  {subjects?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {test ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default TestForm;
