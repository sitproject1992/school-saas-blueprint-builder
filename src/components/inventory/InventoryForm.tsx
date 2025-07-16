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
import { useSchool } from '@/hooks/useSchool';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.coerce.number().min(0, 'Quantity must be a positive number'),
  category_id: z.string().min(1, 'Category is required'),
});

interface InventoryFormProps {
  item?: any;
  onSuccess: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ item, onSuccess }) => {
  const { toast } = useToast();
  const { school } = useSchool();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: item || {
      name: '',
      quantity: 0,
      category_id: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (item) {
        const { error } = await supabase
          .from('inventory_items')
          .update(values)
          .eq('id', item.id);
        if (error) throw error;
        toast({ title: 'Item updated successfully' });
      } else {
        const { error } = await supabase.from('inventory_items').insert({
          name: values.name,
          quantity: values.quantity,
          category_id: values.category_id,
          school_id: school?.id,
        });
        if (error) throw error;
        toast({ title: 'Item created successfully' });
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
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {item ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default InventoryForm;
