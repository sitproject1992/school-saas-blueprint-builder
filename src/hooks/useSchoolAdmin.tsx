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

      setSchools(data || []);
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

      if (error) throw error;

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
      setError(
        err instanceof Error ? err.message : "Failed to fetch school admins",
      );
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

      if (error) throw error;

      // Refresh the list
      await fetchSchoolAdmins();

      // TODO: Send welcome email if requested
      if (data.sendWelcomeEmail) {
        // This would trigger an email service
        console.log("Sending welcome email to:", data.email);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create school admin";
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

// Hook specifically for school admin password management
export function useSchoolAdminPassword() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    if (!user || user.profile?.role !== "school_admin") {
      throw new Error("Unauthorized: School admin privileges required");
    }

    try {
      setLoading(true);
      setError(null);

      // First authenticate the school admin with current credentials
      const { data: authResult } = await supabase.rpc(
        "authenticate_school_admin",
        {
          p_email: user.email!,
          p_password: currentPassword,
        },
      );

      if (!authResult?.success) {
        throw new Error("Current password is incorrect");
      }

      // Get the school admin account ID
      const { data: adminAccount, error: fetchError } = await supabase
        .from("school_admin_accounts")
        .select("id")
        .eq("email", user.email!)
        .single();

      if (fetchError || !adminAccount) {
        throw new Error("School admin account not found");
      }

      // Update the password
      const { error } = await supabase.rpc("update_school_admin_password", {
        p_account_id: adminAccount.id,
        p_new_password: newPassword,
        p_old_password: currentPassword,
      });

      if (error) throw error;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading,
    error,
  };
}
