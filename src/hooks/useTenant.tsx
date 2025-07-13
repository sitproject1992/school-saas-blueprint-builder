import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface TenantContext {
  schoolId: string | null;
  school: any | null;
  subdomain: string | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isSchoolAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
}

export function useTenant(): TenantContext {
  const { user } = useAuth();
  const [subdomain, setSubdomain] = useState<string | null>(null);

  // Extract subdomain from current URL
  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Handle localhost development
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
      setSubdomain('demo');
      return;
    }

    // Handle subdomain routing (e.g., school1.skooler.com)
    if (parts.length > 2) {
      setSubdomain(parts[0]);
    } else {
      // Default to demo for main domain
      setSubdomain('demo');
    }
  }, []);

  // Fetch school data based on subdomain
  const { data: school, isLoading: schoolLoading } = useQuery({
    queryKey: ["school", subdomain],
    queryFn: async () => {
      if (!subdomain) return null;
      
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("subdomain", subdomain)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!subdomain,
  });

  // Determine user roles and permissions
  const isSuperAdmin = user?.roles?.includes('super_admin') || false;
  const isSchoolAdmin = user?.roles?.includes('school_admin') || false;
  const isTeacher = user?.roles?.includes('teacher') || false;
  const isStudent = user?.roles?.includes('student') || false;
  const isParent = user?.roles?.includes('parent') || false;

  return {
    schoolId: school?.id || null,
    school,
    subdomain,
    isLoading: schoolLoading,
    isSuperAdmin,
    isSchoolAdmin,
    isTeacher,
    isStudent,
    isParent,
  };
}