import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  School,
  Users,
  Activity,
  Settings,
  BarChart3,
  Bell,
  Search,
  User,
  LogOut,
  Key,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolManagement } from "@/hooks/useSchoolManagement";
import { cn } from "@/lib/utils";

interface SuperAdminNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function SuperAdminNavigation({
  currentTab,
  onTabChange,
}: SuperAdminNavigationProps) {
  const { user, signOut } = useAuth();
  const { getSchoolStatistics } = useSchoolManagement();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = getSchoolStatistics();

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "System overview and statistics",
    },
    {
      id: "schools",
      label: "Schools",
      icon: School,
      description: "Manage schools and subscriptions",
      badge: stats.totalSchools,
    },
    {
      id: "admins",
      label: "School Admins",
      icon: Users,
      description: "Manage school administrators",
      badge: stats.totalAdmins,
    },
    {
      id: "audit",
      label: "Audit Logs",
      icon: Activity,
      description: "System activity tracking",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "System configuration",
    },
  ];

  const quickActions = [
    {
      label: "Add School",
      icon: School,
      action: () => {
        // This would be handled by the parent component
        console.log("Add school");
      },
    },
    {
      label: "Add Admin",
      icon: Users,
      action: () => {
        // This would be handled by the parent component
        console.log("Add admin");
      },
    },
    {
      label: "View Reports",
      icon: BarChart3,
      action: () => onTabChange("audit"),
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Skooler
                </h1>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                    currentTab === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <NavigationMenu className="hidden lg:block">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm">
                    Quick Actions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[300px]">
                      {quickActions.map((action, index) => (
                        <NavigationMenuLink key={index} asChild>
                          <button
                            onClick={action.action}
                            className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors text-left w-full"
                          >
                            <action.icon className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">{action.label}</span>
                          </button>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {stats.suspendedSchools > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {stats.suspendedSchools}
                </Badge>
              )}
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.profile?.first_name || "Super Admin"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">
                    {user?.profile?.first_name} {user?.profile?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={() => onTabChange("settings")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange("audit")}>
                  <Activity className="mr-2 h-4 w-4" />
                  Activity Log
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-gray-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors",
                    currentTab === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t px-2 py-3">
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full text-left"
                  >
                    <action.icon className="h-5 w-5" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
