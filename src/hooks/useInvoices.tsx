import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useInvoices = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getInvoices = async () => {
    const { data, error } = await supabase
      .from("fee_payments")
      .select("*, students(*, profiles(*)), fee_structures(*)");
    if (error) throw new Error(error.message);
    return data;
  };

  const createInvoice = async (newInvoice: {
    student_id: string;
    fee_structure_id: string;
    amount: number;
    status: "pending" | "paid" | "overdue" | "cancelled";
  }) => {
    const { data, error } = await supabase.from("fee_payments").insert({
      ...newInvoice,
      due_date: new Date().toISOString().split('T')[0] // Add current date as due date
    }).select();
    if (error) throw new Error(error.message);
    return data;
  };

  const generateInvoices = async () => {
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*, student_fee_structures(*, fee_structures(*))");

    if (studentsError) throw new Error(studentsError.message);

    const invoicePromises = []; // Mock empty array for now

    await Promise.all(invoicePromises);
  };

  const invoicesQuery = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: getInvoices,
    enabled: !!user,
  });

  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const generateInvoicesMutation = useMutation({
    mutationFn: generateInvoices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  return {
    invoicesQuery,
    createInvoiceMutation,
    generateInvoicesMutation,
  };
};
