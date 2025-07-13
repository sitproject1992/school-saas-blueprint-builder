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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useInvoices } from "@/hooks/useInvoices";

const feeStructureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  frequency: z.string().min(1, "Frequency is required"),
});

const getFeeStructures = async () => {
  const { data, error } = await supabase.from("fee_structures").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const createFeeStructure = async (
  newFeeStructure: z.infer<typeof feeStructureSchema> & { school_id: string },
) => {
  const { data, error } = await supabase
    .from("fee_structures")
    .insert(newFeeStructure)
    .select();
  if (error) throw new Error(error.message);
  return data;
};

const updateFeeStructure = async (
  updatedFeeStructure: { id: string } & z.infer<typeof feeStructureSchema>,
) => {
  const { id, ...rest } = updatedFeeStructure;
  const { data, error } = await supabase
    .from("fee_structures")
    .update(rest)
    .eq("id", id)
    .select();
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
  const { schoolId } = useSchool();
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

  const createMutation = useMutation({
    mutationFn: createFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
      setOpen(false);
      setSelectedFeeStructure(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });

  const form = useForm<z.infer<typeof feeStructureSchema>>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      name: "",
      amount: 0,
      frequency: "",
    },
  });

  const onSubmit = (values: z.infer<typeof feeStructureSchema>) => {
    if (selectedFeeStructure) {
      updateMutation.mutate({ id: selectedFeeStructure.id, ...values });
    } else {
      createMutation.mutate({ ...values, school_id: "your_school_id" });
    }
  };

  const handleEdit = (feeStructure: any) => {
    setSelectedFeeStructure(feeStructure);
    form.reset(feeStructure);
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedFeeStructure(null);
    form.reset({
      name: "",
      amount: 0,
      frequency: "",
    });
    setOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Fee Structures</h1>
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tution Fee" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Monthly" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    {selectedFeeStructure ? "Update" : "Create"}
                  </Button>
                </form>
              </Form>
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
