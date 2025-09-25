import React, { useState } from 'react';
import { useParents } from '@/hooks/useParents';
import { ParentForm } from '@/components/parents/ParentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ParentsPage: React.FC = () => {
  const { data: parents, isLoading, error } = useParents();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<any>(null);

  const handleAddClick = () => {
    setSelectedParent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (parent: any) => {
    setSelectedParent(parent);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedParent(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading parents: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Parents</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Parent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedParent ? 'Edit Parent' : 'Add Parent'}</DialogTitle>
            </DialogHeader>
            <ParentForm parent={selectedParent} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parent List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents?.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell>
                    {parent.profiles?.first_name} {parent.profiles?.last_name}
                  </TableCell>
                  <TableCell>{parent.profiles?.email}</TableCell>
                  <TableCell>{parent.profiles?.phone || 'N/A'}</TableCell>
                  <TableCell>{parent.occupation || 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(parent)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentsPage;