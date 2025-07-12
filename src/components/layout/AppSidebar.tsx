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

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Academic",
    items: [
      {
        title: "Students",
        url: "/students",
        icon: GraduationCap,
      },
      {
        title: "Teachers",
        url: "/teachers",
        icon: Users,
      },
      {
        title: "Classes",
        url: "/classes",
        icon: BookOpen,
      },
      {
        title: "Subjects",
        url: "/subjects",
        icon: BookOpen,
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: ClipboardList,
      },
      {
        title: "Syllabus",
        url: "/syllabus",
        icon: FileText,
      },
      {
        title: "Lesson Plans",
        url: "/lesson-plans",
        icon: Calendar,
      },
      {
        title: "Exams",
        url: "/exams",
        icon: TestTube,
      },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        title: "Fee Management",
        url: "/fees",
        icon: DollarSign,
      },
      {
        title: "Payments",
        url: "/payments",
        icon: CreditCard,
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
      },
      {
        title: "Announcements",
        url: "/announcements",
        icon: Megaphone,
      },
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
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
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-semibold">School SaaS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.title}>
            {section.items ? (
              <>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.url}
                        >
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
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
                    >
                      <Link to={section.url}>
                        <section.icon />
                        <span>{section.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          © 2024 School SaaS
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}