import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStudentData = async (studentId: string) => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      *,
      profiles (*),
      classes (name),
      exam_results (
        *,
        exams (name, type),
        subjects (name)
      )
    `
    )
    .eq("id", studentId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export default function ReportCard() {
  const { studentId } = useParams();
  const { data: student, isLoading, error } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudentData(studentId!),
    enabled: !!studentId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!student) return <div>Student not found.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <strong>Student:</strong> {student.profiles?.first_name}{" "}
              {student.profiles?.last_name}
            </p>
            <p>
              <strong>Admission Number:</strong> {student.admission_number}
            </p>
          </div>
          <div>
            <p>
              <strong>Class:</strong> {student.classes?.name}
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Max Marks</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.exam_results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.exams.name}</TableCell>
                <TableCell>{result.subjects.name}</TableCell>
                <TableCell>{result.marks_obtained}</TableCell>
                <TableCell>{result.max_marks}</TableCell>
                <TableCell>{result.grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
