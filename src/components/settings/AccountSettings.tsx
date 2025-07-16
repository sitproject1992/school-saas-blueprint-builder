import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Save,
  RefreshCw,
  User,
  Key,
  Activity,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  avatar?: string;
  bio?: string;
  notifications: {
    email: boolean;
    browser: boolean;
    security: boolean;
  };
}

interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  status: "success" | "warning" | "error";
}

interface AccountSettingsProps {
  onSave?: (data: ProfileData) => Promise<void>;
}

export function AccountSettings({ onSave }: AccountSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>({
    firstName: "Super",
    lastName: "Admin",
    email: "sujan1nepal@gmail.com",
    phone: "+1 (555) 123-4567",
    timezone: "UTC",
    language: "en",
    bio: "System administrator with full access to platform management and configuration.",
    notifications: {
      email: true,
      browser: true,
      security: true,
    },
  });

  const [activityLogs] = useState<ActivityLogEntry[]>([
    {
      id: "1",
      action: "LOGIN",
      description: "Successful login to super admin dashboard",
      timestamp: "2024-01-15 14:30:25",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      status: "success",
    },
    {
      id: "2",
      action: "SCHOOL_CREATED",
      description: "Created new school: 'Greenwood Elementary'",
      timestamp: "2024-01-15 13:45:12",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      status: "success",
    },
    {
      id: "3",
      action: "ADMIN_CREATED",
      description: "Created school administrator account for John Smith",
      timestamp: "2024-01-15 13:20:45",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      status: "success",
    },
    {
      id: "4",
      action: "SECURITY_SETTINGS_UPDATED",
      description: "Updated system security configuration",
      timestamp: "2024-01-15 12:15:30",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      status: "success",
    },
    {
      id: "5",
      action: "PASSWORD_CHANGED",
      description: "Super admin password changed successfully",
      timestamp: "2024-01-14 16:22:18",
      ipAddress: "192.168.1.95",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      status: "success",
    },
    {
      id: "6",
      action: "LOGIN_FAILED",
      description: "Failed login attempt detected",
      timestamp: "2024-01-14 09:45:33",
      ipAddress: "203.0.113.42",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      location: "Unknown",
      status: "warning",
    },
  ]);

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
    "Asia/Kolkata",
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ar", label: "Arabic" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "hi", label: "Hindi" },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(profile);
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Profile image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = (
    key: keyof ProfileData,
    value: string | ProfileData["notifications"],
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const updateNotifications = (
    key: keyof ProfileData["notifications"],
    value: boolean,
  ) => {
    setProfile((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const getActivityBadge = (status: string) => {
    const variants: {
      [key: string]: "default" | "secondary" | "destructive" | "outline";
    } = {
      success: "default",
      warning: "outline",
      error: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const exportActivityLog = () => {
    const csvContent = [
      "Action,Description,Timestamp,IP Address,Location,Status",
      ...activityLogs.map(
        (log) =>
          `"${log.action}","${log.description}","${log.timestamp}","${log.ipAddress}","${log.location || "Unknown"}","${log.status}"`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "super_admin_activity_log.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Activity log exported successfully");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Account Settings
        </h2>
        <p className="text-gray-600">
          Manage your super admin account and view activity history
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Image */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileImage || profile.avatar} />
                    <AvatarFallback className="text-lg">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) =>
                        updateProfile("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) =>
                        updateProfile("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                      className="pl-10"
                      readOnly
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Email cannot be changed for super admin account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => updateProfile("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateProfile("bio", e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Configure your account preferences and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) => updateProfile("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={profile.language}
                    onValueChange={(value) => updateProfile("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <Label>Notification Preferences</Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.notifications.email}
                        onChange={(e) =>
                          updateNotifications("email", e.target.checked)
                        }
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Browser Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Show notifications in browser
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.notifications.browser}
                        onChange={(e) =>
                          updateNotifications("browser", e.target.checked)
                        }
                        className="rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Critical security notifications
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.notifications.security}
                        onChange={(e) =>
                          updateNotifications("security", e.target.checked)
                        }
                        className="rounded"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Security alerts cannot be disabled for super admin
                      accounts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>

                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Authenticator App</p>
                      <p className="text-sm text-gray-500">
                        Use an app to generate codes
                      </p>
                    </div>
                    <Badge variant="outline">Not Setup</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Setup 2FA
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Active Sessions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-sm text-gray-500">
                          Windows • Chrome • New York, US
                        </p>
                        <p className="text-xs text-gray-400">
                          192.168.1.100 • Active now
                        </p>
                      </div>
                      <Badge variant="default">Current</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>
                  Overview of your account activity and usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">247</div>
                    <div className="text-sm text-gray-600">Total Logins</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-gray-600">Schools Managed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      1,234
                    </div>
                    <div className="text-sm text-gray-600">
                      Actions Performed
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">15</div>
                    <div className="text-sm text-gray-600">Days Uptime</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Last Activity</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Last login: Today at 2:30 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>Location: New York, US</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Account created: 2 years ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Log
                  </CardTitle>
                  <CardDescription>
                    Complete history of your super admin activities
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportActivityLog}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm">{log.description}</p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.location || "Unknown"}
                      </TableCell>
                      <TableCell>{getActivityBadge(log.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      {activeTab === "profile" && (
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setProfile({
                firstName: "Super",
                lastName: "Admin",
                email: "sujan1nepal@gmail.com",
                phone: "+1 (555) 123-4567",
                timezone: "UTC",
                language: "en",
                bio: "System administrator with full access to platform management and configuration.",
                notifications: {
                  email: true,
                  browser: true,
                  security: true,
                },
              });
              setProfileImage(null);
              toast.success("Profile reset to defaults");
            }}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
