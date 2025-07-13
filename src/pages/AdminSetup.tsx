import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  School,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminSetupData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  position: string;
}

export default function AdminSetup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [adminData, setAdminData] = useState<AdminSetupData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    position: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get school data from state or localStorage
    const stateData = location.state?.schoolData;
    const storedData = localStorage.getItem("schoolRegistrationData");

    if (stateData) {
      setSchoolData(stateData);
      setAdminData((prev) => ({
        ...prev,
        email: stateData.adminEmail || "",
        firstName: stateData.adminFirstName || "",
        lastName: stateData.adminLastName || "",
        phone: stateData.adminPhone || "",
        position: stateData.adminPosition || "",
      }));
    } else if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setSchoolData(parsed);
        setAdminData((prev) => ({
          ...prev,
          email: parsed.adminEmail || "",
          firstName: parsed.adminFirstName || "",
          lastName: parsed.adminLastName || "",
          phone: parsed.adminPhone || "",
          position: parsed.adminPosition || "",
        }));
      } catch (error) {
        console.error("Error parsing stored data:", error);
        navigate("/school-registration");
      }
    } else {
      // No school data found, redirect to registration
      navigate("/school-registration");
    }
  }, [location.state, navigate]);

  const handleInputChange = (field: keyof AdminSetupData, value: string) => {
    setAdminData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (
      !adminData.email ||
      !adminData.password ||
      !adminData.confirmPassword ||
      !adminData.firstName ||
      !adminData.lastName
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (adminData.password !== adminData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    if (adminData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !schoolData) return;

    setIsLoading(true);
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: authData.user.id,
              email: adminData.email,
              first_name: adminData.firstName,
              last_name: adminData.lastName,
              phone: adminData.phone,
              role: "school_admin",
              school_id: schoolData.schoolId,
            },
          ])
          .select()
          .single();

        if (profileError) throw profileError;

        // 3. Create admin role assignment
        const { error: roleError } = await supabase.from("user_roles").insert([
          {
            user_id: authData.user.id,
            role_id: "school_admin", // We'll need to create this role in the system
          },
        ]);

        if (roleError) {
          console.warn("Role assignment error:", roleError);
          // Don't fail the entire process for role assignment
        }

        // Clear stored registration data
        localStorage.removeItem("schoolRegistrationData");

        toast({
          title: "Admin Setup Complete!",
          description: "Your admin account has been created successfully.",
        });

        // Navigate to teacher registration
        navigate("/teacher-registration", {
          state: {
            schoolId: schoolData.schoolId,
            adminSetupComplete: true,
          },
        });
      }
    } catch (error: any) {
      console.error("Admin setup error:", error);
      toast({
        title: "Setup Failed",
        description:
          error.message || "Failed to create admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!schoolData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Set Up Admin Account
              </h1>
              <p className="text-muted-foreground">
                Create your administrator login for {schoolData.schoolName}
              </p>
            </div>
          </div>
        </div>

        {/* School Info */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  School Registered Successfully
                </h3>
                <p className="text-sm text-green-700">
                  {schoolData.schoolName} has been registered. Now let's set up
                  your admin access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Setup Form */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Administrator Account
            </CardTitle>
            <CardDescription>
              This account will have full administrative access to your school
              system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={adminData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="First name"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={adminData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={adminData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="admin@yourschool.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be your login email
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={adminData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={adminData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Principal"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={adminData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a strong password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                At least 6 characters long
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={adminData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                Admin Privileges
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Full access to all school modules</li>
                <li>• User management and role assignment</li>
                <li>• System configuration and settings</li>
                <li>• Reports and analytics</li>
                <li>• Financial management</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 text-base"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Admin Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <p className="text-sm text-blue-700">
              After creating your admin account, you'll be able to register
              teachers and then students for your school.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
