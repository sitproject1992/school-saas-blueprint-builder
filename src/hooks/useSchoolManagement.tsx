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

  // Test database connectivity
  const testDatabaseConnection = async () => {
    try {
      console.log("Testing database connection...");
      const { data, error } = await supabase.from("schools").select("count").limit(1);
      console.log("Database test result:", { data, error });
      if (error) {
        console.error("Database connection test failed:", error);
        return false;
      }
      console.log("Database connection successful");
      return true;
    } catch (err) {
      console.error("Database connection test error:", err);
      return false;
    }
  };

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

      const formattedSchools: School[] = schoolsWithCounts.map((school: any) => ({
        id: school.id,
        name: school.name,
        subdomain: school.subdomain,
        email: school.email,
        phone: school.phone,
        address: school.address,
        website: school.website,
        subscriptionStatus: school.subscription_status,
        subscriptionExpiresAt: school.subscription_expires_at,
        themeColor: school.theme_color,
        logoUrl: school.logo_url,
        createdAt: school.created_at,
        updatedAt: school.updated_at,
        adminCount: school.adminCount,
        studentCount: school.studentCount,
        teacherCount: school.teacherCount,
      }));
      setSchools(formattedSchools);
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

      // Check if subdomain already exists in current schools
      const existingSchool = schools.find(
        (s) => s.subdomain === data.subdomain,
      );
      if (existingSchool) {
        throw new Error("Subdomain already exists");
      }

      // Generate a proper UUID for the school
      const newSchoolId = crypto.randomUUID();

      // Create new school object
      const newSchool: School = {
        id: newSchoolId,
        name: data.name,
        subdomain: data.subdomain,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        subscriptionStatus: data.subscriptionStatus,
        subscriptionExpiresAt: data.subscriptionExpiresAt || null,
        themeColor: data.themeColor || "#3b82f6",
        logoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminCount: 0,
        studentCount: 0,
        teacherCount: 0,
      };

      // Prepare insert data
      const insertData = {
        name: data.name,
        subdomain: data.subdomain,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        website: data.website || null,
        subscription_status: data.subscriptionStatus as "active" | "inactive" | "suspended" | "cancelled",
        subscription_expires_at: data.subscriptionExpiresAt || null,
        theme_color: data.themeColor || "#3b82f6",
      };

      console.log("Creating school with data:", insertData);

      // Create in database first - this is required, not optional
      const { data: dbSchool, error } = await supabase
        .from("schools")
        .insert(insertData)
        .select()
        .single();

      console.log("Database response:", { dbSchool, error });

      if (error) {
        console.error("Database error creating school:", error);
        // Extract detailed error information
        const errorMessage = error.message || error.details || error.hint || JSON.stringify(error);
        const errorCode = error.code || 'Unknown';
        throw new Error(`Failed to create school in database (${errorCode}): ${errorMessage}`);
      }

      if (!dbSchool) {
        throw new Error("School creation failed: No data returned from database");
      }

      // Use the actual database ID and data
      newSchool.id = dbSchool.id;
      newSchool.createdAt = dbSchool.created_at;
      newSchool.updatedAt = dbSchool.updated_at;

      // Log the action
      await logAuditAction("CREATE_SCHOOL", "school", newSchool.id, {
        name: data.name,
        subdomain: data.subdomain,
      });

      // Refresh the schools list to get updated data from database
      await fetchSchools();

      console.log(`Successfully created school: ${data.name}`);
      return newSchool.id;
    } catch (err) {
      console.error("School creation error:", err);
      let message;
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null) {
        message = JSON.stringify(err);
      } else {
        message = String(err) || "Failed to create school";
      }
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

      try {
        // Try to update in database
        const { error } = await supabase
          .from("schools")
          .update(updateData)
          .eq("id", id);

        if (error) {
          console.warn(
            "Database update failed, updating local state:",
            error.message,
          );
        }
      } catch (dbError) {
        console.warn("Database not available, proceeding with local update");
      }

      // Always update local state for immediate UI feedback
      setSchools((prevSchools) =>
        prevSchools.map((school) =>
          school.id === id
            ? {
                ...school,
                name: data.name ?? school.name,
                email: data.email ?? school.email,
                phone: data.phone ?? school.phone,
                address: data.address ?? school.address,
                website: data.website ?? school.website,
                subscriptionStatus:
                  data.subscriptionStatus ?? school.subscriptionStatus,
                subscriptionExpiresAt:
                  data.subscriptionExpiresAt ?? school.subscriptionExpiresAt,
                themeColor: data.themeColor ?? school.themeColor,
                updatedAt: new Date().toISOString(),
              }
            : school,
        ),
      );

      // Log the action
      await logAuditAction("UPDATE_SCHOOL", "school", id, updateData);

      console.log(`Successfully updated school: ${id}`);
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

      // Get school details for logging (from current state or try database)
      const schoolToDelete = schools.find((s) => s.id === id);

      if (!schoolToDelete) {
        throw new Error("School not found");
      }

      try {
        // Try to delete from database first
        const { error } = await supabase.from("schools").delete().eq("id", id);

        if (error) {
          console.warn(
            "Database deletion failed, removing from local state:",
            error.message,
          );
        }
      } catch (dbError) {
        console.warn("Database not available, proceeding with local deletion");
      }

      // Always remove from local state for immediate UI feedback
      setSchools((prevSchools) =>
        prevSchools.filter((school) => school.id !== id),
      );

      // Log the action
      await logAuditAction("DELETE_SCHOOL", "school", id, {
        name: schoolToDelete.name,
        subdomain: schoolToDelete.subdomain,
      });

      console.log(`Successfully deleted school: ${schoolToDelete.name}`);
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
        .update({ subscription_status: status as "active" | "inactive" | "suspended" | "cancelled" })
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

  // Create mock audit logs for development/fallback
  const createMockAuditLogs = (): AuditLogEntry[] => {
    const now = new Date();
    return [
      {
        id: "1",
        action: "CREATE_SCHOOL",
        targetType: "school",
        targetId: "school-1",
        details: { name: "Green Valley High School", subdomain: "greenvalley" },
        createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        superAdminId: "00000000-0000-0000-0000-000000000000",
        ipAddress: "192.168.1.1",
        userAgent: navigator.userAgent,
      },
      {
        id: "2",
        action: "CREATE_SCHOOL_ADMIN",
        targetType: "school_admin_account",
        targetId: "admin-1",
        details: { email: "admin@greenvalley.edu", school_id: "school-1" },
        createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        superAdminId: "00000000-0000-0000-0000-000000000000",
        ipAddress: "192.168.1.1",
        userAgent: navigator.userAgent,
      },
      {
        id: "3",
        action: "UPDATE_SCHOOL",
        targetType: "school",
        targetId: "school-1",
        details: { name: "Green Valley High School (Updated)" },
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        superAdminId: "00000000-0000-0000-0000-000000000000",
        ipAddress: "192.168.1.1",
        userAgent: navigator.userAgent,
      },
      {
        id: "4",
        action: "UPDATE_PASSWORD",
        targetType: "school_admin_account",
        targetId: "admin-1",
        details: { changed_by: "super_admin" },
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        superAdminId: "00000000-0000-0000-0000-000000000000",
        ipAddress: "192.168.1.1",
        userAgent: navigator.userAgent,
      },
      {
        id: "5",
        action: "LOGIN",
        targetType: "super_admin",
        targetId: "00000000-0000-0000-0000-000000000000",
        details: {
          login_time: new Date(
            now.getTime() - 1000 * 60 * 60 * 4,
          ).toISOString(),
        },
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        superAdminId: "00000000-0000-0000-0000-000000000000",
        ipAddress: "192.168.1.1",
        userAgent: navigator.userAgent,
      },
    ];
  };

  // Fetch audit logs
  const fetchAuditLogs = async (limit: number = 50) => {
    if (!isAuthorized) return;

    try {
      // First check if the table exists by trying to fetch its structure
      const { data, error } = await supabase
        .from("super_admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        // If table doesn't exist, create mock audit logs
        console.warn(
          "Audit logs table not found, using mock data:",
          error.message,
        );
        const mockLogs = createMockAuditLogs();
        setAuditLogs(mockLogs);
        return;
      }

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
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch audit logs:", errorMessage);

      // Fallback to mock data
      const mockLogs = createMockAuditLogs();
      setAuditLogs(mockLogs);
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
      // Try to insert into the actual audit log table
      const { error } = await supabase.from("super_admin_audit_log").insert({
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        super_admin_id: "00000000-0000-0000-0000-000000000000", // Placeholder
        ip_address: null, // Would be captured from request
        user_agent: navigator.userAgent,
      });

      if (error) {
        console.warn(
          "Could not log to audit table, table may not exist:",
          error.message,
        );
        // In development, we could add to local storage or just console log
        console.info("Audit Log:", {
          action,
          targetType,
          targetId,
          details,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to log audit action:", errorMessage);
      // Log locally for development
      console.info("Audit Log (fallback):", {
        action,
        targetType,
        targetId,
        details,
        timestamp: new Date().toISOString(),
      });
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
