import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeachers } from "@/hooks/useTeachers";
import { TeacherForm } from "@/components/teachers/TeacherForm";

export default function Teachers() {
  const { teachers, isLoading, error } = useTeachers();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your school's teachers.
          </p>
        </div>
        <TeacherForm />
      </div>
      {isLoading && <p>Loading teachers...</p>}
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teachers?.map((teacher) => (
          <Card key={teacher.id}>
            <CardHeader>
              <CardTitle>{teacher.first_name} {teacher.last_name}</CardTitle>
              <CardDescription>Subject: {teacher.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Email: {teacher.email}</p>
              <p>Phone: {teacher.phone}</p>
              <div className="mt-4 flex space-x-2">
                <TeacherForm teacher={teacher} />
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
