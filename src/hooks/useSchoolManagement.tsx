import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface School {
  id: string;
  name: string;
  subdomain: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  subscriptionStatus: string;
  subscriptionExpiresAt: string | null;
  themeColor: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  adminCount?: number;
  studentCount?: number;
  teacherCount?: number;
}

export interface CreateSchoolData {
  name: string;
  subdomain: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  subscriptionStatus: string;
  subscriptionExpiresAt?: string;
  themeColor?: string;
  description?: string;
  maxStudents?: number;
  maxTeachers?: number;
  features?: string[];
}

export interface UpdateSchoolData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  subscriptionStatus?: string;
  subscriptionExpiresAt?: string;
  themeColor?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  createdAt: string;
  superAdminId: string;
  ipAddress?: string;
  userAgent?: string;
}

export function useSchoolManagement() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthorized = user?.profile?.role === "super_admin";

  // Fetch all schools with computed statistics
  const fetchSchools = async () => {
    if (!isAuthorized) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch schools
      const { data: schoolsData, error: schoolsError } = await supabase
        .from("schools")
        .select("*")
        .order("created_at", { ascending: false });

      if (schoolsError) throw schoolsError;

      // For each school, fetch admin, student, and teacher counts
      const schoolsWithCounts = await Promise.all(
        (schoolsData || []).map(async (school) => {
          // Get admin count
          const { count: adminCount } = await supabase
            .from("school_admin_accounts")
            .select("id", { count: "exact" })
            .eq("school_id", school.id)
            .eq("is_active", true);

          // Get student count
          const { count: studentCount } = await supabase
            .from("students")
            .select("id", { count: "exact" })
            .eq("school_id", school.id);

          // Get teacher count
          const { count: teacherCount } = await supabase
            .from("teachers")
            .select("id", { count: "exact" })
            .eq("school_id", school.id);

          return {
            ...school,
            adminCount: adminCount || 0,
            studentCount: studentCount || 0,
            teacherCount: teacherCount || 0,
          };
        }),
      );

      setSchools(schoolsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  // Create a new school
  const createSchool = async (data: CreateSchoolData): Promise<string> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      // Check if subdomain already exists
      const { data: existingSchool } = await supabase
        .from("schools")
        .select("id")
        .eq("subdomain", data.subdomain)
        .single();

      if (existingSchool) {
        throw new Error("Subdomain already exists");
      }

      // Create the school
      const { data: newSchool, error } = await supabase
        .from("schools")
        .insert({
          name: data.name,
          subdomain: data.subdomain,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          website: data.website || null,
          subscription_status: data.subscriptionStatus,
          subscription_expires_at: data.subscriptionExpiresAt || null,
          theme_color: data.themeColor || "#3b82f6",
        })
        .select()
        .single();

      if (error) throw error;

      // Create default school data
      await supabase.rpc("create_default_school_data", {
        school_id: newSchool.id,
      });

      // Log the action
      await logAuditAction("CREATE_SCHOOL", "school", newSchool.id, {
        name: data.name,
        subdomain: data.subdomain,
      });

      // Refresh schools list
      await fetchSchools();

      return newSchool.id;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create school";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update a school
  const updateSchool = async (
    id: string,
    data: UpdateSchoolData,
  ): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.website !== undefined) updateData.website = data.website;
      if (data.subscriptionStatus !== undefined)
        updateData.subscription_status = data.subscriptionStatus;
      if (data.subscriptionExpiresAt !== undefined)
        updateData.subscription_expires_at = data.subscriptionExpiresAt;
      if (data.themeColor !== undefined)
        updateData.theme_color = data.themeColor;

      const { error } = await supabase
        .from("schools")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Log the action
      await logAuditAction("UPDATE_SCHOOL", "school", id, updateData);

      // Refresh schools list
      await fetchSchools();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update school";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a school
  const deleteSchool = async (id: string): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      // Get school details for logging
      const { data: school } = await supabase
        .from("schools")
        .select("name, subdomain")
        .eq("id", id)
        .single();

      // Delete the school (cascade will handle related records)
      const { error } = await supabase.from("schools").delete().eq("id", id);

      if (error) throw error;

      // Log the action
      await logAuditAction("DELETE_SCHOOL", "school", id, {
        name: school?.name,
        subdomain: school?.subdomain,
      });

      // Refresh schools list
      await fetchSchools();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete school";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle school subscription status
  const toggleSchoolStatus = async (
    id: string,
    status: string,
  ): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("schools")
        .update({ subscription_status: status })
        .eq("id", id);

      if (error) throw error;

      // Log the action
      await logAuditAction("UPDATE_SCHOOL_STATUS", "school", id, { status });

      // Refresh schools list
      await fetchSchools();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update school status";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async (limit: number = 50) => {
    if (!isAuthorized) return;

    try {
      const { data, error } = await supabase
        .from("super_admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      const formattedLogs: AuditLogEntry[] = (data || []).map((log: any) => ({
        id: log.id,
        action: log.action,
        targetType: log.target_type,
        targetId: log.target_id,
        details: log.details,
        createdAt: log.created_at,
        superAdminId: log.super_admin_id,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
      }));

      setAuditLogs(formattedLogs);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  // Log audit action
  const logAuditAction = async (
    action: string,
    targetType: string,
    targetId: string,
    details: any,
  ) => {
    if (!isAuthorized) return;

    try {
      // In a real implementation, you would get the super admin ID from the session
      // For now, we'll use a placeholder
      await supabase.from("super_admin_audit_log").insert({
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        super_admin_id: "00000000-0000-0000-0000-000000000000", // Placeholder
        ip_address: null, // Would be captured from request
        user_agent: navigator.userAgent,
      });
    } catch (err) {
      console.error("Failed to log audit action:", err);
    }
  };

  // Get school statistics
  const getSchoolStatistics = () => {
    return {
      totalSchools: schools.length,
      activeSchools: schools.filter((s) => s.subscriptionStatus === "active")
        .length,
      inactiveSchools: schools.filter(
        (s) => s.subscriptionStatus === "inactive",
      ).length,
      suspendedSchools: schools.filter(
        (s) => s.subscriptionStatus === "suspended",
      ).length,
      totalStudents: schools.reduce(
        (sum, school) => sum + (school.studentCount || 0),
        0,
      ),
      totalTeachers: schools.reduce(
        (sum, school) => sum + (school.teacherCount || 0),
        0,
      ),
      totalAdmins: schools.reduce(
        (sum, school) => sum + (school.adminCount || 0),
        0,
      ),
    };
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchSchools();
      fetchAuditLogs();
    }
  }, [isAuthorized]);

  return {
    schools,
    auditLogs,
    loading,
    error,
    createSchool,
    updateSchool,
    deleteSchool,
    toggleSchoolStatus,
    fetchSchools,
    fetchAuditLogs,
    getSchoolStatistics,
    isAuthorized,
  };
}
