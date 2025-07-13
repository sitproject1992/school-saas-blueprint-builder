import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParentDashboardData } from "@/hooks/useDashboardData";
import { Users, Calendar, Megaphone, DollarSign, AlertTriangle } from "lucide-react";

export function ParentDashboard() {
  const { data, isLoading, error } = useParentDashboardData();

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
              My Children
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.children?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalAttendance?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.upcomingEvents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Fees
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data?.pendingFees?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Children Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Children Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.children?.map((child: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{child.profiles?.first_name} {child.profiles?.last_name}</p>
                    <p className="text-xs text-muted-foreground">ID: {child.admission_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">Active</p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No children enrolled</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                View Children's Attendance
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                Check Exam Results
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                Pay Fees Online
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                Download Reports
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:underline">
                Message Teachers
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
