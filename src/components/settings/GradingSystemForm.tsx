import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_default: z.boolean(),
  scale: z.array(
    z.object({
      grade: z.string().min(1, 'Grade is required'),
      min_score: z.coerce.number().min(0, 'Min score must be a positive number'),
    })
  ),
});

interface GradingSystemFormProps {
  gradingSystem?: any;
  onSuccess: () => void;
}

const GradingSystemForm: React.FC<GradingSystemFormProps> = ({ gradingSystem, onSuccess }) => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: gradingSystem || {
      name: '',
      is_default: false,
      scale: [{ grade: '', min_score: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'scale',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (gradingSystem) {
        const { error } = await supabase
          .from('grading_systems')
          .update(values)
          .eq('id', gradingSystem.id);
        if (error) throw error;
        toast({ title: 'Grading system updated successfully' });
      } else {
        const { error } = await supabase.from('grading_systems').insert(values);
        if (error) throw error;
        toast({ title: 'Grading system created successfully' });
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
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Default</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div>
          <h3 className="text-lg font-medium mb-2">Grade Scale</h3>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 mb-2">
              <Input
                {...form.register(`scale.${index}.grade`)}
                placeholder="Grade"
                className="w-1/3"
              />
              <Input
                {...form.register(`scale.${index}.min_score`)}
                type="number"
                placeholder="Min Score"
                className="w-1/3"
              />
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => append({ grade: '', min_score: 0 })}
          >
            Add Grade
          </Button>
        </div>
        <Button type="submit">
          {gradingSystem ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default GradingSystemForm;
