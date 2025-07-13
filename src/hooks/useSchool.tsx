import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// For now, we'll use the demo school. In a real multi-tenant setup,
// this would be determined by subdomain or user context
const DEMO_SCHOOL_SUBDOMAIN = "demo";

export function useSchool() {
  const { data: school, isLoading } = useQuery({
    queryKey: ["current-school"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("subdomain", DEMO_SCHOOL_SUBDOMAIN)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });

  return {
    school,
    schoolId: school?.id,
    isLoading,
  };
}
