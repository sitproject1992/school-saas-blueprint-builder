import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import AnnouncementForm from '../components/communication/AnnouncementForm';

const getAnnouncements = async () => {
  const { data, error } = await supabase.from('announcements').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const AnnouncementsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', announcementId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({ title: 'Announcement deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['announcements'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Announcement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}</DialogTitle>
            </DialogHeader>
            <AnnouncementForm announcement={selectedAnnouncement} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {announcements?.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <CardTitle>{announcement.title}</CardTitle>
              <CardDescription>{new Date(announcement.published_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{announcement.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAnnouncement.mutate(announcement.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
