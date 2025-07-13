import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherDashboardData } from "@/hooks/useDashboardData";
import { Users, BookOpen, TrendingUp, Calendar, AlertTriangle } from "lucide-react";

export function TeacherDashboard() {
  const { data, isLoading, error } = useTeacherDashboardData();

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Classes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalClasses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Classes assigned to you
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Students in your classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.attendanceRate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Exams
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.upcomingExams || 0}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled exams
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Lesson Plans
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.pendingLessonPlans || 0}</div>
            <p className="text-xs text-muted-foreground">
              Lesson plans to complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                Mark Today's Attendance
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                Create Lesson Plan
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                View Class Schedule
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
