import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Search,
  Calendar,
  Download,
  Filter,
  User,
  School,
  Settings,
  Shield,
} from "lucide-react";
import { useSchoolManagement } from "@/hooks/useSchoolManagement";

interface AuditLogViewerProps {
  limit?: number;
  showFilters?: boolean;
}

export function AuditLogViewer({
  limit = 100,
  showFilters = true,
}: AuditLogViewerProps) {
  const { auditLogs, fetchAuditLogs } = useSchoolManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    fetchAuditLogs(limit);
  }, [limit]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details?.name &&
        log.details.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details?.email &&
        log.details.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesTargetType =
      targetTypeFilter === "all" || log.targetType === targetTypeFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const logDate = new Date(log.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case "today":
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesAction && matchesTargetType && matchesDate;
  });

  const uniqueActions = [...new Set(auditLogs.map((log) => log.action))];
  const uniqueTargetTypes = [
    ...new Set(auditLogs.map((log) => log.targetType)),
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionIcon = (action: string) => {
    if (action.includes("CREATE")) return <User className="h-4 w-4" />;
    if (action.includes("UPDATE")) return <Settings className="h-4 w-4" />;
    if (action.includes("DELETE")) return <Shield className="h-4 w-4" />;
    if (action.includes("SCHOOL")) return <School className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getActionBadge = (action: string) => {
    const colorMap: { [key: string]: string } = {
      CREATE_SCHOOL: "bg-green-100 text-green-800 border-green-200",
      UPDATE_SCHOOL: "bg-blue-100 text-blue-800 border-blue-200",
      DELETE_SCHOOL: "bg-red-100 text-red-800 border-red-200",
      CREATE_SCHOOL_ADMIN: "bg-green-100 text-green-800 border-green-200",
      UPDATE_PASSWORD: "bg-yellow-100 text-yellow-800 border-yellow-200",
      LOGIN: "bg-purple-100 text-purple-800 border-purple-200",
      LOGOUT: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        variant="outline"
        className={`${colorMap[action] || "bg-gray-100 text-gray-800 border-gray-200"} flex items-center gap-1`}
      >
        {getActionIcon(action)}
        {action.replace(/_/g, " ").toLowerCase()}
      </Badge>
    );
  };

  const exportLogs = () => {
    const csvContent = [
      ["Date/Time", "Action", "Target Type", "Target ID", "Details"],
      ...filteredLogs.map((log) => [
        formatDateTime(log.createdAt),
        log.action,
        log.targetType,
        log.targetId,
        JSON.stringify(log.details),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Audit Logs
            </CardTitle>
            <CardDescription>
              Comprehensive tracking of all system activities and changes
            </CardDescription>
          </div>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={targetTypeFilter}
              onValueChange={setTargetTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Target Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTargetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setActionFilter("all");
                setTargetTypeFilter("all");
                setDateFilter("all");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredLogs.length} of {auditLogs.length} logs
            </span>
            <span>
              Last updated: {formatDateTime(new Date().toISOString())}
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No audit logs found matching the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{log.targetType}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {log.targetId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1 max-w-[200px]">
                        {log.details?.name && (
                          <div>
                            <span className="font-medium">Name:</span>{" "}
                            {log.details.name}
                          </div>
                        )}
                        {log.details?.email && (
                          <div>
                            <span className="font-medium">Email:</span>{" "}
                            {log.details.email}
                          </div>
                        )}
                        {log.details?.subdomain && (
                          <div>
                            <span className="font-medium">Subdomain:</span>{" "}
                            {log.details.subdomain}
                          </div>
                        )}
                        {log.details?.status && (
                          <div>
                            <span className="font-medium">Status:</span>{" "}
                            {log.details.status}
                          </div>
                        )}
                        {log.details?.school_id && (
                          <div>
                            <span className="font-medium">School ID:</span>{" "}
                            {log.details.school_id}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {log.ipAddress || "Unknown"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredLogs.length > 20 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchAuditLogs(limit + 50)}
              >
                Load More Logs
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
