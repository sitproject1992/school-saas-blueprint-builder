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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle,
  Users,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  School,
  Home,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ClassData {
  id: string;
  name: string;
  section: string;
  gradeLevel: number;
  capacity: number;
}

interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  admissionNumber: string;
  classId: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  motherOccupation: string;
  medicalConditions: string;
  password: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female", "Other"];

export default function StudentRegistration() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [currentStudent, setCurrentStudent] = useState<StudentData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    admissionNumber: "",
    classId: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    medicalConditions: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [schoolId, setSchoolId] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get school ID from state
    const stateData = location.state;
    if (stateData?.schoolId) {
      setSchoolId(stateData.schoolId);
      createDefaultClasses(stateData.schoolId);
    } else {
      toast({
        title: "Missing School Information",
        description: "Please complete school registration first.",
        variant: "destructive",
      });
      navigate("/school-registration");
    }
  }, [location.state, navigate, toast]);

  useEffect(() => {
    // Validate current student form
    const isBasicValid = !!(
      currentStudent.firstName &&
      currentStudent.lastName &&
      currentStudent.email &&
      currentStudent.dateOfBirth &&
      currentStudent.gender &&
      currentStudent.classId &&
      currentStudent.password
    );
    setIsFormValid(isBasicValid);
  }, [currentStudent]);

  const createDefaultClasses = async (schoolId: string) => {
    try {
      // Create default classes for the school
      const defaultClasses = [
        { name: "Grade 1", section: "A", gradeLevel: 1, capacity: 30 },
        { name: "Grade 1", section: "B", gradeLevel: 1, capacity: 30 },
        { name: "Grade 2", section: "A", gradeLevel: 2, capacity: 30 },
        { name: "Grade 2", section: "B", gradeLevel: 2, capacity: 30 },
        { name: "Grade 3", section: "A", gradeLevel: 3, capacity: 30 },
        { name: "Grade 3", section: "B", gradeLevel: 3, capacity: 30 },
        { name: "Grade 4", section: "A", gradeLevel: 4, capacity: 30 },
        { name: "Grade 4", section: "B", gradeLevel: 4, capacity: 30 },
        { name: "Grade 5", section: "A", gradeLevel: 5, capacity: 30 },
        { name: "Grade 5", section: "B", gradeLevel: 5, capacity: 30 },
      ];

      const { data: createdClasses, error } = await supabase
        .from("classes")
        .insert(
          defaultClasses.map((cls) => ({
            name: cls.name,
            section: cls.section,
            grade_level: cls.gradeLevel,
            capacity: cls.capacity,
            school_id: schoolId,
          })),
        )
        .select();

      if (error) throw error;

      if (createdClasses) {
        setClasses(
          createdClasses.map((cls) => ({
            id: cls.id,
            name: cls.name,
            section: cls.section || "",
            gradeLevel: cls.grade_level || 0,
            capacity: cls.capacity || 30,
          })),
        );
      }
    } catch (error) {
      console.error("Error creating classes:", error);
      // Set some mock classes as fallback
      setClasses([
        { id: "1", name: "Grade 1", section: "A", gradeLevel: 1, capacity: 30 },
        { id: "2", name: "Grade 2", section: "A", gradeLevel: 2, capacity: 30 },
        { id: "3", name: "Grade 3", section: "A", gradeLevel: 3, capacity: 30 },
      ]);
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setCurrentStudent((prev) => ({ ...prev, [field]: value }));
  };

  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${year}${random}`;
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8);
    handleInputChange("password", password);
  };

  const resetCurrentStudent = () => {
    setCurrentStudent({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      admissionNumber: generateAdmissionNumber(),
      classId: "",
      bloodGroup: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      fatherName: "",
      fatherPhone: "",
      fatherOccupation: "",
      motherName: "",
      motherPhone: "",
      motherOccupation: "",
      medicalConditions: "",
      password: "",
    });
    setCurrentStep(1);
  };

  const addStudent = () => {
    if (!isFormValid) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate admission number if not set
    if (!currentStudent.admissionNumber) {
      handleInputChange("admissionNumber", generateAdmissionNumber());
    }

    setStudents((prev) => [...prev, { ...currentStudent }]);
    resetCurrentStudent();
    toast({
      title: "Student Added",
      description: "Student has been added to the registration list.",
    });
  };

  const removeStudent = (index: number) => {
    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  const submitAllStudents = async () => {
    if (students.length === 0) {
      toast({
        title: "No Students to Register",
        description: "Please add at least one student before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const registrationPromises = students.map(
        async (
          student,
        ): Promise<{
          email: string;
          password: string;
          name: string;
          admissionNumber: string;
        }> => {
          // 1. Create auth user
          const { data: authData, error: authError } =
            await supabase.auth.signUp({
              email: student.email,
              password: student.password,
            });

          if (authError) throw authError;

          if (authData.user) {
            // 2. Create profile
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .insert([
                {
                  user_id: authData.user.id,
                  email: student.email,
                  first_name: student.firstName,
                  last_name: student.lastName,
                  phone: student.phone,
                  address: student.address,
                  date_of_birth: student.dateOfBirth,
                  role: "student",
                  school_id: schoolId,
                },
              ])
              .select()
              .single();

            if (profileError) throw profileError;

            // 3. Create student record
            const { error: studentError } = await supabase
              .from("students")
              .insert([
                {
                  profile_id: profileData.id,
                  school_id: schoolId,
                  class_id: student.classId,
                  admission_number: student.admissionNumber,
                  blood_group: student.bloodGroup || null,
                  emergency_contact_name: student.emergencyContactName || null,
                  emergency_contact_phone:
                    student.emergencyContactPhone || null,
                  medical_conditions: student.medicalConditions || null,
                  admission_date: new Date().toISOString().split("T")[0],
                },
              ]);

            if (studentError) throw studentError;

            return {
              email: student.email,
              password: student.password,
              name: `${student.firstName} ${student.lastName}`,
              admissionNumber: student.admissionNumber,
            };
          }
        },
      );

      const registeredStudents = await Promise.all(registrationPromises);

      toast({
        title: "Students Registered Successfully!",
        description: `${students.length} student(s) have been registered.`,
      });

      // Store student credentials for reference
      localStorage.setItem(
        "registeredStudents",
        JSON.stringify(registeredStudents),
      );

      // Navigate to completion page
      navigate("/registration-complete", {
        state: {
          schoolId,
          studentsRegistered: true,
          studentCount: students.length,
        },
      });
    } catch (error: any) {
      console.error("Student registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          error.message || "Failed to register students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedClassName = () => {
    const selectedClass = classes.find((c) => c.id === currentStudent.classId);
    return selectedClass
      ? `${selectedClass.name} - ${selectedClass.section}`
      : "";
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={currentStudent.firstName}
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
                  value={currentStudent.lastName}
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
                    value={currentStudent.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="student@school.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={currentStudent.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={currentStudent.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={currentStudent.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={currentStudent.bloodGroup}
                  onValueChange={(value) =>
                    handleInputChange("bloodGroup", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={currentStudent.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Full address"
                rows={2}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="admissionNumber">Admission Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="admissionNumber"
                    value={currentStudent.admissionNumber}
                    onChange={(e) =>
                      handleInputChange("admissionNumber", e.target.value)
                    }
                    placeholder="Auto-generated"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleInputChange(
                        "admissionNumber",
                        generateAdmissionNumber(),
                      )
                    }
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="classId">Class *</Label>
                <Select
                  value={currentStudent.classId}
                  onValueChange={(value) => handleInputChange("classId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.section} (Capacity: {cls.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="emergencyContactName">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergencyContactName"
                  value={currentStudent.emergencyContactName}
                  onChange={(e) =>
                    handleInputChange("emergencyContactName", e.target.value)
                  }
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <Label htmlFor="emergencyContactPhone">
                  Emergency Contact Phone
                </Label>
                <Input
                  id="emergencyContactPhone"
                  value={currentStudent.emergencyContactPhone}
                  onChange={(e) =>
                    handleInputChange("emergencyContactPhone", e.target.value)
                  }
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="medicalConditions">
                Medical Conditions / Allergies
              </Label>
              <Textarea
                id="medicalConditions"
                value={currentStudent.medicalConditions}
                onChange={(e) =>
                  handleInputChange("medicalConditions", e.target.value)
                }
                placeholder="Any medical conditions or allergies"
                rows={2}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={currentStudent.fatherName}
                  onChange={(e) =>
                    handleInputChange("fatherName", e.target.value)
                  }
                  placeholder="Father's name"
                />
              </div>

              <div>
                <Label htmlFor="fatherPhone">Father's Phone</Label>
                <Input
                  id="fatherPhone"
                  value={currentStudent.fatherPhone}
                  onChange={(e) =>
                    handleInputChange("fatherPhone", e.target.value)
                  }
                  placeholder="Father's phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fatherOccupation">Father's Occupation</Label>
              <Input
                id="fatherOccupation"
                value={currentStudent.fatherOccupation}
                onChange={(e) =>
                  handleInputChange("fatherOccupation", e.target.value)
                }
                placeholder="Father's occupation"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={currentStudent.motherName}
                  onChange={(e) =>
                    handleInputChange("motherName", e.target.value)
                  }
                  placeholder="Mother's name"
                />
              </div>

              <div>
                <Label htmlFor="motherPhone">Mother's Phone</Label>
                <Input
                  id="motherPhone"
                  value={currentStudent.motherPhone}
                  onChange={(e) =>
                    handleInputChange("motherPhone", e.target.value)
                  }
                  placeholder="Mother's phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="motherOccupation">Mother's Occupation</Label>
              <Input
                id="motherOccupation"
                value={currentStudent.motherOccupation}
                onChange={(e) =>
                  handleInputChange("motherOccupation", e.target.value)
                }
                placeholder="Mother's occupation"
              />
            </div>

            <div>
              <Label htmlFor="password">Login Password *</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  value={currentStudent.password}
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
                This password will be used for student login
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Register Students
              </h1>
              <p className="text-muted-foreground">
                Add students to classes and manage enrollments
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
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                Teachers Registered
              </span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-blue-600 font-medium">
                Student Registration
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Student Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Add Student
              </CardTitle>
              <CardDescription>
                Step {currentStep} of 3:{" "}
                {currentStep === 1
                  ? "Basic Information"
                  : currentStep === 2
                    ? "School Details"
                    : "Parent Information"}
              </CardDescription>
              <Progress value={(currentStep / 3) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {renderStep()}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                  >
                    Next
                  </Button>
                ) : (
                  <Button onClick={addStudent} disabled={!isFormValid}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registered Students ({students.length})
                </span>
              </CardTitle>
              <CardDescription>Students ready for registration</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students added yet</p>
                  <p className="text-sm">
                    Add students using the form on the left
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {students.map((student, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {student.firstName} {student.lastName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {student.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Admission: {student.admissionNumber}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">
                                {
                                  classes.find((c) => c.id === student.classId)
                                    ?.name
                                }{" "}
                                -{" "}
                                {
                                  classes.find((c) => c.id === student.classId)
                                    ?.section
                                }
                              </Badge>
                              {student.bloodGroup && (
                                <Badge variant="secondary" className="text-xs">
                                  {student.bloodGroup}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStudent(index)}
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
                <h3 className="font-semibold mb-1">Complete Registration</h3>
                <p className="text-sm text-muted-foreground">
                  {students.length > 0
                    ? `${students.length} student(s) ready for registration`
                    : "Add students to complete the school setup"}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate("/registration-complete", {
                      state: { schoolId, studentsSkipped: true },
                    })
                  }
                >
                  Skip Students
                </Button>

                <Button
                  onClick={submitAllStudents}
                  disabled={students.length === 0 || isLoading}
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes Info */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Available Classes
            </h3>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <div key={cls.id} className="text-sm text-blue-700">
                  {cls.name} - {cls.section} (Capacity: {cls.capacity})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
