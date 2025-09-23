import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useClasses } from '@/hooks/useClasses';
import { useFeeStructures, FeeStructure } from '@/hooks/useFeeStructures';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number'),
  frequency: z.string().min(1, 'Frequency is required'),
  class_id: z.string().optional(),
  description: z.string().optional(),
  due_day: z.coerce.number().min(1).max(31).optional(),
});

interface FeeStructureFormProps {
  feeStructure?: FeeStructure;
  onSuccess: () => void;
  onCancel?: () => void;
}

const ALL_CLASSES_VALUE = '__ALL_CLASSES__';

const FeeStructureForm: React.FC<FeeStructureFormProps> = ({ 
  feeStructure, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { createFeeStructure, updateFeeStructure, isCreating, isUpdating } = useFeeStructures();
  const classesResult = useClasses();
  const classes = classesResult.data || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: feeStructure?.name || '',
      amount: feeStructure?.amount || 0,
      frequency: feeStructure?.frequency || '',
      // Use a sentinel non-empty value for "all classes" because Radix Select
      // does not allow Select.Item with an empty string value.
      class_id:
        feeStructure && typeof feeStructure.class_id === 'string' && feeStructure.class_id !== ''
          ? feeStructure.class_id
          : ALL_CLASSES_VALUE,
      description: feeStructure?.description || '',
      due_day: feeStructure?.due_day || 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const normalizedClassId = values.class_id === ALL_CLASSES_VALUE ? '' : values.class_id;

      if (feeStructure) {
        updateFeeStructure({ 
          id: feeStructure.id, 
          updates: {
            name: values.name,
            amount: values.amount,
            frequency: values.frequency,
            class_id: normalizedClassId,
            description: values.description,
            due_day: values.due_day,
          }
        });
      } else {
        createFeeStructure({
          name: values.name,
          amount: values.amount,
          frequency: values.frequency,
          class_id: normalizedClassId,
          description: values.description,
          due_day: values.due_day,
        });
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

  const isLoading = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Tuition Fee, Library Fee" {...field} />
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
                <FormLabel>Amount *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="one-time">One Time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="half-yearly">Half Yearly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Day (1-31)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="31" 
                    placeholder="1" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="class_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicable Class (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class or leave empty for all" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ALL_CLASSES_VALUE}>All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} {cls.section && `- ${cls.section}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about this fee structure"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : feeStructure ? 'Update Fee Structure' : 'Create Fee Structure'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default FeeStructureForm;
