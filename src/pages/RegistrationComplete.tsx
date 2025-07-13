import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  School,
  Users,
  GraduationCap,
  Download,
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Globe,
  Settings,
  BookOpen,
  Calendar,
  DollarSign,
} from "lucide-react";

interface RegistrationData {
  schoolId: string;
  studentsRegistered?: boolean;
  studentCount?: number;
  teachersSkipped?: boolean;
  studentsSkipped?: boolean;
}

export default function RegistrationComplete() {
  const [showCredentials, setShowCredentials] = useState(false);
  const [teachers, setTeachers] = useState<
    Array<{
      email: string;
      password: string;
      name: string;
    }>
  >([]);
  const [students, setStudents] = useState<
    Array<{
      email: string;
      password: string;
      name: string;
      admissionNumber: string;
    }>
  >([]);
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get registration data from state
    const stateData = location.state;
    if (stateData?.schoolId) {
      setRegistrationData(stateData);
    } else {
      navigate("/school-registration");
    }

    // Load stored credentials
    const storedTeachers = localStorage.getItem("registeredTeachers");
    const storedStudents = localStorage.getItem("registeredStudents");

    if (storedTeachers) {
      try {
        setTeachers(JSON.parse(storedTeachers));
      } catch (error) {
        console.error("Error parsing teacher data:", error);
      }
    }

    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch (error) {
        console.error("Error parsing student data:", error);
      }
    }
  }, [location.state, navigate]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadCredentials = () => {
    const credentials = {
      teachers: teachers,
      students: students,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(credentials, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "school-credentials.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const nextSteps = [
    {
      icon: Settings,
      title: "Configure School Settings",
      description: "Set up academic year, terms, and basic configurations",
      action: "Go to Settings",
    },
    {
      icon: BookOpen,
      title: "Create Subjects",
      description: "Add subjects that will be taught in your school",
      action: "Manage Subjects",
    },
    {
      icon: Calendar,
      title: "Set Up Timetables",
      description: "Create class schedules and assign teachers to subjects",
      action: "Create Timetables",
    },
    {
      icon: DollarSign,
      title: "Configure Fee Structures",
      description: "Set up fee categories and payment schedules",
      action: "Manage Fees",
    },
  ];

  if (!registrationData) {
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Registration Complete!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your school has been successfully set up on Skooler
          </p>
        </div>

        {/* Success Summary */}
        <Card className="mb-8 border-green-200 bg-green-50 shadow-lg">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                  <School className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">School Setup</h3>
                <p className="text-sm text-green-700">Complete</p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">Teachers</h3>
                <p className="text-sm text-green-700">
                  {registrationData.teachersSkipped
                    ? "Skipped"
                    : `${teachers.length} Registered`}
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">Students</h3>
                <p className="text-sm text-green-700">
                  {registrationData.studentsSkipped
                    ? "Skipped"
                    : `${students.length} Registered`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Credentials */}
        {(teachers.length > 0 || students.length > 0) && (
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Login Credentials
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                  >
                    {showCredentials ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showCredentials ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadCredentials}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Save these credentials securely. Users will need them to log in.
              </CardDescription>
            </CardHeader>
            {showCredentials && (
              <CardContent className="space-y-6">
                {teachers.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Teacher Credentials ({teachers.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {teachers.map((teacher, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{teacher.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Email: {teacher.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Password: {teacher.password}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  `${teacher.email}\n${teacher.password}`,
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {students.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Student Credentials ({students.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {students.map((student, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Email: {student.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Password: {student.password}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Admission: {student.admissionNumber}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  `${student.email}\n${student.password}`,
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Complete these steps to fully set up your school management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <step.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      <Button variant="outline" size="sm">
                        {step.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-8 border-amber-200 bg-amber-50 shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-amber-900 mb-3">
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>
                • Share login credentials securely with teachers and students
              </li>
              <li>• Users can change their passwords after first login</li>
              <li>
                • Download and store the credentials file in a secure location
              </li>
              <li>
                • You can add more teachers and students anytime from the
                dashboard
              </li>
              <li>
                • Your 14-day free trial has started - no payment required yet
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
            Login Page
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Need Help Getting Started?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you make the most of Skooler
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              Help Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
