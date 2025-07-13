import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  School,
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Globe,
} from "lucide-react";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        alert("Account created successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  const demoAccounts = [
    {
      role: "School Admin",
      email: "admin@skooler.com",
      password: "admin123",
      description: "Full system access, manage all modules",
      icon: Shield,
      color: "bg-red-50 border-red-200 text-red-800",
      features: [
        "User Management",
        "Financial Reports",
        "System Settings",
        "All Modules",
      ],
    },
    {
      role: "Teacher",
      email: "teacher@skooler.com",
      password: "teacher123",
      description: "Manage classes, attendance, and student records",
      icon: Users,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      features: [
        "Class Management",
        "Attendance Tracking",
        "Grade Entry",
        "Lesson Plans",
      ],
    },
    {
      role: "Student",
      email: "student@skooler.com",
      password: "student123",
      description: "View assignments, grades, and schedules",
      icon: GraduationCap,
      color: "bg-green-50 border-green-200 text-green-800",
      features: [
        "View Grades",
        "Assignment Submission",
        "Class Schedule",
        "Resources",
      ],
    },
    {
      role: "Parent",
      email: "parent@skooler.com",
      password: "parent123",
      description: "Monitor child progress and school communications",
      icon: UserCheck,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      features: [
        "Student Progress",
        "Attendance Reports",
        "Fee Payments",
        "Communication",
      ],
    },
  ];

  const features = [
    {
      title: "Cloud-Based Platform",
      description:
        "Access from anywhere, anytime with secure cloud infrastructure",
      icon: Globe,
    },
    {
      title: "Mobile-First Design",
      description: "Optimized for all devices with responsive design",
      icon: Smartphone,
    },
    {
      title: "Role-Based Access",
      description: "Secure access controls for different user types",
      icon: Shield,
    },
    {
      title: "Real-Time Updates",
      description: "Live notifications and instant data synchronization",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <School className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Skooler
              </h1>
              <p className="text-sm text-muted-foreground">
                School Management System
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to the future of education management. Sign in to access
            your personalized dashboard.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="login" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
              <TabsTrigger value="login" className="text-base">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="demo" className="text-base">
                Demo Access
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-0">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Login Form */}
                <Card className="w-full shadow-lg border-0">
                  <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-bold">
                      {isLogin ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {isLogin
                        ? "Enter your credentials to access your dashboard"
                        : "Create a new account to get started with Skooler"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 h-12"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 h-12"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {isLogin && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="remember"
                              className="rounded border-gray-300"
                            />
                            <Label
                              htmlFor="remember"
                              className="text-sm text-muted-foreground"
                            >
                              Remember me
                            </Label>
                          </div>
                          <Button variant="link" className="px-0 text-sm">
                            Forgot password?
                          </Button>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          "Please wait..."
                        ) : (
                          <>
                            {isLogin ? "Sign In" : "Create Account"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-base"
                      >
                        {isLogin
                          ? "Don't have an account? Sign Up"
                          : "Already have an account? Sign In"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Why Choose Skooler?
                    </h2>
                    <div className="grid gap-4">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-white rounded-lg border shadow-sm"
                        >
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <feature.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="demo" className="space-y-0">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Try Skooler Demo</h2>
                  <p className="text-muted-foreground">
                    Experience different user roles and explore all features
                    with our demo accounts
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {demoAccounts.map((account, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${account.color}`}>
                            <account.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {account.role}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {account.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm font-medium mb-1">
                            Demo Credentials:
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {account.email} / {account.password}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-2">
                            Available Features:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {account.features.map((feature, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full group-hover:bg-primary/90 transition-colors"
                          onClick={() =>
                            quickLogin(account.email, account.password)
                          }
                        >
                          Try as {account.role}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <School className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Ready to Get Started?
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    After exploring the demo, contact us to set up your school's
                    account
                  </p>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Skooler Inc. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
