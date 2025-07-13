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

// Demo credentials that will work with simple authentication
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
        // For demo purposes, assign role based on email
        const demoUser = demoCredentials.find(cred => cred.email === user.email);
        return demoUser ? [demoUser.role] : ['student'];
      }

      return data ? data.map((item: any) => item.roles.name) : [];
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      // For demo purposes, assign role based on email
      const demoUser = demoCredentials.find(cred => cred.email === user.email);
      return demoUser ? [demoUser.role] : ['student'];
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
      // Check if this is a demo credential
      const demoUser = demoCredentials.find(cred => cred.email === email && cred.password === password);
      
      if (demoUser) {
        // For demo purposes, create a mock session
        const mockUser: AppUser = {
          id: `demo-${demoUser.role}`,
          email: demoUser.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          identities: [],
          aud: 'authenticated',
          role: 'authenticated',
          roles: [demoUser.role]
        };
        
        setUser(mockUser);
        // Store in localStorage for persistence
        localStorage.setItem('demo_user', JSON.stringify(mockUser));
        return;
      }

      // Try regular Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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
      // Clear demo user from localStorage
      localStorage.removeItem('demo_user');
      setUser(null);
      
      // Also sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Check for demo user in localStorage on initialization
  useEffect(() => {
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser && !user) {
      try {
        const parsedUser = JSON.parse(demoUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('demo_user');
      }
    }
  }, []);

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