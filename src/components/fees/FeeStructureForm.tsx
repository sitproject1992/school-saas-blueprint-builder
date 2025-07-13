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

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number'),
  frequency: z.string().min(1, 'Frequency is required'),
  class_id: z.string().optional(),
});

interface FeeStructureFormProps {
  feeStructure?: any;
  onSuccess: () => void;
}

const FeeStructureForm: React.FC<FeeStructureFormProps> = ({ feeStructure, onSuccess }) => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: feeStructure || {
      name: '',
      amount: 0,
      frequency: '',
      class_id: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (feeStructure) {
        const { error } = await supabase
          .from('fee_structures')
          .update(values)
          .eq('id', feeStructure.id);
        if (error) throw error;
        toast({ title: 'Fee structure updated successfully' });
      } else {
        const { error } = await supabase.from('fee_structures').insert(values);
        if (error) throw error;
        toast({ title: 'Fee structure created successfully' });
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {feeStructure ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default FeeStructureForm;
