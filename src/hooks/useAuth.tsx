import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser({ 
          ...session.user, 
          profile,
          roles: profile?.role ? [profile.role] : []
        });
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
          const profile = await fetchUserProfile(session.user);
          setUser({ 
            ...session.user, 
            profile,
            roles: profile?.role ? [profile.role] : []
          });
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
      // Check if it's a demo account
      const demoAccounts = [
        { email: 'admin@skooler.com', password: 'admin123', role: 'school_admin', user_id: '11111111-1111-1111-1111-111111111111' },
        { email: 'teacher@skooler.com', password: 'teacher123', role: 'teacher', user_id: '22222222-2222-2222-2222-222222222222' },
        { email: 'student@skooler.com', password: 'student123', role: 'student', user_id: '33333333-3333-3333-3333-333333333333' },
        { email: 'parent@skooler.com', password: 'parent123', role: 'parent', user_id: '44444444-4444-4444-4444-444444444444' }
      ];
      
      const demoAccount = demoAccounts.find(acc => acc.email === email && acc.password === password);
      
      if (demoAccount) {
        // Handle demo login - create a mock session
        const mockUser = {
          id: demoAccount.user_id,
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profile: {
            role: demoAccount.role,
            first_name: demoAccount.role.charAt(0).toUpperCase() + demoAccount.role.slice(1),
            last_name: 'Demo',
            email: email,
            school_id: 'demo-school'
          },
          roles: [demoAccount.role]
        } as AppUser;
        
        setUser(mockUser);
        return;
      }

      // Regular Supabase auth for non-demo accounts
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