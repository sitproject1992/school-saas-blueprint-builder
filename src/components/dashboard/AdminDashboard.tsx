import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardData } from "@/hooks/useDashboardData";
import {
  Users,
  GraduationCap,
  School,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  UserPlus,
  ArrowUpRight,
  UserCheck,
  Receipt,
  FileText,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock3,
  TrendingDown,
  TestTube,
  Package,
  Megaphone,
  MessageSquare,
  BarChart3,
  PieChart,
  Building2,
  ShieldCheck,
  Wallet,
  ClipboardList,
  BookCheck,
  Users2,
  CalendarDays,
  Archive,
  CreditCard,
  PhoneCall,
  Mail,
  Activity,
  Briefcase,
  HelpCircle,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-muted-foreground">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: data?.totalStudents || 1342,
      change: "+20.1%",
      trend: "up",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Enrolled this semester",
    },
    {
      title: "Total Teachers",
      value: data?.totalTeachers || 89,
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Active faculty members",
    },
    {
      title: "Total Classes",
      value: data?.totalClasses || 45,
      change: "+5.2%",
      trend: "up",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Running this semester",
    },
    {
      title: "Monthly Revenue",
      value: `₹${(data?.totalRevenue || 245800).toLocaleString()}`,
      change: "-2.4%",
      trend: "down",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Fee collection this month",
    },
  ];

  // Academic Management Module Data
  const academicModules = [
    {
      title: "Students",
      count: 1342,
      icon: GraduationCap,
      url: "/students",
      color: "blue",
      stats: { active: 1298, new: 44, pending: 12 },
      recentActions: [
        "John Smith enrolled today",
        "Grade 10 batch created",
        "15 transfer certificates issued",
      ],
    },
    {
      title: "Teachers",
      count: 89,
      icon: Users,
      url: "/teachers",
      color: "green",
      stats: { active: 85, onLeave: 4, new: 3 },
      recentActions: [
        "Ms. Sarah hired as Math teacher",
        "Training program completed",
        "Performance reviews due",
      ],
    },
    {
      title: "Classes",
      count: 45,
      icon: BookOpen,
      url: "/classes",
      color: "purple",
      stats: { active: 42, cancelled: 3, scheduled: 15 },
      recentActions: [
        "Physics lab scheduled",
        "Grade 9 room changed",
        "Extra classes added",
      ],
    },
    {
      title: "Subjects",
      count: 28,
      icon: BookCheck,
      url: "/subjects",
      color: "indigo",
      stats: { core: 18, elective: 10, practical: 8 },
      recentActions: [
        "Computer Science updated",
        "Art curriculum revised",
        "New lab equipment added",
      ],
    },
    {
      title: "Attendance",
      count: "92%",
      icon: UserCheck,
      url: "/attendance",
      color: "emerald",
      stats: { present: 1234, absent: 108, late: 24 },
      recentActions: [
        "Daily report generated",
        "Absentee notices sent",
        "Perfect attendance awards",
      ],
    },
    {
      title: "Syllabus",
      count: 15,
      icon: FileText,
      url: "/syllabus",
      color: "orange",
      stats: { completed: 12, inProgress: 3, pending: 2 },
      recentActions: [
        "Grade 8 syllabus updated",
        "Science curriculum approved",
        "History topics added",
      ],
    },
    {
      title: "Lesson Plans",
      count: 156,
      icon: ClipboardList,
      url: "/lesson-plans",
      color: "rose",
      stats: { approved: 142, pending: 14, draft: 8 },
      recentActions: [
        "Weekly plans submitted",
        "Math lessons reviewed",
        "Activity plans created",
      ],
    },
  ];

  // Finance & Billing Module Data
  const financeModules = [
    {
      title: "Fee Structures",
      count: 12,
      icon: DollarSign,
      url: "/fees",
      color: "green",
      stats: { active: 8, draft: 4, archived: 2 },
      recentActions: [
        "Grade 10 fees updated",
        "Scholarship rates revised",
        "Payment plans created",
      ],
    },
    {
      title: "Invoices",
      count: 1234,
      icon: Receipt,
      url: "/invoices",
      color: "blue",
      stats: { paid: 1098, pending: 136, overdue: 24 },
      recentActions: [
        "Monthly invoices generated",
        "Payment reminders sent",
        "Late fee applied",
      ],
    },
    {
      title: "Payments",
      count: "₹24.5L",
      icon: Wallet,
      url: "/payments",
      color: "emerald",
      stats: { received: 210500, pending: 35300, refunded: 2800 },
      recentActions: [
        "Online payment received",
        "Cash collection recorded",
        "Refund processed",
      ],
    },
  ];

  // Operations Module Data
  const operationsModules = [
    {
      title: "Inventory",
      count: 542,
      icon: Package,
      url: "/inventory",
      color: "orange",
      stats: { inStock: 487, lowStock: 55, outOfStock: 12 },
      recentActions: [
        "New books received",
        "Lab equipment ordered",
        "Furniture delivered",
      ],
    },
    {
      title: "Exams",
      count: 28,
      icon: TestTube,
      url: "/exams",
      color: "purple",
      stats: { scheduled: 15, ongoing: 8, completed: 5 },
      recentActions: [
        "Final exams scheduled",
        "Answer sheets scanned",
        "Results published",
      ],
    },
    {
      title: "Announcements",
      count: 45,
      icon: Megaphone,
      url: "/announcements",
      color: "red",
      stats: { active: 12, scheduled: 8, draft: 25 },
      recentActions: [
        "Holiday notice posted",
        "Parent meeting announced",
        "Sports day scheduled",
      ],
    },
  ];

  // Communication Module Data
  const communicationModules = [
    {
      title: "Parent Portal",
      count: 892,
      icon: Users2,
      url: "/parent-portal",
      color: "pink",
      stats: { active: 856, pending: 36, inactive: 24 },
      recentActions: [
        "Progress reports shared",
        "Meeting requests sent",
        "Feedback received",
      ],
    },
    {
      title: "Messages",
      count: 156,
      icon: MessageSquare,
      url: "/messages",
      color: "cyan",
      stats: { unread: 23, sent: 133, drafts: 8 },
      recentActions: [
        "Staff circular sent",
        "Parent notifications",
        "Emergency alerts",
      ],
    },
  ];

  // Analytics & Reports Module Data
  const analyticsModules = [
    {
      title: "Reports",
      count: 34,
      icon: BarChart3,
      url: "/reports",
      color: "violet",
      stats: { generated: 28, scheduled: 6, pending: 4 },
      recentActions: [
        "Monthly report generated",
        "Attendance analysis",
        "Financial summary",
      ],
    },
    {
      title: "Statistics",
      count: "98%",
      icon: PieChart,
      url: "/statistics",
      color: "amber",
      stats: { performance: 98, attendance: 92, satisfaction: 89 },
      recentActions: [
        "Performance metrics updated",
        "Trend analysis completed",
        "Dashboard refreshed",
      ],
    },
  ];

  // Administration Module Data
  const administrationModules = [
    {
      title: "Schools",
      count: 3,
      icon: Building2,
      url: "/schools",
      color: "slate",
      stats: { active: 3, branches: 5, campuses: 2 },
      recentActions: [
        "New branch registered",
        "School profile updated",
        "Campus details modified",
      ],
    },
    {
      title: "Users",
      count: 1567,
      icon: ShieldCheck,
      url: "/users",
      color: "stone",
      stats: { admin: 12, teachers: 89, parents: 892, students: 1342 },
      recentActions: [
        "New admin added",
        "Teacher permissions updated",
        "Student accounts created",
      ],
    },
    {
      title: "Settings",
      count: 15,
      icon: Settings,
      url: "/settings",
      color: "gray",
      stats: { configured: 12, pending: 3, default: 8 },
      recentActions: [
        "Academic year configured",
        "Fee structure updated",
        "Notification settings changed",
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<
      string,
      { bg: string; text: string; border: string }
    > = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
      },
      rose: {
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-200",
      },
      red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
      pink: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
      },
      cyan: {
        bg: "bg-cyan-50",
        text: "text-cyan-600",
        border: "border-cyan-200",
      },
      violet: {
        bg: "bg-violet-50",
        text: "text-violet-600",
        border: "border-violet-200",
      },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
      },
      slate: {
        bg: "bg-slate-50",
        text: "text-slate-600",
        border: "border-slate-200",
      },
      stone: {
        bg: "bg-stone-50",
        text: "text-stone-600",
        border: "border-stone-200",
      },
      gray: {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const ModuleCard = ({
    module,
    showDetails = false,
  }: {
    module: any;
    showDetails?: boolean;
  }) => {
    const colors = getColorClasses(module.color);

    return (
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform`}
            >
              <module.icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">
                {module.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Manage and track</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to={module.url}>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{module.count}</span>
              <Badge
                variant="secondary"
                className={`${colors.bg} ${colors.text} border-none`}
              >
                Active
              </Badge>
            </div>

            {showDetails && (
              <>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(module.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="font-semibold">{value as string}</div>
                      <div className="text-muted-foreground capitalize">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Recent Activity:
                  </p>
                  {module.recentActions
                    .slice(0, 2)
                    .map((action: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${colors.text.replace("text-", "bg-")}`}
                        />
                        <span className="text-muted-foreground truncate">
                          {action}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            School Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete overview of all school operations and management modules
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-red-500">3</Badge>
          </Button>
          <Badge
            variant="outline"
            className="text-green-600 border-green-600 px-3 py-1"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Demo Mode
          </Badge>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 1. Academic Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Academic Management</h2>
              <p className="text-sm text-muted-foreground">
                Students, Teachers, Classes, Subjects, Attendance, Syllabus,
                Lesson Plans
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {academicModules.map((module, index) => (
            <ModuleCard key={index} module={module} showDetails={true} />
          ))}
        </div>
      </div>

      {/* 2. Finance and Billing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Finance and Billing</h2>
              <p className="text-sm text-muted-foreground">
                Fee structures, Invoices, Payments
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {financeModules.map((module, index) => (
            <ModuleCard key={index} module={module} showDetails={true} />
          ))}
        </div>
      </div>

      {/* 3. Operations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Operations</h2>
              <p className="text-sm text-muted-foreground">
                Inventory, Exams, Announcements
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {operationsModules.map((module, index) => (
            <ModuleCard key={index} module={module} showDetails={true} />
          ))}
        </div>
      </div>

      {/* 4. Communication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Communication</h2>
              <p className="text-sm text-muted-foreground">
                Parental Portal, Messages
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {communicationModules.map((module, index) => (
            <ModuleCard key={index} module={module} showDetails={true} />
          ))}
        </div>
      </div>

      {/* 5. Analytics and Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Analytics and Reports</h2>
              <p className="text-sm text-muted-foreground">
                Reports, Statistics
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {analyticsModules.map((module, index) => (
            <ModuleCard key={index} module={module} showDetails={true} />
          ))}
        </div>
      </div>

      {/* 6. Administration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Administration</h2>
              <p className="text-sm text-muted-foreground">
                Schools, Users, Settings
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {administrationModules.map((module, index) => (
            <ModuleCard key={index} module={module} showDetails={true} />
          ))}
        </div>
      </div>

      {/* Quick Access Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Demo Account Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-muted-foreground">Main Modules</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-muted-foreground">
                Sub Components
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-muted-foreground">Demo Content</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              This dashboard demonstrates the complete school management system
              with sample data. All modules are functional and ready for
              real-world deployment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
