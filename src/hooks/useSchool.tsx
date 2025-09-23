import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SchoolContextType {
  school: any;
  schoolId: string | null;
  schools: any[];
  switchSchool: (schoolId: string) => void;
  isLoading: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeSchoolId, setActiveSchoolId] = useState<string | null>(null);

  const { data: schools = [] } = useQuery({
    queryKey: ["user-schools", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // For school admins, get school from their account
      if (user.profile?.school_id || user.school_id) {
        const schoolId = user.profile?.school_id || user.school_id;
        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId);
        if (error) throw new Error(error.message);
        return data;
      }
      
      // For regular users, check school_admins table (when it exists)
      return [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (schools.length > 0 && !activeSchoolId) {
      const storedSchoolId = localStorage.getItem("activeSchoolId");
      if (storedSchoolId && schools.some(s => s.id === storedSchoolId)) {
        setActiveSchoolId(storedSchoolId);
      } else {
        setActiveSchoolId(schools[0].id);
      }
    }
  }, [schools, activeSchoolId]);

  const { data: school, isLoading } = useQuery({
    queryKey: ["current-school", activeSchoolId],
    queryFn: async () => {
      if (!activeSchoolId) return null;
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", activeSchoolId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!activeSchoolId,
  });

  const switchSchool = (schoolId: string) => {
    setActiveSchoolId(schoolId);
    localStorage.setItem("activeSchoolId", schoolId);
    queryClient.invalidateQueries();
  };

  // For school admins, automatically set their school as active
  useEffect(() => {
    const schoolId = user?.profile?.school_id || user?.school_id;
    if (schoolId && !activeSchoolId) {
      setActiveSchoolId(schoolId);
    }
  }, [user?.profile?.school_id, user?.school_id, activeSchoolId]);

  return (
    <SchoolContext.Provider
      value={{ 
        school, 
        schoolId: activeSchoolId || user?.profile?.school_id || user?.school_id || school?.id, 
        schools, 
        switchSchool, 
        isLoading 
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
}
