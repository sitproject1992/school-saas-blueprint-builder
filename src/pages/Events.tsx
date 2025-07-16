import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import EventForm from '@/components/events/EventForm';

const EventsPage: React.FC = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
    toast({ title: 'Event saved successfully' });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
            </DialogHeader>
            <EventForm event={selectedEvent} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-center py-8 text-muted-foreground">
        <p>Events functionality will be available once the events table is created.</p>
        <p className="text-sm mt-2">This feature requires an events table in the database.</p>
      </div>
    </div>
  );
};

export default EventsPage;