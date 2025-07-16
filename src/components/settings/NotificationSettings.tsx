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
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSchool } from '@/hooks/useSchool';

const formSchema = z.object({
  email_notifications: z.object({
    new_announcement: z.boolean(),
    fee_reminder: z.boolean(),
  }),
  in_app_notifications: z.object({
    new_announcement: z.boolean(),
    fee_reminder: z.boolean(),
  }),
});

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const { school } = useSchool();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_notifications: {
        new_announcement: false,
        fee_reminder: false,
      },
      in_app_notifications: {
        new_announcement: false,
        fee_reminder: false,
      },
    },
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      if (user && school) {
        const { data } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .eq('school_id', school.id)
          .single();
        if (data) {
          form.reset({
            email_notifications: data.email_notifications as { new_announcement?: boolean; fee_reminder?: boolean; },
            in_app_notifications: data.in_app_notifications as { new_announcement?: boolean; fee_reminder?: boolean; },
          });
        }
      }
    };
    fetchSettings();
  }, [user, school, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (user && school) {
        const { error } = await supabase
          .from('notification_settings')
          .upsert({ ...values, user_id: user.id, school_id: school.id });
        if (error) throw error;
        toast({ title: 'Notification settings updated successfully' });
      }
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email_notifications.new_announcement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>New Announcement</FormLabel>
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
            <FormField
              control={form.control}
              name="email_notifications.fee_reminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Fee Reminder</FormLabel>
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
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">In-App Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="in_app_notifications.new_announcement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>New Announcement</FormLabel>
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
            <FormField
              control={form.control}
              name="in_app_notifications.fee_reminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Fee Reminder</FormLabel>
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
          </div>
        </div>
        <Button type="submit">Update Settings</Button>
      </form>
    </Form>
  );
};

export default NotificationSettings;
