import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  School,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Activity,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  // Mock settings data
  const schoolInfo = {
    name: "Greenwood International School",
    address: "123 Education Street, Academic City",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 98765 43210",
    email: "info@greenwood.edu.in",
    website: "https://greenwood.edu.in",
    logo: null,
    principal: "Dr. Priya Sharma",
    establishedYear: "2010",
    affiliation: "CBSE",
    schoolCode: "GIS001",
  };

  const academicSettings = {
    currentYear: "2024-25",
    yearStartDate: "2024-04-01",
    yearEndDate: "2025-03-31",
    termStructure: "3-terms",
    gradingSystem: "percentage",
    passingMarks: 40,
    maxMarks: 100,
    attendanceRequirement: 75,
    lateMarkingDays: 7,
  };

  const systemSettings = {
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    language: "English",
    theme: "light",
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    apiLogging: true,
  };

  const notificationSettings = {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    paymentReminders: true,
    attendanceAlerts: true,
    examReminders: true,
    holidayNotices: true,
  };

  const securitySettings = {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90,
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: true,
    ipWhitelist: false,
    auditLogging: true,
  };

  const integrationSettings = {
    paymentGateway: {
      enabled: true,
      provider: "Razorpay",
      mode: "live",
    },
    smsGateway: {
      enabled: true,
      provider: "Twilio",
      mode: "live",
    },
    emailService: {
      enabled: true,
      provider: "SMTP",
      mode: "live",
    },
    cloudStorage: {
      enabled: true,
      provider: "AWS S3",
      mode: "live",
    },
  };

  const recentChanges = [
    {
      setting: "Academic Year Updated",
      user: "Dr. Priya Sharma",
      timestamp: "2024-07-10T10:30:00Z",
      type: "academic",
    },
    {
      setting: "Email Notifications Enabled",
      user: "System Admin",
      timestamp: "2024-07-09T15:45:00Z",
      type: "notification",
    },
    {
      setting: "Payment Gateway Configuration",
      user: "Finance Team",
      timestamp: "2024-07-08T12:20:00Z",
      type: "integration",
    },
    {
      setting: "Security Policy Updated",
      user: "IT Administrator",
      timestamp: "2024-07-07T09:15:00Z",
      type: "security",
    },
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "notification":
        return <Bell className="h-4 w-4 text-green-600" />;
      case "integration":
        return <Globe className="h-4 w-4 text-purple-600" />;
      case "security":
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure school information, academic settings, and system
            preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* School Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-600" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={schoolInfo.logo} />
                    <AvatarFallback className="text-2xl">
                      {schoolInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">School Name</label>
                  <Input defaultValue={schoolInfo.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea defaultValue={schoolInfo.address} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input defaultValue={schoolInfo.city} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Input defaultValue={schoolInfo.state} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pincode</label>
                    <Input defaultValue={schoolInfo.pincode} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School Code</label>
                    <Input defaultValue={schoolInfo.schoolCode} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input defaultValue={schoolInfo.phone} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" defaultValue={schoolInfo.email} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input defaultValue={schoolInfo.website} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Principal Name</label>
                  <Input defaultValue={schoolInfo.principal} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Established Year
                    </label>
                    <Input defaultValue={schoolInfo.establishedYear} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Affiliation</label>
                    <Select defaultValue={schoolInfo.affiliation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="State">State Board</SelectItem>
                        <SelectItem value="IB">IB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Academic Year Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Academic Year Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Current Academic Year
                  </label>
                  <Input defaultValue={academicSettings.currentYear} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Year Start Date
                    </label>
                    <Input
                      type="date"
                      defaultValue={academicSettings.yearStartDate}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year End Date</label>
                    <Input
                      type="date"
                      defaultValue={academicSettings.yearEndDate}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Term Structure</label>
                  <Select defaultValue={academicSettings.termStructure}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-terms">2 Terms</SelectItem>
                      <SelectItem value="3-terms">3 Terms</SelectItem>
                      <SelectItem value="4-terms">4 Terms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grading System</label>
                  <Select defaultValue={academicSettings.gradingSystem}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="gpa">GPA</SelectItem>
                      <SelectItem value="letter">Letter Grades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Assessment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Passing Marks</label>
                    <Input
                      type="number"
                      defaultValue={academicSettings.passingMarks}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximum Marks</label>
                    <Input
                      type="number"
                      defaultValue={academicSettings.maxMarks}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Minimum Attendance Required (%)
                  </label>
                  <Input
                    type="number"
                    defaultValue={academicSettings.attendanceRequirement}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Late Marking Allowed (Days)
                  </label>
                  <Input
                    type="number"
                    defaultValue={academicSettings.lateMarkingDays}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto Grade Calculation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate final grades
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Grade Publishing</h4>
                    <p className="text-sm text-muted-foreground">
                      Auto-publish grades to students
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Communication Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Communication Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    defaultChecked={notificationSettings.emailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Switch
                    defaultChecked={notificationSettings.smsNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Send push notifications to mobile app
                    </p>
                  </div>
                  <Switch
                    defaultChecked={notificationSettings.pushNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Send weekly summary reports
                    </p>
                  </div>
                  <Switch defaultChecked={notificationSettings.weeklyReports} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Monthly Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Send monthly detailed reports
                    </p>
                  </div>
                  <Switch
                    defaultChecked={notificationSettings.monthlyReports}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Alert Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Alert Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Send fee payment reminders
                    </p>
                  </div>
                  <Switch
                    defaultChecked={notificationSettings.paymentReminders}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Attendance Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Alert for low attendance
                    </p>
                  </div>
                  <Switch
                    defaultChecked={notificationSettings.attendanceAlerts}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Exam Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Send exam schedule reminders
                    </p>
                  </div>
                  <Switch defaultChecked={notificationSettings.examReminders} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Holiday Notices</h4>
                    <p className="text-sm text-muted-foreground">
                      Send holiday announcements
                    </p>
                  </div>
                  <Switch
                    defaultChecked={notificationSettings.holidayNotices}
                  />
                </div>

                {/* Notification Timing */}
                <div className="space-y-2 mt-6">
                  <label className="text-sm font-medium">
                    Notification Time
                  </label>
                  <Select defaultValue="09:00">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Password Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Password Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Minimum Password Length
                  </label>
                  <Input
                    type="number"
                    defaultValue={securitySettings.passwordPolicy.minLength}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Password Expiry (Days)
                  </label>
                  <Input
                    type="number"
                    defaultValue={securitySettings.passwordPolicy.expiryDays}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      Require Uppercase Letters
                    </span>
                    <Switch
                      defaultChecked={
                        securitySettings.passwordPolicy.requireUppercase
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      Require Lowercase Letters
                    </span>
                    <Switch
                      defaultChecked={
                        securitySettings.passwordPolicy.requireLowercase
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Require Numbers</span>
                    <Switch
                      defaultChecked={
                        securitySettings.passwordPolicy.requireNumbers
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      Require Special Characters
                    </span>
                    <Switch
                      defaultChecked={
                        securitySettings.passwordPolicy.requireSpecialChars
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Session Timeout (Minutes)
                  </label>
                  <Input
                    type="number"
                    defaultValue={securitySettings.sessionTimeout}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Max Login Attempts
                  </label>
                  <Input
                    type="number"
                    defaultValue={securitySettings.maxLoginAttempts}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable 2FA for all users
                      </p>
                    </div>
                    <Switch defaultChecked={securitySettings.twoFactorAuth} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">IP Whitelist</h4>
                      <p className="text-sm text-muted-foreground">
                        Restrict access by IP address
                      </p>
                    </div>
                    <Switch defaultChecked={securitySettings.ipWhitelist} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Audit Logging</h4>
                      <p className="text-sm text-muted-foreground">
                        Log all user activities
                      </p>
                    </div>
                    <Switch defaultChecked={securitySettings.auditLogging} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-800">
                    SSL Certificate
                  </h3>
                  <p className="text-sm text-green-600">Valid until Dec 2024</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-800">
                    Data Encryption
                  </h3>
                  <p className="text-sm text-green-600">AES-256 Enabled</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-medium text-yellow-800">Security Scan</h3>
                  <p className="text-sm text-yellow-600">
                    Last scan: 7 days ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Payment Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Payment Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment Gateway</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable online payments
                    </p>
                  </div>
                  <Switch
                    defaultChecked={integrationSettings.paymentGateway.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Provider</label>
                  <Select
                    defaultValue={integrationSettings.paymentGateway.provider}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Razorpay">Razorpay</SelectItem>
                      <SelectItem value="PayU">PayU</SelectItem>
                      <SelectItem value="Paytm">Paytm</SelectItem>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      defaultValue="rz_test_***************"
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
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      integrationSettings.paymentGateway.mode === "live"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }
                  >
                    {integrationSettings.paymentGateway.mode.toUpperCase()} Mode
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </CardContent>
            </Card>

            {/* Communication Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Communication Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">SMS Gateway</h4>
                      <p className="text-sm text-muted-foreground">
                        Twilio SMS Service
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        defaultChecked={integrationSettings.smsGateway.enabled}
                      />
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Service</h4>
                      <p className="text-sm text-muted-foreground">
                        SMTP Configuration
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        defaultChecked={
                          integrationSettings.emailService.enabled
                        }
                      />
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Cloud Storage</h4>
                      <p className="text-sm text-muted-foreground">
                        AWS S3 Integration
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        defaultChecked={
                          integrationSettings.cloudStorage.enabled
                        }
                      />
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Integrations
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <Select defaultValue={systemSettings.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">
                        Asia/Kolkata (IST)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (EST)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT)
                      </SelectItem>
                      <SelectItem value="Asia/Tokyo">
                        Asia/Tokyo (JST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Format</label>
                  <Select defaultValue={systemSettings.dateFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <Select defaultValue={systemSettings.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select defaultValue={systemSettings.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* System Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  System Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto Backup</h4>
                      <p className="text-sm text-muted-foreground">
                        Daily automatic backup
                      </p>
                    </div>
                    <Switch defaultChecked={systemSettings.autoBackup} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Maintenance Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable for system updates
                      </p>
                    </div>
                    <Switch defaultChecked={systemSettings.maintenanceMode} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Debug Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable for troubleshooting
                      </p>
                    </div>
                    <Switch defaultChecked={systemSettings.debugMode} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">API Logging</h4>
                      <p className="text-sm text-muted-foreground">
                        Log all API requests
                      </p>
                    </div>
                    <Switch defaultChecked={systemSettings.apiLogging} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Changes Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentChanges.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getChangeIcon(change.type)}
                      <div>
                        <h4 className="font-medium">{change.setting}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {change.user}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(change.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
