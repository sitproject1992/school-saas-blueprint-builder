import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Database } from "@/integrations/supabase/types";

type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
type NewAttendance = Database["public"]["Tables"]["attendance"]["Insert"];

// Fetch attendance for a specific class on a specific date
const getAttendance = async ({ class_id, date }: { class_id: string; date: string }) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, students(*, profiles(*))")
    .eq("class_id", class_id)
    .eq("date", date);

  if (error) throw new Error(error.message);
  return data;
};

// Add or update attendance records
const upsertAttendance = async (records: NewAttendance[]) => {
  const { data, error } = await supabase.from("attendance").upsert(records).select();

  if (error) throw new Error(error.message);
  return data;
};

export const useAttendance = (class_id: string, date: string) => {
  const queryClient = useQueryClient();

  const { data: attendance, isLoading, error } = useQuery({
    queryKey: ["attendance", class_id, date],
    queryFn: () => getAttendance({ class_id, date }),
    enabled: !!class_id && !!date,
  });

  const upsertAttendanceMutation = useMutation({
    mutationFn: upsertAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", class_id, date] });
    },
  });

  return {
    attendance,
    isLoading,
    error,
    upsertAttendance: upsertAttendanceMutation.mutate,
  };
};
