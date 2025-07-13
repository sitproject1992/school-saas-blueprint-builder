import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import EventForm from '../components/events/EventForm';
import { Calendar } from '@/components/ui/calendar';

const getEvents = async () => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const EventsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: 'Event deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            </DialogHeader>
            <EventForm event={selectedEvent} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <div>
          <h2 className="text-xl font-bold mb-2">Events on {date?.toLocaleDateString()}</h2>
          <ul>
            {events
              ?.filter((event) => new Date(event.start_time).toDateString() === date?.toDateString())
              .map((event) => (
                <li key={event.id} className="mb-2 p-2 border rounded-md">
                  <h3 className="font-bold">{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(event.start_time).toLocaleTimeString()} -{' '}
                    {new Date(event.end_time).toLocaleTimeString()}
                  </div>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteEvent.mutate(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
