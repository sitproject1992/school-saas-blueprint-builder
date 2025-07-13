import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppUser {
  id: string;
  email: string;
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

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'admin@skooler.com',
    password: 'admin123',
    roles: ['school_admin']
  },
  {
    id: '2',
    email: 'teacher@skooler.com',
    password: 'teacher123',
    roles: ['teacher']
  },
  {
    id: '3',
    email: 'student@skooler.com',
    password: 'student123',
    roles: ['student']
  },
  {
    id: '4',
    email: 'parent@skooler.com',
    password: 'parent123',
    roles: ['parent']
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('skooler_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('skooler_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    
    const authUser: AppUser = {
      id: foundUser.id,
      email: foundUser.email,
      roles: foundUser.roles
    };
    
    setUser(authUser);
    localStorage.setItem('skooler_user', JSON.stringify(authUser));
  };

  const signUp = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, create a new user with student role
    const newUser: AppUser = {
      id: Date.now().toString(),
      email,
      roles: ['student']
    };
    
    setUser(newUser);
    localStorage.setItem('skooler_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('skooler_user');
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