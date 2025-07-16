import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AppUser extends User {
  profile: any; // Replace 'any' with a proper profile type
  roles?: string[]; // Add roles for compatibility
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user: User) => {
    try {
      // Try to fetch profile by user_id first
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // If that fails, try by id column
      if (error || !data) {
        const result = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error("Error fetching user profile:", error);
        // Return a minimal profile for authentication to work
        return {
          id: user.id,
          user_id: user.id,
          email: user.email,
          first_name: user.email?.split("@")[0] || "User",
          last_name: "",
          role: "student",
          user_role: "student",
          school_id: null,
        };
      }

      return data;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      // Return a minimal profile for authentication to work
      return {
        id: user.id,
        user_id: user.id,
        email: user.email,
        first_name: user.email?.split("@")[0] || "User",
        last_name: "",
        role: "student",
        user_role: "student",
        school_id: null,
      };
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        // Check if super admin is logged in via localStorage
        const superAdminSession = localStorage.getItem("super_admin_session");
        if (superAdminSession) {
          try {
            const adminData = JSON.parse(superAdminSession);
            if (
              adminData.email === "sujan1nepal@gmail.com" &&
              adminData.expiresAt > Date.now()
            ) {
              const mockUser = {
                id: "00000000-0000-0000-0000-000000000000",
                email: adminData.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                profile: {
                  role: "super_admin",
                  first_name: "Super",
                  last_name: "Admin",
                  email: adminData.email,
                  school_id: null,
                },
                roles: ["super_admin"],
              } as AppUser;

              setUser(mockUser);
              setLoading(false);
              return;
            } else {
              // Session expired, remove it
              localStorage.removeItem("super_admin_session");
            }
          } catch (e) {
            localStorage.removeItem("super_admin_session");
          }
        }

        try {
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("Session error:", sessionError);
            return;
          }

          if (session?.user) {
            const profile = await fetchUserProfile(session.user);
            setUser({
              ...session.user,
              profile,
              roles: profile?.role
                ? [profile.role]
                : profile?.user_role
                  ? [profile.user_role]
                  : [],
            });
          }
        } catch (sessionError) {
          console.error("Error getting session:", sessionError);
          // Continue with the fallback authentication methods
        }
      } catch (error) {
        console.error("Error in bootstrapAuth:", error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user);
          setUser({
            ...session.user,
            profile,
            roles: profile?.role
              ? [profile.role]
              : profile?.user_role
                ? [profile.user_role]
                : [],
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        // On error, still clear the user to prevent auth loops
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Trim inputs to avoid whitespace issues
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Check if it's the super admin account
      if (
        trimmedEmail === "sujan1nepal@gmail.com" &&
        trimmedPassword === "precioussn"
      ) {
        // Handle super admin login - create a mock session with persistence
        const sessionData = {
          email: trimmedEmail,
          loginTime: Date.now(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        localStorage.setItem(
          "super_admin_session",
          JSON.stringify(sessionData),
        );

        const mockUser = {
          id: "00000000-0000-0000-0000-000000000000",
          email: trimmedEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profile: {
            role: "super_admin",
            first_name: "Super",
            last_name: "Admin",
            email: trimmedEmail,
            school_id: null,
          },
          roles: ["super_admin"],
        } as AppUser;

        setUser(mockUser);
        return;
      }

      // Check if it's a demo account
      const demoAccounts = [
        {
          email: "admin@skooler.com",
          password: "admin123",
          role: "school_admin",
          user_id: "11111111-1111-1111-1111-111111111111",
        },
        {
          email: "teacher@skooler.com",
          password: "teacher123",
          role: "teacher",
          user_id: "22222222-2222-2222-2222-222222222222",
        },
        {
          email: "student@skooler.com",
          password: "student123",
          role: "student",
          user_id: "33333333-3333-3333-3333-333333333333",
        },
        {
          email: "parent@skooler.com",
          password: "parent123",
          role: "parent",
          user_id: "44444444-4444-4444-4444-444444444444",
        },
      ];

      const demoAccount = demoAccounts.find(
        (acc) =>
          acc.email.toLowerCase() === trimmedEmail &&
          acc.password === trimmedPassword,
      );

      if (demoAccount) {
        // Handle demo login - create a mock session
        const mockUser = {
          id: demoAccount.user_id,
          email: trimmedEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profile: {
            role: demoAccount.role,
            first_name:
              demoAccount.role.charAt(0).toUpperCase() +
              demoAccount.role.slice(1),
            last_name: "Demo",
            email: trimmedEmail,
            school_id: "demo-school",
          },
          roles: [demoAccount.role],
        } as AppUser;

        setUser(mockUser);
        return;
      }

      // Check if it's a school admin account created through super admin panel
      const { data: schoolAdminData, error: schoolAdminError } = await supabase
        .from("school_admin_accounts")
        .select(
          `
          *,
          schools!inner(
            id,
            name,
            subdomain
          )
        `,
        )
        .eq("email", trimmedEmail)
        .eq("is_active", true)
        .single();

      if (!schoolAdminError && schoolAdminData) {
        // For now, we'll do a simple password check (in production, this should be properly hashed)
        if (schoolAdminData.password_hash === trimmedPassword) {
          // Create a mock user session for the school admin
          const mockUser = {
            id: schoolAdminData.id,
            email: trimmedEmail,
            created_at: schoolAdminData.created_at,
            updated_at: schoolAdminData.updated_at,
            profile: {
              role: "school_admin",
              first_name: schoolAdminData.first_name,
              last_name: schoolAdminData.last_name,
              email: trimmedEmail,
              phone: schoolAdminData.phone,
              school_id: schoolAdminData.school_id,
              school_name: schoolAdminData.schools?.name,
            },
            roles: ["school_admin"],
          } as AppUser;

          setUser(mockUser);

          // Update last login
          await supabase
            .from("school_admin_accounts")
            .update({ last_login: new Date().toISOString() })
            .eq("id", schoolAdminData.id);

          return;
        } else {
          throw new Error(
            `Invalid password for school admin account "${trimmedEmail}". Please check your password or contact your super administrator.`,
          );
        }
      }

      // Check if credentials might be for a demo account with wrong password
      const isDemoEmail = demoAccounts.some(
        (acc) => acc.email.toLowerCase() === trimmedEmail,
      );

      if (isDemoEmail) {
        const demoAccountForEmail = demoAccounts.find(
          (acc) => acc.email.toLowerCase() === trimmedEmail,
        );
        throw new Error(
          `Invalid password for demo account "${trimmedEmail}". The correct password is "${demoAccountForEmail?.password}". Please use the correct demo credentials or try the "Demo Access" tab for quick login.`,
        );
      }

      // Regular Supabase auth for non-demo accounts
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (error) {
          // Handle different types of errors
          if (error.message.includes("Database error querying schema")) {
            throw new Error(
              `Database connection issue. Please try again in a moment, or use one of the demo accounts for immediate access:\n\n${demoAccounts.map((acc) => `${acc.email} (${acc.password})`).join("\n")}\n\nUse the "Demo Access" tab for quick login.`,
            );
          } else if (error.message === "Invalid login credentials") {
            const availableDemoEmails = demoAccounts
              .map((acc) => acc.email)
              .join(", ");
            throw new Error(
              `Login failed. Please check your credentials or try one of the demo accounts:\n\n${availableDemoEmails}\n\nUse the "Demo Access" tab for quick access to demo accounts.`,
            );
          }
          throw error;
        }
      } catch (authError: any) {
        console.error("Supabase auth error:", authError);
        // If it's a database schema error, suggest demo accounts
        if (
          authError.message?.includes("Database error querying schema") ||
          authError.message?.includes("schema")
        ) {
          throw new Error(
            `Database connection issue detected. Please try one of the demo accounts for immediate access:\n\n${demoAccounts.map((acc) => `${acc.email} (password: ${acc.password})`).join("\n")}\n\nSwitch to the "Demo Access" tab for quick login, or contact support if this issue persists.`,
          );
        }
        throw authError;
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear super admin session if exists
      localStorage.removeItem("super_admin_session");

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Reset user state
      setUser(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
