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
import { useQuery } from '@tanstack/react-query';
import { useSchool } from '@/hooks/useSchool';

const formSchema = z.object({
  teacher_id: z.string().min(1, 'Teacher is required'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  salary: z.coerce.number().min(0),
  deductions: z.coerce.number().min(0).optional(),
  net_salary: z.coerce.number().min(0),
  status: z.string().optional(),
});

const getTeachers = async (schoolId: string) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('id, profiles(first_name, last_name)')
    .eq('school_id', schoolId);
  if (error) throw new Error(error.message);
  return data;
};

interface PayrollFormProps {
  payroll?: any;
  onSuccess: () => void;
}

const PayrollForm: React.FC<PayrollFormProps> = ({ payroll, onSuccess }) => {
  const { school } = useSchool();
  const { data: teachers } = useQuery({
    queryKey: ['teachers', school?.id],
    queryFn: () => getTeachers(school?.id),
    enabled: !!school,
  });
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: payroll || {
      teacher_id: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      salary: 0,
      deductions: 0,
      net_salary: 0,
      status: 'pending',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (payroll) {
        const { error } = await supabase
          .from('payroll')
          .update(values)
          .eq('id', payroll.id);
        if (error) throw error;
        toast({ title: 'Payroll updated successfully' });
      } else {
        const { error } = await supabase.from('payroll').insert({
          ...values,
          school_id: school?.id,
        });
        if (error) throw error;
        toast({ title: 'Payroll created successfully' });
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
          name="teacher_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <FormControl>
                <select {...field}>
                  <option value="">Select a teacher</option>
                  {teachers?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.profiles.first_name} {t.profiles.last_name}
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
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deductions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deductions</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="net_salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Salary</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {payroll ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default PayrollForm;
