import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentInfoProps {
  student: any;
}

export function StudentInfo({ student }: StudentInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{student.first_name} {student.last_name}'s Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Overall GPA: <strong>A-</strong></p>
            {/* Placeholder for detailed grades */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Overall: <strong>95%</strong></p>
            {/* Placeholder for detailed attendance */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for schedule */}
            <p>Monday: Math, Science, English</p>
            <p>Tuesday: History, Art, P.E.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
