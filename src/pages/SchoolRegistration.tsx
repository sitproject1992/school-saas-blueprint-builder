import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  School,
  MapPin,
  Mail,
  Phone,
  Globe,
  Building,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SchoolData {
  // Basic Information
  schoolName: string;
  subdomain: string;
  schoolType: string;
  establishedYear: string;

  // Contact Information
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Admin Information
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminPosition: string;

  // School Details
  totalStudents: string;
  totalTeachers: string;
  gradeRange: string;
  curriculum: string;

  // Subscription
  subscriptionPlan: string;
}

const schoolTypes = [
  "Primary School",
  "Secondary School",
  "Higher Secondary School",
  "K-12 School",
  "International School",
  "Montessori School",
  "Special Needs School",
  "Vocational School",
];

const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter Plan",
    price: "₹999/month",
    students: "Up to 100 students",
    features: ["Basic modules", "Email support", "Mobile app"],
  },
  {
    id: "professional",
    name: "Professional Plan",
    price: "₹2999/month",
    students: "Up to 500 students",
    features: [
      "All modules",
      "Priority support",
      "Mobile app",
      "Advanced analytics",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "₹5999/month",
    students: "Unlimited students",
    features: [
      "All features",
      "24/7 support",
      "Custom integrations",
      "Dedicated manager",
    ],
  },
];

export default function SchoolRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [schoolData, setSchoolData] = useState<SchoolData>({
    schoolName: "Global Academy English School",
    subdomain: "global-academy",
    schoolType: "K-12 School",
    establishedYear: "2010",
    email: "sujan1nepal@gmail.com",
    phone: "+977 1234567890",
    website: "",
    address: "Suryavinayak 10",
    city: "Bhaktapur",
    state: "Bagmati",
    pincode: "00977",
    adminFirstName: "Krishna",
    adminLastName: "Ngakhusi",
    adminEmail: "sujan1nepal@gmail.com",
    adminPhone: "+977 1234567890",
    adminPosition: "Principal",
    totalStudents: "500",
    totalTeachers: "300",
    gradeRange: "1-12",
    curriculum: "National Curriculum",
    subscriptionPlan: "professional",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof SchoolData, value: string) => {
    setSchoolData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          schoolData.schoolName &&
          schoolData.subdomain &&
          schoolData.schoolType &&
          schoolData.establishedYear
        );
      case 2:
        return !!(
          schoolData.email &&
          schoolData.phone &&
          schoolData.address &&
          schoolData.city &&
          schoolData.state &&
          schoolData.pincode
        );
      case 3:
        return !!(
          schoolData.adminFirstName &&
          schoolData.adminLastName &&
          schoolData.adminEmail &&
          schoolData.adminPhone &&
          schoolData.adminPosition
        );
      case 4:
        return !!(
          schoolData.totalStudents &&
          schoolData.totalTeachers &&
          schoolData.gradeRange &&
          schoolData.curriculum
        );
      case 5:
        return !!schoolData.subscriptionPlan;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all steps before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Validate subdomain uniqueness
      const { data: existingSchoolData, error: checkError } = await supabase
        .from("schools")
        .select("id")
        .eq("subdomain", schoolData.subdomain)
        .maybeSingle();

      if (existingSchoolData) {
        toast({
          title: "Subdomain Already Exists",
          description: "This subdomain is already taken. Please choose a different one.",
          variant: "destructive",
        });
        return;
      }

      // Create school record with enhanced data
      const { data: schoolRecord, error: schoolError } = await supabase
        .from("schools")
        .insert([
          {
            name: schoolData.schoolName,
            subdomain: schoolData.subdomain,
            email: schoolData.email,
            phone: schoolData.phone,
            website: schoolData.website || null,
            address: `${schoolData.address}, ${schoolData.city}, ${schoolData.state} - ${schoolData.pincode}`,
            subscription_status: "active",
            subscription_expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
          },
        ])
        .select()
        .single();

      if (schoolError) {
        console.error("School creation error:", schoolError);
        throw new Error(schoolError.message || "Failed to create school");
      }

      // Store registration data in localStorage for the next step
      const registrationData = {
        ...schoolData,
        schoolId: schoolRecord.id,
        registrationDate: new Date().toISOString(),
      };
      
      localStorage.setItem(
        "schoolRegistrationData",
        JSON.stringify(registrationData),
      );

      toast({
        title: "School Registered Successfully!",
        description: `Your school "${schoolData.schoolName}" has been registered. You can now set up admin access.`,
      });

      // Navigate to admin setup
      navigate("/setup-admin", {
        state: { schoolData: registrationData },
      });
    } catch (error: any) {
      console.error("School registration error:", error);
      
      let errorMessage = "Failed to register school. Please try again.";
      if (error.message?.includes("duplicate key")) {
        errorMessage = "This subdomain is already taken. Please choose a different one.";
      } else if (error.message?.includes("violates")) {
        errorMessage = "Please check your input data and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <School className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Basic School Information</h2>
              <p className="text-muted-foreground">
                Let's start with the basics about your school
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  value={schoolData.schoolName}
                  onChange={(e) =>
                    handleInputChange("schoolName", e.target.value)
                  }
                  placeholder="Enter your school name"
                />
              </div>

              <div>
                <Label htmlFor="subdomain">School Subdomain *</Label>
                <div className="flex">
                  <Input
                    id="subdomain"
                    value={schoolData.subdomain}
                    onChange={(e) =>
                      handleInputChange(
                        "subdomain",
                        e.target.value.toLowerCase(),
                      )
                    }
                    placeholder="yourschool"
                    className="rounded-r-none"
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-muted-foreground">
                    .skooler.com
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be your school's unique URL
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="schoolType">School Type *</Label>
                  <Select
                    value={schoolData.schoolType}
                    onValueChange={(value) =>
                      handleInputChange("schoolType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="establishedYear">Established Year *</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={schoolData.establishedYear}
                    onChange={(e) =>
                      handleInputChange("establishedYear", e.target.value)
                    }
                    placeholder="e.g., 1995"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="text-muted-foreground">
                How can students and parents reach you?
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">School Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={schoolData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="info@yourschool.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">School Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={schoolData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="website">School Website (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={schoolData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://yourschool.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={schoolData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={schoolData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={schoolData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={schoolData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    placeholder="123456"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Admin Information</h2>
              <p className="text-muted-foreground">
                Who will be the primary administrator?
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="adminFirstName">First Name *</Label>
                  <Input
                    id="adminFirstName"
                    value={schoolData.adminFirstName}
                    onChange={(e) =>
                      handleInputChange("adminFirstName", e.target.value)
                    }
                    placeholder="First name"
                  />
                </div>

                <div>
                  <Label htmlFor="adminLastName">Last Name *</Label>
                  <Input
                    id="adminLastName"
                    value={schoolData.adminLastName}
                    onChange={(e) =>
                      handleInputChange("adminLastName", e.target.value)
                    }
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="adminEmail"
                      type="email"
                      value={schoolData.adminEmail}
                      onChange={(e) =>
                        handleInputChange("adminEmail", e.target.value)
                      }
                      placeholder="admin@yourschool.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adminPhone">Admin Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="adminPhone"
                      value={schoolData.adminPhone}
                      onChange={(e) =>
                        handleInputChange("adminPhone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="adminPosition">Position/Title *</Label>
                <Select
                  value={schoolData.adminPosition}
                  onValueChange={(value) =>
                    handleInputChange("adminPosition", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="head-administrator">
                      Head Administrator
                    </SelectItem>
                    <SelectItem value="vice-principal">
                      Vice Principal
                    </SelectItem>
                    <SelectItem value="academic-coordinator">
                      Academic Coordinator
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">School Details</h2>
              <p className="text-muted-foreground">
                Tell us more about your school
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="totalStudents">Total Students *</Label>
                  <Select
                    value={schoolData.totalStudents}
                    onValueChange={(value) =>
                      handleInputChange("totalStudents", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 students</SelectItem>
                      <SelectItem value="51-100">51-100 students</SelectItem>
                      <SelectItem value="101-300">101-300 students</SelectItem>
                      <SelectItem value="301-500">301-500 students</SelectItem>
                      <SelectItem value="501-1000">
                        501-1000 students
                      </SelectItem>
                      <SelectItem value="1000+">1000+ students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="totalTeachers">Total Teachers *</Label>
                  <Select
                    value={schoolData.totalTeachers}
                    onValueChange={(value) =>
                      handleInputChange("totalTeachers", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 teachers</SelectItem>
                      <SelectItem value="11-25">11-25 teachers</SelectItem>
                      <SelectItem value="26-50">26-50 teachers</SelectItem>
                      <SelectItem value="51-100">51-100 teachers</SelectItem>
                      <SelectItem value="100+">100+ teachers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="gradeRange">Grade Range *</Label>
                  <Select
                    value={schoolData.gradeRange}
                    onValueChange={(value) =>
                      handleInputChange("gradeRange", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-k-5">Pre-K to Grade 5</SelectItem>
                      <SelectItem value="6-10">Grade 6 to 10</SelectItem>
                      <SelectItem value="11-12">Grade 11 to 12</SelectItem>
                      <SelectItem value="k-12">K-12 (All grades)</SelectItem>
                      <SelectItem value="nursery-primary">
                        Nursery to Primary
                      </SelectItem>
                      <SelectItem value="secondary-higher">
                        Secondary to Higher Secondary
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="curriculum">Curriculum *</Label>
                  <Select
                    value={schoolData.curriculum}
                    onValueChange={(value) =>
                      handleInputChange("curriculum", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select curriculum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cbse">CBSE</SelectItem>
                      <SelectItem value="icse">ICSE</SelectItem>
                      <SelectItem value="state-board">State Board</SelectItem>
                      <SelectItem value="ib">
                        International Baccalaureate (IB)
                      </SelectItem>
                      <SelectItem value="cambridge">Cambridge</SelectItem>
                      <SelectItem value="montessori">Montessori</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-muted-foreground">
                Select a subscription plan that works for your school
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    schoolData.subscriptionPlan === plan.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => handleInputChange("subscriptionPlan", plan.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.students}</CardDescription>
                      </div>
                      {schoolData.subscriptionPlan === plan.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {plan.price}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                14-Day Free Trial
              </h3>
              <p className="text-sm text-blue-700">
                Start with a free 14-day trial. No credit card required. You can
                change or cancel your plan anytime.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <School className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Register Your School
              </h1>
              <p className="text-muted-foreground">
                Join thousands of schools using Skooler
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep) || isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    "Registering..."
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
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
