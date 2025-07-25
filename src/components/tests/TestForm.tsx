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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSchool } from '@/hooks/useSchool';
import { useClasses } from '@/hooks/useClasses';
import { useSubjects } from '@/hooks/useSubjects';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['pre_test', 'post_test', 'weekly', 'monthly', 'major', 'final']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
});

interface TestFormProps {
  test?: any;
  onSuccess: () => void;
}

const TestForm: React.FC<TestFormProps> = ({ test, onSuccess }) => {
  const { user } = useAuth();
  const { schoolId } = useSchool();
  const { data: classes } = useClasses();
  const { data: subjects } = useSubjects();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: test || {
      name: '',
      type: 'monthly',
      start_date: '',
      end_date: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (test) {
        const { error } = await supabase
          .from('exams')
          .update(values)
          .eq('id', test.id);
        if (error) throw error;
        toast({ title: 'Exam updated successfully' });
      } else {
        if (!schoolId) throw new Error('No school selected');
        const { error } = await supabase.from('exams').insert({
          name: values.name,
          type: values.type,
          start_date: values.start_date,
          end_date: values.end_date,
          school_id: schoolId,
        });
        if (error) throw error;
        toast({ title: 'Exam created successfully' });
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pre_test">Pre Test</SelectItem>
                  <SelectItem value="post_test">Post Test</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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