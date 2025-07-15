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
import { useSchool } from '@/hooks/useSchool';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published_at: z.string().optional(),
});

interface AnnouncementFormProps {
  announcement?: any;
  onSuccess: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement, onSuccess }) => {
  const { user } = useAuth();
  const { school } = useSchool();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: announcement || {
      title: '',
      content: '',
      published_at: new Date().toISOString(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (announcement) {
        const { error } = await supabase
          .from('announcements')
          .update(values)
          .eq('id', announcement.id);
        if (error) throw error;
        toast({ title: 'Announcement updated successfully' });
      } else {
        const { error } = await supabase.from('announcements').insert({
          title: values.title,
          content: values.content,
          published_at: values.published_at,
          school_id: school?.id,
          created_by: user?.id,
        });
        if (error) throw error;
        toast({ title: 'Announcement created successfully' });
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {announcement ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default AnnouncementForm;
