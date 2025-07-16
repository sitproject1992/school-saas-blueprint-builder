import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";

export default function DashboardPage() {
  // Mock data for overview
  const overviewStats = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+5.2%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Teachers",
      value: "89",
      change: "+2.1%",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Active Classes",
      value: "45",
      change: "+1.5%",
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+8.7%",
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ];

  const roleDashboards = [
    {
      role: "Admin",
      title: "Administrator Dashboard",
      description: "Complete school management and oversight",
      icon: Settings,
      color: "bg-red-500",
      route: "/admin-dashboard",
      features: ["User Management", "System Settings", "Analytics", "Reports"],
    },
    {
      role: "School",
      title: "School Dashboard",
      description: "School-wide operations and performance",
      icon: School,
      color: "bg-blue-500",
      route: "/school-dashboard",
      features: ["Enrollment", "Academics", "Finance", "Facilities"],
    },
    {
      role: "Teacher",
      title: "Teacher Dashboard",
      description: "Classroom management and student tracking",
      icon: GraduationCap,
      color: "bg-green-500",
      route: "/teacher-dashboard",
      features: ["Classes", "Students", "Assignments", "Grades"],
    },
    {
      role: "Parent",
      title: "Parent Dashboard",
      description: "Track your child's academic progress",
      icon: User,
      color: "bg-purple-500",
      route: "/parent-dashboard",
      features: ["Child Progress", "Assignments", "Communication", "Events"],
    },
    {
      role: "Student",
      title: "Student Dashboard",
      description: "Personal academic journey and achievements",
      icon: Users,
      color: "bg-orange-500",
      route: "/student-dashboard",
      features: ["Schedule", "Assignments", "Grades", "Achievements"],
    },
  ];

  const quickActions = [
    {
      title: "View Students",
      icon: Users,
      route: "/students",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Manage Teachers",
      icon: GraduationCap,
      route: "/teachers",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Check Attendance",
      icon: Clock,
      route: "/attendance",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "View Reports",
      icon: BarChart3,
      route: "/reports",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Send Messages",
      icon: MessageSquare,
      route: "/messages",
      color: "bg-pink-50 text-pink-600",
    },
    {
      title: "School Calendar",
      icon: Calendar,
      route: "/events",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  const recentActivities = [
    {
      title: "New student enrolled",
      description: "Emma Johnson joined Grade 5A",
      time: "2 hours ago",
      icon: Users,
    },
    {
      title: "Assignment graded",
      description: "Math Quiz - Grade 4 completed",
      time: "4 hours ago",
      icon: FileText,
    },
    {
      title: "Parent meeting scheduled",
      description: "Conference with Smith family",
      time: "1 day ago",
      icon: Calendar,
    },
    {
      title: "Fee payment received",
      description: "Payment from Johnson family",
      time: "2 days ago",
      icon: DollarSign,
    },
  ];

  const handleDashboardNavigation = (route: string) => {
    navigate(route);
  };

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            School Management Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome to your comprehensive school management system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboards">Role Dashboards</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-6">
          {/* Role-Specific Dashboards */}
          <Card>
            <CardHeader>
              <CardTitle>Role-Specific Dashboards</CardTitle>
              <CardDescription>
                Access specialized dashboards based on your role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roleDashboards.map((dashboard, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDashboardNavigation(dashboard.route)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-3 rounded-lg ${dashboard.color} text-white`}
                      >
                        <dashboard.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {dashboard.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {dashboard.role}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {dashboard.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Key Features:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {dashboard.features.map((feature, featureIndex) => (
                          <Badge
                            key={featureIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full mt-4" variant="outline">
                      Access Dashboard
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used features and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuickAction(action.route)}
                    className="h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and actions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <activity.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
