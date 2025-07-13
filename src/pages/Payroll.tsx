import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
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
import PayrollForm from '../components/payroll/PayrollForm';

const getPayrolls = async () => {
  const { data, error } = await supabase.from('payroll').select('*, teachers(profiles(*))');
  if (error) throw new Error(error.message);
  return data;
};

const PayrollPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  const { data: payrolls, isLoading, error } = useQuery({
    queryKey: ['payrolls'],
    queryFn: getPayrolls,
  });

  const deletePayroll = useMutation({
    mutationFn: async (payrollId: string) => {
      const { error } = await supabase.from('payroll').delete().eq('id', payrollId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      toast({ title: 'Payroll deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (payroll: any) => {
    setSelectedPayroll(payroll);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPayroll(null);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['payrolls'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Payroll</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>Add New Payroll</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPayroll ? 'Edit Payroll' : 'Add New Payroll'}</DialogTitle>
            </DialogHeader>
            <PayrollForm payroll={selectedPayroll} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls?.map((payroll) => (
            <TableRow key={payroll.id}>
              <TableCell>{payroll.teachers.profiles.first_name} {payroll.teachers.profiles.last_name}</TableCell>
              <TableCell>{payroll.month}</TableCell>
              <TableCell>{payroll.year}</TableCell>
              <TableCell>{payroll.net_salary}</TableCell>
              <TableCell>{payroll.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(payroll)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deletePayroll.mutate(payroll.id)}
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

export default PayrollPage;
