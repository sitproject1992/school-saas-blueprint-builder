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

// Demo credentials that will create/login real Supabase users
const demoCredentials = [
  { email: 'admin@skooler.com', password: 'admin123', role: 'school_admin' },
  { email: 'teacher@skooler.com', password: 'teacher123', role: 'teacher' },
  { email: 'student@skooler.com', password: 'student123', role: 'student' },
  { email: 'parent@skooler.com', password: 'parent123', role: 'parent' }
];

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
        return [];
      }

      return data ? data.map((item: any) => item.roles.name) : [];
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      return [];
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

  const createDemoUserProfile = async (userId: string, email: string, role: string) => {
    try {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          first_name: role.charAt(0).toUpperCase() + role.slice(1),
          last_name: 'Demo',
          email: email,
          role: role as any
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      // Get or create role
      const { data: roleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', role)
        .single();

      if (roleData) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role_id: roleData.id
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
        }
      }
    } catch (error) {
      console.error('Error creating demo user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check if this is a demo credential
      const demoUser = demoCredentials.find(cred => cred.email === email && cred.password === password);
      
      // Try to sign in with Supabase first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If user doesn't exist and it's a demo credential, create them
      if (error && error.message.includes('Invalid login credentials') && demoUser) {
        console.log(`Creating demo user: ${email}`);
        
        // Create the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined // Skip email confirmation for demo users
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          await createDemoUserProfile(signUpData.user.id, email, demoUser.role);
        }
      } else if (error) {
        throw error;
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