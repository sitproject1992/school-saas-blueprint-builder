import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
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
import { useToast } from '@/components/ui/use-toast';
import GradingSystemForm from './GradingSystemForm';

const getGradingSystems = async () => {
  const { data, error } = await supabase.from('grading_systems').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const GradingSystem: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<any>(null);

  const { data: gradingSystems, isLoading, error } = useQuery({
    queryKey: ['gradingSystems'],
    queryFn: getGradingSystems,
  });

  const deleteGradingSystem = useMutation({
    mutationFn: async (systemId: string) => {
      const { error } = await supabase.from('grading_systems').delete().eq('id', systemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradingSystems'] });
      toast({ title: 'Grading system deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (system: any) => {
    setSelectedSystem(system);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSystem(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['gradingSystems'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Grading System</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Grading System</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedSystem ? 'Edit Grading System' : 'Add New Grading System'}</DialogTitle>
            </DialogHeader>
            <GradingSystemForm gradingSystem={selectedSystem} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gradingSystems?.map((system) => (
            <TableRow key={system.id}>
              <TableCell>{system.name}</TableCell>
              <TableCell>{system.is_default ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(system)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteGradingSystem.mutate(system.id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GradingSystem;
