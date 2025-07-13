import { useState } from "react";
import { useSchool } from "@/hooks/useSchool";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FeeStructureForm from "../components/fees/FeeStructureForm";
import { useInvoices } from "@/hooks/useInvoices";

const getFeeStructures = async () => {
  const { data, error } = await supabase.from("fee_structures").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const deleteFeeStructure = async (id: string) => {
  const { data, error } = await supabase
    .from("fee_structures")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export default function FeeStructures() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<any>(null);

  const {
    data: feeStructures,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feeStructures"],
    queryFn: getFeeStructures,
  });

  const { generateInvoicesMutation } = useInvoices();

  const deleteMutation = useMutation({
    mutationFn: deleteFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });

  const handleEdit = (feeStructure: any) => {
    setSelectedFeeStructure(feeStructure);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedFeeStructure(null);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Fee Structures</h1>
        <div>
          <Button
            onClick={() => generateInvoicesMutation.mutate()}
            className="mr-2"
          >
            Generate Invoices
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>Add New Fee Structure</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedFeeStructure ? "Edit" : "Add"} Fee Structure
                </DialogTitle>
              </DialogHeader>
              <FeeStructureForm
                feeStructure={selectedFeeStructure}
                onSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeStructures?.map((fs) => {
            return (
              <TableRow key={fs.id}>
                <TableCell>{fs.name}</TableCell>
                <TableCell>{fs.amount}</TableCell>
                <TableCell>{fs.frequency}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(fs)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(fs.id)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
