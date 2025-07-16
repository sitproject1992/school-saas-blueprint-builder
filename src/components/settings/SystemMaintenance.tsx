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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Save,
  RefreshCw,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Server,
  HardDrive,
  Activity,
  Zap,
  Bug,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface SystemStatus {
  database: "healthy" | "warning" | "error";
  storage: "healthy" | "warning" | "error";
  memory: "healthy" | "warning" | "error";
  cpu: "healthy" | "warning" | "error";
  uptime: string;
  lastBackup: string;
  nextMaintenance: string;
}

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  type: "backup" | "cleanup" | "update" | "optimization";
  status: "scheduled" | "running" | "completed" | "failed";
  lastRun: string;
  nextRun: string;
  duration?: number;
  progress?: number;
}

interface MaintenanceSettingsData {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

interface SystemMaintenanceProps {
  onSave?: (data: MaintenanceSettingsData) => Promise<void>;
}

export function SystemMaintenance({ onSave }: SystemMaintenanceProps) {
  const [loading, setLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "System is currently under maintenance. Please try again later.",
  );

  const [systemStatus] = useState<SystemStatus>({
    database: "healthy",
    storage: "warning",
    memory: "healthy",
    cpu: "healthy",
    uptime: "15 days, 4 hours",
    lastBackup: "2 hours ago",
    nextMaintenance: "Tomorrow at 2:00 AM",
  });

  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: "backup-daily",
      name: "Daily Database Backup",
      description: "Create full database backup with encryption",
      type: "backup",
      status: "completed",
      lastRun: "2 hours ago",
      nextRun: "In 22 hours",
      duration: 45,
    },
    {
      id: "cleanup-logs",
      name: "Log Cleanup",
      description: "Remove old log files and temporary data",
      type: "cleanup",
      status: "scheduled",
      lastRun: "Yesterday",
      nextRun: "In 2 hours",
    },
    {
      id: "update-system",
      name: "System Updates",
      description: "Check and install security updates",
      type: "update",
      status: "scheduled",
      lastRun: "3 days ago",
      nextRun: "Tomorrow",
    },
    {
      id: "optimize-db",
      name: "Database Optimization",
      description: "Optimize database tables and indexes",
      type: "optimization",
      status: "running",
      lastRun: "Now",
      nextRun: "Next week",
      progress: 65,
    },
  ]);

  const systemMetrics = {
    storage: { used: 65, total: 100, unit: "GB" },
    memory: { used: 4.2, total: 8, unit: "GB" },
    cpu: { used: 23, unit: "%" },
    database: { size: 2.1, unit: "GB" },
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave({ maintenanceMode, maintenanceMessage });
      }
      toast.success("System maintenance settings saved successfully");
    } catch (error) {
      console.error("Error saving maintenance settings:", error);
      toast.error("Failed to save maintenance settings");
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceModeToggle = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    if (enabled) {
      toast.warning(
        "Maintenance mode enabled - users will see maintenance message",
      );
    } else {
      toast.success(
        "Maintenance mode disabled - system is accessible to users",
      );
    }
  };

  const handleRunTask = (taskId: string) => {
    setMaintenanceTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "running" as const, progress: 0 }
          : task,
      ),
    );

    // Simulate task progress
    const interval = setInterval(() => {
      setMaintenanceTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId && task.status === "running") {
            const newProgress = (task.progress || 0) + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...task,
                status: "completed" as const,
                progress: 100,
                lastRun: "Just now",
              };
            }
            return { ...task, progress: newProgress };
          }
          return task;
        }),
      );
    }, 500);

    toast.success(
      `Started ${maintenanceTasks.find((t) => t.id === taskId)?.name}`,
    );
  };

  const handleCreateBackup = () => {
    handleRunTask("backup-manual");
    // Add manual backup task if it doesn't exist
    if (!maintenanceTasks.find((t) => t.id === "backup-manual")) {
      setMaintenanceTasks((prev) => [
        ...prev,
        {
          id: "backup-manual",
          name: "Manual Backup",
          description: "Manual database backup initiated by admin",
          type: "backup",
          status: "running",
          lastRun: "Now",
          nextRun: "On demand",
          progress: 0,
        },
      ]);
    }
  };

  const handleRestoreBackup = () => {
    toast.warning(
      "Backup restoration would be implemented here with proper safeguards",
    );
  };

  const handleCleanupOldData = () => {
    handleRunTask("cleanup-old-data");
    if (!maintenanceTasks.find((t) => t.id === "cleanup-old-data")) {
      setMaintenanceTasks((prev) => [
        ...prev,
        {
          id: "cleanup-old-data",
          name: "Clean Old Data",
          description: "Remove expired data and unused files",
          type: "cleanup",
          status: "running",
          lastRun: "Now",
          nextRun: "On demand",
          progress: 0,
        },
      ]);
    }
  };

  const getStatusIcon = (status: SystemStatus[keyof SystemStatus]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: {
      [key: string]: "default" | "secondary" | "destructive" | "outline";
    } = {
      healthy: "default",
      warning: "outline",
      error: "destructive",
      scheduled: "secondary",
      running: "default",
      completed: "outline",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "backup":
        return <Database className="h-4 w-4" />;
      case "cleanup":
        return <Trash2 className="h-4 w-4" />;
      case "update":
        return <Download className="h-4 w-4" />;
      case "optimization":
        return <Zap className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          System Maintenance
        </h2>
        <p className="text-gray-600">
          Monitor system health and manage maintenance tasks
        </p>
      </div>

      {/* Maintenance Mode */}
      <Card className={maintenanceMode ? "border-orange-200 bg-orange-50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {maintenanceMode ? (
              <Pause className="h-5 w-5 text-orange-600" />
            ) : (
              <Play className="h-5 w-5 text-green-600" />
            )}
            Maintenance Mode
          </CardTitle>
          <CardDescription>
            {maintenanceMode
              ? "System is in maintenance mode - users cannot access the platform"
              : "System is operational and accessible to users"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Maintenance Mode</Label>
              <p className="text-sm text-gray-500">
                Temporarily disable user access for maintenance
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceModeToggle}
            />
          </div>

          {maintenanceMode && (
            <div className="space-y-2">
              <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
              <Textarea
                id="maintenanceMessage"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Enter message to display to users"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Real-time system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database
                </Label>
                {getStatusIcon(systemStatus.database)}
              </div>
              <div className="text-2xl font-bold">
                {systemMetrics.database.size} {systemMetrics.database.unit}
              </div>
              <p className="text-sm text-gray-500">Size</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Storage
                </Label>
                {getStatusIcon(systemStatus.storage)}
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {systemMetrics.storage.used}/{systemMetrics.storage.total}{" "}
                  {systemMetrics.storage.unit}
                </div>
                <Progress
                  value={
                    (systemMetrics.storage.used / systemMetrics.storage.total) *
                    100
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Memory
                </Label>
                {getStatusIcon(systemStatus.memory)}
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {systemMetrics.memory.used}/{systemMetrics.memory.total}{" "}
                  {systemMetrics.memory.unit}
                </div>
                <Progress
                  value={
                    (systemMetrics.memory.used / systemMetrics.memory.total) *
                    100
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  CPU Usage
                </Label>
                {getStatusIcon(systemStatus.cpu)}
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {systemMetrics.cpu.used}
                  {systemMetrics.cpu.unit}
                </div>
                <Progress value={systemMetrics.cpu.used} />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Uptime: {systemStatus.uptime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-500" />
              <span>Last Backup: {systemStatus.lastBackup}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Next Maintenance: {systemStatus.nextMaintenance}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Perform common maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" onClick={handleCreateBackup}>
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
            <Button variant="outline" onClick={handleRestoreBackup}>
              <Upload className="h-4 w-4 mr-2" />
              Restore Backup
            </Button>
            <Button variant="outline" onClick={handleCleanupOldData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Cleanup Old Data
            </Button>
            <Button variant="outline">
              <Bug className="h-4 w-4 mr-2" />
              System Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Maintenance Tasks</CardTitle>
          <CardDescription>
            Automated and manual maintenance operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getTaskIcon(task.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{task.name}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>Last run: {task.lastRun}</span>
                      <span>Next run: {task.nextRun}</span>
                      {task.duration && (
                        <span>Duration: {task.duration}min</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === "running" && task.progress !== undefined && (
                    <div className="w-24">
                      <Progress value={task.progress} />
                      <p className="text-xs text-center mt-1">
                        {task.progress}%
                      </p>
                    </div>
                  )}

                  {task.status === "scheduled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRunTask(task.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run Now
                    </Button>
                  )}

                  {task.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRunTask(task.id)}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Run Again
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
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
