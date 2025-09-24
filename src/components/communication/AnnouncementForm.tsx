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
import { useAnnouncements, Announcement } from '@/hooks/useAnnouncements';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published_at: z.string().optional(),
});

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSuccess: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement, onSuccess }) => {
  const { toast } = useToast();
  const { createAnnouncement, updateAnnouncement, isCreating, isUpdating } = useAnnouncements();
  
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
        updateAnnouncement({
          id: announcement.id,
          updates: {
            title: values.title,
            content: values.content,
            published_at: values.published_at
          }
        });
      } else {
        createAnnouncement({
          title: values.title,
          content: values.content,
          published_at: values.published_at
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
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? 'Saving...' : announcement ? 'Update' : 'Create'}
        </Button>
      </form>
    </Form>
  );
};

export default AnnouncementForm;
