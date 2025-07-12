import { useInvoices } from "@/hooks/useInvoices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const updateInvoiceStatus = async ({ id, status }: { id: string; status: string }) => {
  const { data, error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  return data;
};

export default function Invoices() {
  const queryClient = useQueryClient();
  const { invoicesQuery } = useInvoices();
  const { data: invoices, isLoading, error } = invoicesQuery;

  const updateStatusMutation = useMutation({
    mutationFn: updateInvoiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Fee Structure</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                {invoice.students.profiles.first_name} {invoice.students.profiles.last_name}
              </TableCell>
              <TableCell>{invoice.fee_structures.name}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    invoice.status === "paid"
                      ? "default"
                      : invoice.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                {invoice.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      updateStatusMutation.mutate({ id: invoice.id, status: "paid" })
                    }
                  >
                    Mark as Paid
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
