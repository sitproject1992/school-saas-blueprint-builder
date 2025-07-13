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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Plus,
  Trash2,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  BookOpen,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TeacherData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  qualification: string;
  experience: string;
  subjects: string[];
  joiningDate: string;
  salary: string;
  password: string;
}

const subjectOptions = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Computer Science",
  "Physical Education",
  "Art",
  "Music",
  "Sanskrit",
  "Economics",
  "Commerce",
  "Accountancy",
];

export default function TeacherRegistration() {
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    qualification: "",
    experience: "",
    subjects: [],
    joiningDate: new Date().toISOString().split("T")[0],
    salary: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [schoolId, setSchoolId] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get school ID from state
    const stateData = location.state;
    if (stateData?.schoolId) {
      setSchoolId(stateData.schoolId);
    } else {
      // If no school ID, redirect to registration
      toast({
        title: "Missing School Information",
        description: "Please complete school registration first.",
        variant: "destructive",
      });
      navigate("/school-registration");
    }
  }, [location.state, navigate, toast]);

  useEffect(() => {
    // Validate current teacher form
    const isValid = !!(
      currentTeacher.firstName &&
      currentTeacher.lastName &&
      currentTeacher.email &&
      currentTeacher.phone &&
      currentTeacher.qualification &&
      currentTeacher.subjects.length > 0 &&
      currentTeacher.password
    );
    setIsFormValid(isValid);
  }, [currentTeacher]);

  const handleInputChange = (
    field: keyof TeacherData,
    value: string | string[],
  ) => {
    setCurrentTeacher((prev) => ({ ...prev, [field]: value }));
  };

  const addSubject = (subject: string) => {
    if (!currentTeacher.subjects.includes(subject)) {
      handleInputChange("subjects", [...currentTeacher.subjects, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    handleInputChange(
      "subjects",
      currentTeacher.subjects.filter((s) => s !== subject),
    );
  };

  const resetCurrentTeacher = () => {
    setCurrentTeacher({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      qualification: "",
      experience: "",
      subjects: [],
      joiningDate: new Date().toISOString().split("T")[0],
      salary: "",
      password: "",
    });
  };

  const addTeacher = () => {
    if (!isFormValid) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setTeachers((prev) => [...prev, { ...currentTeacher }]);
    resetCurrentTeacher();
    toast({
      title: "Teacher Added",
      description: "Teacher has been added to the registration list.",
    });
  };

  const removeTeacher = (index: number) => {
    setTeachers((prev) => prev.filter((_, i) => i !== index));
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8);
    handleInputChange("password", password);
  };

  const submitAllTeachers = async () => {
    if (teachers.length === 0) {
      toast({
        title: "No Teachers to Register",
        description: "Please add at least one teacher before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const registrationPromises = teachers.map(async (teacher) => {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: teacher.email,
            password: teacher.password,
          },
        );

        if (authError) throw authError;

        if (authData.user) {
          // 2. Create profile
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                user_id: authData.user.id,
                email: teacher.email,
                first_name: teacher.firstName,
                last_name: teacher.lastName,
                phone: teacher.phone,
                address: teacher.address,
                date_of_birth: teacher.dateOfBirth || null,
                role: "teacher",
                school_id: schoolId,
              },
            ])
            .select()
            .single();

          if (profileError) throw profileError;

          // 3. Create teacher record
          const { error: teacherError } = await supabase
            .from("teachers")
            .insert([
              {
                profile_id: profileData.id,
                school_id: schoolId,
                qualification: teacher.qualification,
                experience_years: teacher.experience
                  ? parseInt(teacher.experience)
                  : null,
                joining_date: teacher.joiningDate,
                salary: teacher.salary ? parseFloat(teacher.salary) : null,
              },
            ]);

          if (teacherError) throw teacherError;

          return {
            email: teacher.email,
            password: teacher.password,
            name: `${teacher.firstName} ${teacher.lastName}`,
          };
        }
      });

      const registeredTeachers = await Promise.all(registrationPromises);

      toast({
        title: "Teachers Registered Successfully!",
        description: `${teachers.length} teacher(s) have been registered.`,
      });

      // Store teacher credentials for reference
      localStorage.setItem(
        "registeredTeachers",
        JSON.stringify(registeredTeachers),
      );

      // Navigate to student registration
      navigate("/student-registration", {
        state: {
          schoolId,
          teachersRegistered: true,
          teacherCount: teachers.length,
        },
      });
    } catch (error: any) {
      console.error("Teacher registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          error.message || "Failed to register teachers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipTeacherRegistration = () => {
    navigate("/student-registration", {
      state: {
        schoolId,
        teachersSkipped: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Register Teachers
              </h1>
              <p className="text-muted-foreground">
                Add teaching staff to your school system
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                School Registered
              </span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                Admin Created
              </span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-blue-600 font-medium">
                Teacher Registration
              </span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-400">
                Student Registration
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Teacher Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Add Teacher
              </CardTitle>
              <CardDescription>
                Fill in the teacher's information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={currentTeacher.firstName}
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
                    value={currentTeacher.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={currentTeacher.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="teacher@school.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={currentTeacher.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={currentTeacher.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="joiningDate"
                      type="date"
                      value={currentTeacher.joiningDate}
                      onChange={(e) =>
                        handleInputChange("joiningDate", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={currentTeacher.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Full address"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Input
                    id="qualification"
                    value={currentTeacher.qualification}
                    onChange={(e) =>
                      handleInputChange("qualification", e.target.value)
                    }
                    placeholder="B.Ed, M.A, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={currentTeacher.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    placeholder="Years of experience"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="salary">Monthly Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={currentTeacher.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="Monthly salary"
                  min="0"
                />
              </div>

              <div>
                <Label>Subjects *</Label>
                <div className="space-y-2">
                  <Select onValueChange={addSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subjects to teach" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((subject) => (
                        <SelectItem
                          key={subject}
                          value={subject}
                          disabled={currentTeacher.subjects.includes(subject)}
                        >
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {currentTeacher.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentTeacher.subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <BookOpen className="h-3 w-3" />
                          {subject}
                          <button
                            onClick={() => removeSubject(subject)}
                            className="ml-1 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="password">Login Password *</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    value={currentTeacher.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Login password"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This password will be used for teacher login
                </p>
              </div>

              <Button
                onClick={addTeacher}
                disabled={!isFormValid}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Teacher List */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registered Teachers ({teachers.length})
                </span>
              </CardTitle>
              <CardDescription>Teachers ready for registration</CardDescription>
            </CardHeader>
            <CardContent>
              {teachers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No teachers added yet</p>
                  <p className="text-sm">
                    Add teachers using the form on the left
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {teachers.map((teacher, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {teacher.firstName} {teacher.lastName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {teacher.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.qualification}
                            </p>
                            {teacher.subjects.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {teacher.subjects.map((subject) => (
                                  <Badge
                                    key={subject}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTeacher(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="mt-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold mb-1">Ready to proceed?</h3>
                <p className="text-sm text-muted-foreground">
                  {teachers.length > 0
                    ? `${teachers.length} teacher(s) ready for registration`
                    : "You can add teachers later or skip this step"}
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={skipTeacherRegistration}>
                  Skip Teachers
                </Button>

                <Button
                  onClick={submitAllTeachers}
                  disabled={teachers.length === 0 || isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    "Registering..."
                  ) : (
                    <>
                      {teachers.length > 0 ? "Register Teachers" : "Continue"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <p className="text-sm text-blue-700">
              After registering teachers, you'll be able to create classes and
              register students. Teachers can be assigned to specific classes
              and subjects later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
