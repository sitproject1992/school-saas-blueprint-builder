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
import AcademicYearForm from './AcademicYearForm';

const getAcademicYears = async () => {
  const { data, error } = await supabase.from('academic_years').select('*');
  if (error) throw new Error(error.message);
  return data;
};

const AcademicYear: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<any>(null);

  const { data: academicYears, isLoading, error } = useQuery({
    queryKey: ['academicYears'],
    queryFn: getAcademicYears,
  });

  const deleteAcademicYear = useMutation({
    mutationFn: async (yearId: string) => {
      const { error } = await supabase.from('academic_years').delete().eq('id', yearId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      toast({ title: 'Academic year deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (year: any) => {
    setSelectedYear(year);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedYear(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['academicYears'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Academic Year</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Academic Year</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedYear ? 'Edit Academic Year' : 'Add New Academic Year'}</DialogTitle>
            </DialogHeader>
            <AcademicYearForm academicYear={selectedYear} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {academicYears?.map((year) => (
            <TableRow key={year.id}>
              <TableCell>{year.name}</TableCell>
              <TableCell>{year.start_date}</TableCell>
              <TableCell>{year.end_date}</TableCell>
              <TableCell>{year.is_active ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(year)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAcademicYear.mutate(year.id)}
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

export default AcademicYear;
