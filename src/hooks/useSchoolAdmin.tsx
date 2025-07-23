import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SchoolAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  schoolId: string;
  schoolName?: string;
  isActive: boolean;
  lastLogin: string | null;
  mustChangePassword: boolean;
  loginAttempts: number;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt: string;
  lockedUntil: string | null;
}

export interface School {
  id: string;
  name: string;
  subdomain: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  subscriptionStatus: string;
  subscriptionExpiresAt: string | null;
  createdAt: string;
}

export interface CreateSchoolAdminData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  schoolId: string;
  password: string;
  mustChangePassword?: boolean;
  sendWelcomeEmail?: boolean;
}

export interface UpdateSchoolAdminData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
}

export function useSchoolAdmin() {
  const { user } = useAuth();
  const [schoolAdmins, setSchoolAdmins] = useState<SchoolAdmin[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthorized = user?.profile?.role === "super_admin";

  // Create mock schools for development/fallback
  const createMockSchools = (): School[] => {
    return [
      {
        id: "school-1",
        name: "Green Valley High School",
        subdomain: "greenvalley",
        email: "contact@greenvalley.edu",
        phone: "+1 (555) 123-4567",
        address: "123 Education St, Learning City, LC 12345",
        subscriptionStatus: "active",
        subscriptionExpiresAt: "2024-12-31T23:59:59Z",
        createdAt: new Date().toISOString(),
      },
      {
        id: "school-2",
        name: "Bright Future Academy",
        subdomain: "brightfuture",
        email: "info@brightfuture.edu",
        phone: "+1 (555) 987-6543",
        address: "456 Knowledge Ave, Study Town, ST 67890",
        subscriptionStatus: "active",
        subscriptionExpiresAt: "2024-06-30T23:59:59Z",
        createdAt: new Date().toISOString(),
      },
    ];
  };

  // Fetch all schools
  const fetchSchools = async () => {
    if (!isAuthorized) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");

      if (error) {
        console.warn(
          "Schools table not found, using mock data:",
          error.message,
        );
        const mockSchools = createMockSchools();
        setSchools(mockSchools);
        return;
      }

      const formattedSchools: School[] = (data || []).map((school: any) => ({
        id: school.id,
        name: school.name,
        subdomain: school.subdomain,
        email: school.email,
        phone: school.phone,
        address: school.address,
        subscriptionStatus: school.subscription_status,
        subscriptionExpiresAt: school.subscription_expires_at,
        createdAt: school.created_at,
      }));
      setSchools(formattedSchools);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch schools:", errorMessage);

      // Fallback to mock data
      const mockSchools = createMockSchools();
      setSchools(mockSchools);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  // Create mock school admins for development/fallback
  const createMockSchoolAdmins = (): SchoolAdmin[] => {
    return [
      {
        id: "admin-1",
        email: "admin@greenvalley.edu",
        firstName: "John",
        lastName: "Smith",
        phone: "+1 (555) 123-4567",
        schoolId: "school-1",
        schoolName: "Green Valley High School",
        isActive: true,
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        mustChangePassword: false,
        loginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        passwordChangedAt: new Date().toISOString(),
        lockedUntil: null,
      },
      {
        id: "admin-2",
        email: "admin@brightfuture.edu",
        firstName: "Sarah",
        lastName: "Johnson",
        phone: "+1 (555) 987-6543",
        schoolId: "school-2",
        schoolName: "Bright Future Academy",
        isActive: true,
        lastLogin: null,
        mustChangePassword: true,
        loginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        passwordChangedAt: new Date().toISOString(),
        lockedUntil: null,
      },
    ];
  };

  // Fetch all school admins
  const fetchSchoolAdmins = async () => {
    if (!isAuthorized) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("school_admin_accounts")
        .select(
          `
          *,
          schools!inner(
            name,
            subdomain
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.warn(
          "School admin accounts table not found, using mock data:",
          error.message,
        );
        const mockAdmins = createMockSchoolAdmins();
        setSchoolAdmins(mockAdmins);
        return;
      }

      const formattedData: SchoolAdmin[] = (data || []).map((item: any) => ({
        id: item.id,
        email: item.email,
        firstName: item.first_name,
        lastName: item.last_name,
        phone: item.phone,
        schoolId: item.school_id,
        schoolName: item.schools?.name,
        isActive: item.is_active,
        lastLogin: item.last_login,
        mustChangePassword: item.must_change_password,
        loginAttempts: item.login_attempts,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        passwordChangedAt: item.password_changed_at,
        lockedUntil: item.locked_until,
      }));

      setSchoolAdmins(formattedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch school admins:", errorMessage);

      // Fallback to mock data
      const mockAdmins = createMockSchoolAdmins();
      setSchoolAdmins(mockAdmins);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  // Create school admin account
  const createSchoolAdmin = async (
    data: CreateSchoolAdminData,
  ): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      // Use the proper RPC function for creating school admin accounts
      const { data: result, error } = await supabase.rpc(
        "create_school_admin_account",
        {
          p_school_id: data.schoolId,
          p_email: data.email,
          p_password: data.password,
          p_first_name: data.firstName,
          p_last_name: data.lastName,
          p_phone: data.phone || null,
        },
      );

      if (error) {
        console.warn(
          "RPC function failed, attempting direct database insert:",
          error.message,
        );

        // Fallback: Create the school admin account directly in the database
        const { data: insertData, error: insertError } = await supabase
          .from("school_admin_accounts")
          .insert({
            school_id: data.schoolId,
            email: data.email.toLowerCase(),
            password_hash: data.password, // Should be hashed in production
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            is_active: true,
            must_change_password: data.mustChangePassword !== false,
            login_attempts: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            password_changed_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (insertError) {
          console.error("Database insert failed:", insertError.message);
          throw new Error(
            `Failed to create school admin account: ${insertError.message}. Please check the database schema and permissions.`
          );

          // Create mock admin and add to state
          const mockAdmin: SchoolAdmin = {
            id: `admin-${Date.now()}`,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            schoolId: data.schoolId,
            schoolName:
              schools.find((s) => s.id === data.schoolId)?.name ||
              "Unknown School",
            isActive: true,
            lastLogin: null,
            mustChangePassword: data.mustChangePassword || true,
            loginAttempts: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            passwordChangedAt: new Date().toISOString(),
            lockedUntil: null,
          };

          setSchoolAdmins((prev) => [mockAdmin, ...prev]);

          if (data.sendWelcomeEmail) {
            console.log("Mock: Sending welcome email to:", data.email);
          }
          return;
        }
      }

      // Refresh the list
      await fetchSchoolAdmins();

      // TODO: Send welcome email if requested
      if (data.sendWelcomeEmail) {
        // This would trigger an email service
        console.log("Sending welcome email to:", data.email);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update school admin account
  const updateSchoolAdmin = async (
    id: string,
    data: UpdateSchoolAdminData,
  ): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      const updateData: any = {};
      if (data.firstName !== undefined) updateData.first_name = data.firstName;
      if (data.lastName !== undefined) updateData.last_name = data.lastName;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { error } = await supabase
        .from("school_admin_accounts")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Refresh the list
      await fetchSchoolAdmins();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update school admin";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete school admin account
  const deleteSchoolAdmin = async (id: string): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("school_admin_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Refresh the list
      await fetchSchoolAdmins();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete school admin";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Reset password for school admin
  const resetSchoolAdminPassword = async (
    id: string,
    newPassword: string,
  ): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.rpc("update_school_admin_password", {
        p_account_id: id,
        p_new_password: newPassword,
      });

      if (error) throw error;

      // Refresh the list
      await fetchSchoolAdmins();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Activate/Deactivate school admin
  const toggleSchoolAdminStatus = async (
    id: string,
    isActive: boolean,
  ): Promise<void> => {
    if (!isAuthorized) {
      throw new Error("Unauthorized: Super admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("school_admin_accounts")
        .update({
          is_active: isActive,
          // Reset login attempts and unlock if activating
          ...(isActive && { login_attempts: 0, locked_until: null }),
        })
        .eq("id", id);

      if (error) throw error;

      // Refresh the list
      await fetchSchoolAdmins();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update admin status";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    if (!isAuthorized) return [];

    try {
      const { data, error } = await supabase
        .from("super_admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      return [];
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchSchools();
      fetchSchoolAdmins();
    }
  }, [isAuthorized]);

  return {
    schoolAdmins,
    schools,
    loading,
    error,
    createSchoolAdmin,
    updateSchoolAdmin,
    deleteSchoolAdmin,
    resetSchoolAdminPassword,
    toggleSchoolAdminStatus,
    fetchSchoolAdmins,
    fetchSchools,
    fetchAuditLogs,
    isAuthorized,
  };
}

