import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isDemoAccount, ensureDemoDataExists } from '@/lib/demoAuth';
import { useAuth } from '@/hooks/useAuth';

interface DemoLoginHandlerProps {
  email: string;
  password: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function DemoLoginHandler({ email, password, onSuccess, onError }: DemoLoginHandlerProps) {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    const handleDemoLogin = async () => {
      const demoAccount = isDemoAccount(email, password);
      
      if (demoAccount) {
        try {
          // Ensure demo data exists
          await ensureDemoDataExists();
          
          // For demo purposes, we'll proceed directly to dashboard
          onSuccess();
          navigate('/dashboard');
        } catch (error) {
          console.error('Demo login error:', error);
          onError('Demo login failed. Please try again.');
        }
      } else {
        // Regular login
        try {
          await signIn(email, password);
          onSuccess();
          navigate('/dashboard');
        } catch (error: any) {
          onError(error.message || 'Login failed');
        }
      }
    };

    if (email && password) {
      handleDemoLogin();
    }
  }, [email, password, signIn, navigate, onSuccess, onError]);

  return null;
}