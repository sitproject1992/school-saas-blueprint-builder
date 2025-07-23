import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useSchoolAdminPassword() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      setLoading(true);
      setError(null);

      // Update password using Supabase auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      // If user is a school admin, also update the password in school_admin_accounts table
      if (user.profile?.role === "school_admin") {
        try {
          const { error: adminUpdateError } = await supabase
            .from("school_admin_accounts")
            .update({
              password_changed_at: new Date().toISOString(),
              must_change_password: false,
            })
            .eq("email", user.email);

          if (adminUpdateError) {
            console.warn("Failed to update school admin password metadata:", adminUpdateError);
          }
        } catch (err) {
          // Non-critical error, just log it
          console.warn("Could not update school admin metadata:", err);
        }
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to change password";
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