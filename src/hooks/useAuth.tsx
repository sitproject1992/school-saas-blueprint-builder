import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AppUser extends User {
  roles: string[];
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

  const fetchUserRoles = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        // Assign role based on email for demo purposes
        if (user.email?.includes('superadmin@skooler.com')) return ['super_admin'];
        if (user.email?.includes('admin@skooler.com')) return ['school_admin'];
        if (user.email?.includes('teacher@skooler.com')) return ['teacher'];
        if (user.email?.includes('student@skooler.com')) return ['student'];
        if (user.email?.includes('parent@skooler.com')) return ['parent'];
        return ['student'];
      }

      return data ? data.map((item: any) => item.roles.name) : [];
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      return ['student'];
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const roles = await fetchUserRoles(session.user);
          setUser({ ...session.user, roles });
        }
      } catch (error) {
        console.error('Error in bootstrapAuth:', error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const roles = await fetchUserRoles(session.user);
          setUser({ ...session.user, roles });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Special handling for super admin
      if (email === 'superadmin@skooler.com' && password === 'SuperAdmin123!') {
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error && error.message.includes('Invalid login credentials')) {
            // Create the super admin user if it doesn't exist
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: undefined }
            });
            
            if (signUpError && !signUpError.message.includes('already')) {
              throw signUpError;
            }
            
            // Try to sign in again after creation
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (retryError) {
              throw retryError;
            }
          } else if (error) {
            throw error;
          }
        } catch (createError) {
          console.error('Error with super admin:', createError);
          throw createError;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
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
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}