import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  TestTube,
  DollarSign,
  CreditCard,
  Package,
  Megaphone,
  BarChart3,
  Building2,
  Settings,
  Home,
  School,
  UserCheck,
  CalendarDays,
  BookCheck,
  Receipt,
  Wallet,
  Archive,
  MessageSquare,
  PieChart,
  Users2,
  ShieldCheck,
  Bell,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Overview & Analytics",
  },
  {
    title: "Academic Management",
    items: [
      {
        title: "Students",
        url: "/students",
        icon: GraduationCap,
        description: "Student profiles & records",
      },
      {
        title: "Teachers",
        url: "/teachers",
        icon: Users,
        description: "Faculty management",
      },
      {
        title: "Classes",
        url: "/classes",
        icon: BookOpen,
        description: "Class schedules & rooms",
      },
      {
        title: "Subjects",
        url: "/subjects",
        icon: BookCheck,
        description: "Curriculum & subjects",
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: UserCheck,
        description: "Daily attendance tracking",
      },
      {
        title: "Syllabus",
        url: "/syllabus",
        icon: FileText,
        description: "Course curriculum",
      },
      {
        title: "Lesson Plans",
        url: "/lesson-plans",
        icon: ClipboardList,
        description: "Teaching schedules",
      },
    ],
  },
  {
    title: "Finance & Billing",
    items: [
      {
        title: "Fee Structures",
        url: "/fees",
        icon: DollarSign,
        description: "Tuition & fee setup",
      },
      {
        title: "Invoices",
        url: "/invoices",
        icon: Receipt,
        description: "Billing & payments",
      },
      {
        title: "Payments",
        url: "/payments",
        icon: Wallet,
        description: "Payment tracking",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Inventory",
        url: "/inventory",
        icon: Package,
        description: "Assets & supplies",
      },
      {
        title: "Exams",
        url: "/exams",
        icon: TestTube,
        description: "Examinations & grades",
      },
      {
        title: "Announcements",
        url: "/announcements",
        icon: Megaphone,
        description: "School notifications",
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Parent Portal",
        url: "/parent-portal",
        icon: Users2,
        description: "Parent communication",
      },
      {
        title: "Messages",
        url: "/messages",
        icon: MessageSquare,
        description: "Internal messaging",
      },
    ],
  },
  {
    title: "Analytics & Reports",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
        description: "Performance analytics",
      },
      {
        title: "Statistics",
        url: "/statistics",
        icon: PieChart,
        description: "School metrics",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Schools",
        url: "/schools",
        icon: Building2,
        description: "Multi-school management",
      },
      {
        title: "Users",
        url: "/users",
        icon: ShieldCheck,
        description: "User management",
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        description: "System configuration",
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { isSuperAdmin, isSchoolAdmin, isTeacher, isStudent, isParent } = useTenant();

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    if (isSuperAdmin) {
      return menuItems; // Super admin sees everything
    }

    if (isSchoolAdmin) {
      return menuItems.filter(section => 
        section.title !== "Administration" || 
        section.items?.some(item => item.title === "Settings")
      );
    }

    if (isTeacher) {
      return menuItems.filter(section => 
        section.title === "Dashboard" ||
        section.title === "Academic Management" ||
        section.title === "Operations" ||
        (section.title === "Communication" && section.items?.some(item => item.title === "Messages"))
      );
    }

    if (isStudent) {
      return menuItems.filter(section => 
        section.title === "Dashboard" ||
        (section.title === "Academic Management" && section.items?.some(item => 
          item.title === "Classes" || item.title === "Subjects" || item.title === "Syllabus"
        )) ||
        (section.title === "Operations" && section.items?.some(item => item.title === "Exams"))
      );
    }

    if (isParent) {
      return menuItems.filter(section => 
        section.title === "Dashboard" ||
        section.title === "Communication"
      );
    }

    return menuItems; // Default fallback
  };

  const filteredMenuItems = getFilteredMenuItems();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <School className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
            <div className="font-bold text-lg">Skooler</div>
            <div className="text-xs text-blue-100">School Management</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {filteredMenuItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-2">
            {section.items ? (
              <>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname.startsWith(item.url)}
                          className="group hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg mx-1"
                        >
                          <Link
                            to={item.url}
                            className="flex items-center gap-3 px-3 py-2"
                          >
                            <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium">
                                {item.title}
                              </span>
                              <div className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === section.url}
                      className="group hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg mx-1"
                    >
                      <Link
                        to={section.url}
                        className="flex items-center gap-3 px-3 py-2"
                      >
                        <section.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{section.title}</span>
                          <div className="text-xs text-muted-foreground">
                            {section.description}
                          </div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t bg-muted/30">
        <div className="p-4 text-center">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Skooler Inc.
          </div>
          <div className="text-xs font-medium text-primary mt-1">v2.1.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
