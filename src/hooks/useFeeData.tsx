import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Database } from "@/integrations/supabase/types";

type FeeStructure = Database["public"]["Tables"]["fee_structures"]["Row"];
type NewFeeStructure = Database["public"]["Tables"]["fee_structures"]["Insert"];
type FeePayment = Database["public"]["Tables"]["fee_payments"]["Row"];
type NewFeePayment = Database["public"]["Tables"]["fee_payments"]["Insert"];

// Fetch all fee structures
const getFeeStructures = async () => {
  const { data, error } = await supabase.from("fee_structures").select("*, classes(name)");
  if (error) throw new Error(error.message);
  return data;
};

// Fetch all fee payments for a specific student
const getFeePayments = async (studentId: string) => {
  const { data, error } = await supabase
    .from("fee_payments")
    .select("*, fee_structures(name)")
    .eq("student_id", studentId);
  if (error) throw new Error(error.message);
  return data;
};

// Add a new fee structure
const addFeeStructure = async (feeStructure: NewFeeStructure) => {
  const { data, error } = await supabase.from("fee_structures").insert(feeStructure).select();
  if (error) throw new Error(error.message);
  return data;
};

// Add a new fee payment
const addFeePayment = async (feePayment: NewFeePayment) => {
  const { data, error } = await supabase.from("fee_payments").insert(feePayment).select();
  if (error) throw new Error(error.message);
  return data;
};

export const useFeeData = () => {
  const queryClient = useQueryClient();

  const { data: feeStructures, isLoading: isLoadingStructures, error: errorStructures } = useQuery({
    queryKey: ["feeStructures"],
    queryFn: getFeeStructures,
  });

  const getPaymentsQuery = (studentId: string) => useQuery({
    queryKey: ["feePayments", studentId],
    queryFn: () => getFeePayments(studentId),
    enabled: !!studentId,
  });

  const addFeeStructureMutation = useMutation({
    mutationFn: addFeeStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });

  const addFeePaymentMutation = useMutation({
    mutationFn: addFeePayment,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["feePayments", data[0].student_id] });
      }
    },
  });

  return {
    feeStructures,
    isLoadingStructures,
    errorStructures,
    getPaymentsQuery,
    addFeeStructure: addFeeStructureMutation.mutate,
    addFeePayment: addFeePaymentMutation.mutate,
  };
};
