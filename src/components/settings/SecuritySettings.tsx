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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Save,
  RefreshCw,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

interface SecuritySettingsData {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiry: number;
    preventReuse: number;
  };
  loginSecurity: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    enableTwoFactor: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  dataProtection: {
    enableEncryption: boolean;
    backupFrequency: string;
    dataRetention: number;
    enableAuditLog: boolean;
    gdprCompliance: boolean;
  };
  systemSecurity: {
    enableFirewall: boolean;
    sslOnly: boolean;
    enableRateLimiting: boolean;
    maxRequestsPerMinute: number;
  };
}

interface SecuritySettingsProps {
  onSave?: (data: SecuritySettingsData) => Promise<void>;
}

export function SecuritySettings({ onSave }: SecuritySettingsProps) {
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState("");

  const [settings, setSettings] = useState<SecuritySettingsData>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiry: 90,
      preventReuse: 5,
    },
    loginSecurity: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      enableTwoFactor: false,
      sessionTimeout: 60,
      ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
    },
    dataProtection: {
      enableEncryption: true,
      backupFrequency: "daily",
      dataRetention: 365,
      enableAuditLog: true,
      gdprCompliance: true,
    },
    systemSecurity: {
      enableFirewall: true,
      sslOnly: true,
      enableRateLimiting: true,
      maxRequestsPerMinute: 100,
    },
  });

  const mockApiKey = "sk_test_51234567890abcdef...";

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(settings);
      }
      toast.success("Security settings saved successfully");
    } catch (error) {
      console.error("Error saving security settings:", error);
      toast.error("Failed to save security settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiry: 90,
        preventReuse: 5,
      },
      loginSecurity: {
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        enableTwoFactor: false,
        sessionTimeout: 60,
        ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
      },
      dataProtection: {
        enableEncryption: true,
        backupFrequency: "daily",
        dataRetention: 365,
        enableAuditLog: true,
        gdprCompliance: true,
      },
      systemSecurity: {
        enableFirewall: true,
        sslOnly: true,
        enableRateLimiting: true,
        maxRequestsPerMinute: 100,
      },
    });
    toast.success("Security settings reset to defaults");
  };

  const updatePasswordPolicy = (
    key: keyof SecuritySettingsData["passwordPolicy"],
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      passwordPolicy: { ...prev.passwordPolicy, [key]: value },
    }));
  };

  const updateLoginSecurity = (
    key: keyof SecuritySettingsData["loginSecurity"],
    value: string | number | boolean | string[],
  ) => {
    setSettings((prev) => ({
      ...prev,
      loginSecurity: { ...prev.loginSecurity, [key]: value },
    }));
  };

  const updateDataProtection = (
    key: keyof SecuritySettingsData["dataProtection"],
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      dataProtection: { ...prev.dataProtection, [key]: value },
    }));
  };

  const updateSystemSecurity = (
    key: keyof SecuritySettingsData["systemSecurity"],
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      systemSecurity: { ...prev.systemSecurity, [key]: value },
    }));
  };

  const addIpAddress = () => {
    if (newIpAddress.trim()) {
      updateLoginSecurity("ipWhitelist", [
        ...settings.loginSecurity.ipWhitelist,
        newIpAddress.trim(),
      ]);
      setNewIpAddress("");
    }
  };

  const removeIpAddress = (index: number) => {
    const newList = settings.loginSecurity.ipWhitelist.filter(
      (_, i) => i !== index,
    );
    updateLoginSecurity("ipWhitelist", newList);
  };

  const generateNewApiKey = () => {
    toast.success("New API key generated successfully");
  };

  const getSecurityScore = () => {
    let score = 0;
    const policy = settings.passwordPolicy;
    const login = settings.loginSecurity;
    const data = settings.dataProtection;
    const system = settings.systemSecurity;

    // Password policy (30 points)
    if (policy.minLength >= 8) score += 5;
    if (policy.requireUppercase) score += 5;
    if (policy.requireLowercase) score += 5;
    if (policy.requireNumbers) score += 5;
    if (policy.requireSpecialChars) score += 5;
    if (policy.passwordExpiry <= 90) score += 5;

    // Login security (30 points)
    if (login.maxLoginAttempts <= 5) score += 10;
    if (login.enableTwoFactor) score += 20;

    // Data protection (25 points)
    if (data.enableEncryption) score += 10;
    if (data.enableAuditLog) score += 10;
    if (data.gdprCompliance) score += 5;

    // System security (15 points)
    if (system.enableFirewall) score += 5;
    if (system.sslOnly) score += 5;
    if (system.enableRateLimiting) score += 5;

    return score;
  };

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Security Settings
          </h2>
          <p className="text-gray-600">
            Configure security policies and protection measures
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {securityScore}%
          </div>
          <p className="text-sm text-gray-500">Security Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Password Policy
            </CardTitle>
            <CardDescription>
              Configure password requirements for all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Length</Label>
              <Input
                id="minLength"
                type="number"
                min="6"
                max="32"
                value={settings.passwordPolicy.minLength}
                onChange={(e) =>
                  updatePasswordPolicy(
                    "minLength",
                    parseInt(e.target.value) || 8,
                  )
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Require Uppercase Letters</Label>
                <Switch
                  checked={settings.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) =>
                    updatePasswordPolicy("requireUppercase", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Lowercase Letters</Label>
                <Switch
                  checked={settings.passwordPolicy.requireLowercase}
                  onCheckedChange={(checked) =>
                    updatePasswordPolicy("requireLowercase", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Numbers</Label>
                <Switch
                  checked={settings.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) =>
                    updatePasswordPolicy("requireNumbers", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Special Characters</Label>
                <Switch
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) =>
                    updatePasswordPolicy("requireSpecialChars", checked)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                min="30"
                max="365"
                value={settings.passwordPolicy.passwordExpiry}
                onChange={(e) =>
                  updatePasswordPolicy(
                    "passwordExpiry",
                    parseInt(e.target.value) || 90,
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preventReuse">
                Prevent Reuse (last N passwords)
              </Label>
              <Input
                id="preventReuse"
                type="number"
                min="0"
                max="10"
                value={settings.passwordPolicy.preventReuse}
                onChange={(e) =>
                  updatePasswordPolicy(
                    "preventReuse",
                    parseInt(e.target.value) || 5,
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Login Security */}
        <Card>
          <CardHeader>
            <CardTitle>Login Security</CardTitle>
            <CardDescription>
              Configure login attempt limits and security measures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                value={settings.loginSecurity.maxLoginAttempts}
                onChange={(e) =>
                  updateLoginSecurity(
                    "maxLoginAttempts",
                    parseInt(e.target.value) || 5,
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">
                Lockout Duration (minutes)
              </Label>
              <Input
                id="lockoutDuration"
                type="number"
                min="5"
                max="120"
                value={settings.loginSecurity.lockoutDuration}
                onChange={(e) =>
                  updateLoginSecurity(
                    "lockoutDuration",
                    parseInt(e.target.value) || 30,
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">
                  Require 2FA for all admin accounts
                </p>
              </div>
              <Switch
                checked={settings.loginSecurity.enableTwoFactor}
                onCheckedChange={(checked) =>
                  updateLoginSecurity("enableTwoFactor", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="15"
                max="480"
                value={settings.loginSecurity.sessionTimeout}
                onChange={(e) =>
                  updateLoginSecurity(
                    "sessionTimeout",
                    parseInt(e.target.value) || 60,
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>IP Whitelist</Label>
              <div className="space-y-2">
                {settings.loginSecurity.ipWhitelist.map((ip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="flex-1 justify-start">
                      {ip}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeIpAddress(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter IP address or CIDR"
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                  />
                  <Button size="sm" onClick={addIpAddress}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle>Data Protection</CardTitle>
            <CardDescription>
              Configure data encryption, backup, and compliance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data Encryption</Label>
                <p className="text-sm text-gray-500">
                  Encrypt sensitive data at rest
                </p>
              </div>
              <Switch
                checked={settings.dataProtection.enableEncryption}
                onCheckedChange={(checked) =>
                  updateDataProtection("enableEncryption", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select
                value={settings.dataProtection.backupFrequency}
                onValueChange={(value) =>
                  updateDataProtection("backupFrequency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataRetention">Data Retention (days)</Label>
              <Input
                id="dataRetention"
                type="number"
                min="30"
                max="2555"
                value={settings.dataProtection.dataRetention}
                onChange={(e) =>
                  updateDataProtection(
                    "dataRetention",
                    parseInt(e.target.value) || 365,
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logging</Label>
                <p className="text-sm text-gray-500">
                  Log all user activities and changes
                </p>
              </div>
              <Switch
                checked={settings.dataProtection.enableAuditLog}
                onCheckedChange={(checked) =>
                  updateDataProtection("enableAuditLog", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>GDPR Compliance</Label>
                <p className="text-sm text-gray-500">
                  Enable GDPR compliance features
                </p>
              </div>
              <Switch
                checked={settings.dataProtection.gdprCompliance}
                onCheckedChange={(checked) =>
                  updateDataProtection("gdprCompliance", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* System Security */}
        <Card>
          <CardHeader>
            <CardTitle>System Security</CardTitle>
            <CardDescription>
              Configure firewall, SSL, and other system-level security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Firewall</Label>
                <p className="text-sm text-gray-500">
                  Block unauthorized access attempts
                </p>
              </div>
              <Switch
                checked={settings.systemSecurity.enableFirewall}
                onCheckedChange={(checked) =>
                  updateSystemSecurity("enableFirewall", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SSL Only</Label>
                <p className="text-sm text-gray-500">
                  Force all connections to use HTTPS
                </p>
              </div>
              <Switch
                checked={settings.systemSecurity.sslOnly}
                onCheckedChange={(checked) =>
                  updateSystemSecurity("sslOnly", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rate Limiting</Label>
                <p className="text-sm text-gray-500">
                  Limit requests per IP address
                </p>
              </div>
              <Switch
                checked={settings.systemSecurity.enableRateLimiting}
                onCheckedChange={(checked) =>
                  updateSystemSecurity("enableRateLimiting", checked)
                }
              />
            </div>

            {settings.systemSecurity.enableRateLimiting && (
              <div className="space-y-2">
                <Label htmlFor="maxRequestsPerMinute">
                  Max Requests Per Minute
                </Label>
                <Input
                  id="maxRequestsPerMinute"
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.systemSecurity.maxRequestsPerMinute}
                  onChange={(e) =>
                    updateSystemSecurity(
                      "maxRequestsPerMinute",
                      parseInt(e.target.value) || 100,
                    )
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>API Access Key</Label>
              <div className="flex gap-2">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={mockApiKey}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={generateNewApiKey}>
                  Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {securityScore < 80 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Security Recommendations</h3>
                <p className="text-sm">
                  Your security score is {securityScore}%. Consider enabling
                  two-factor authentication and reviewing your password policy
                  to improve security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
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
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
