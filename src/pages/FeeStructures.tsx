import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FeeStructureForm from "@/components/fees/FeeStructureForm";
import { useFeeStructures, FeeStructure } from "@/hooks/useFeeStructures";
import { DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";

export default function FeeStructures() {
  const { feeStructures, isLoading, deleteFeeStructure, isDeleting } = useFeeStructures();
  const classesResult = useClasses();
  const classes = classesResult.data || [];
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFeeStructure, setEditingFeeStructure] = useState<FeeStructure | null>(null);

  const getClassName = (classId: string | null) => {
    if (!classId) return "All Classes";
    const cls = classes.find(c => c.id === classId);
    return cls ? `${cls.name}${cls.section ? ` - ${cls.section}` : ''}` : "Unknown Class";
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      'one-time': 'secondary',
      'monthly': 'default',
      'quarterly': 'outline',
      'half-yearly': 'destructive',
      'yearly': 'default'
    } as const;
    
    return (
      <Badge variant={colors[frequency as keyof typeof colors] || 'default'}>
        {frequency.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditingFeeStructure(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      deleteFeeStructure(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-lg">Loading fee structures...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Fee Structures</h1>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Fee Structure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Fee Structure</DialogTitle>
            </DialogHeader>
            <FeeStructureForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Structures</CardTitle>
        </CardHeader>
        <CardContent>
          {feeStructures.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No fee structures</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new fee structure.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Applicable Class</TableHead>
                  <TableHead>Due Day</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeStructures.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{fee.name}</TableCell>
                    <TableCell>${fee.amount.toLocaleString()}</TableCell>
                    <TableCell>{getFrequencyBadge(fee.frequency)}</TableCell>
                    <TableCell>{getClassName(fee.class_id)}</TableCell>
                    <TableCell>{fee.due_day}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingFeeStructure(fee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(fee.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog 
        open={!!editingFeeStructure} 
        onOpenChange={() => setEditingFeeStructure(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Fee Structure</DialogTitle>
          </DialogHeader>
          {editingFeeStructure && (
            <FeeStructureForm 
              feeStructure={editingFeeStructure}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingFeeStructure(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
