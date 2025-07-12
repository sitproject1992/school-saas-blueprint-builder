import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeacherDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            My Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">
            View all your classes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            My Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">120</div>
          <p className="text-xs text-muted-foreground">
            View all your students
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98%</div>
          <p className="text-xs text-muted-foreground">
            Today's attendance
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            My Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs text-muted-foreground">
            Classes today
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
