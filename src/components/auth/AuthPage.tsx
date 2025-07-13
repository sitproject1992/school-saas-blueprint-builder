import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        alert('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl grid gap-6 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Enter your email and password to login.' : 'Create an account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </div>
            </form>
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="w-full mt-4">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Button>
          </CardContent>
        </Card>

        {/* Demo Credentials Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Demo Credentials</CardTitle>
            <CardDescription>
              Click any button below to quickly login with different user roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin('admin@skooler.com', 'admin123')}
                >
                  <div className="text-left">
                    <div className="font-medium">School Admin</div>
                    <div className="text-sm text-muted-foreground">admin@skooler.com / admin123</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin('teacher@skooler.com', 'teacher123')}
                >
                  <div className="text-left">
                    <div className="font-medium">Teacher</div>
                    <div className="text-sm text-muted-foreground">teacher@skooler.com / teacher123</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin('student@skooler.com', 'student123')}
                >
                  <div className="text-left">
                    <div className="font-medium">Student</div>
                    <div className="text-sm text-muted-foreground">student@skooler.com / student123</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin('parent@skooler.com', 'parent123')}
                >
                  <div className="text-left">
                    <div className="font-medium">Parent</div>
                    <div className="text-sm text-muted-foreground">parent@skooler.com / parent123</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
