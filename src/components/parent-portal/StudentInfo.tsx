import { type Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Student = Database["public"]["Tables"]["students"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
  classes: Database["public"]["Tables"]["classes"]["Row"] & {
    syllabus: (Database["public"]["Tables"]["syllabus"]["Row"] & {
      subjects: Database["public"]["Tables"]["subjects"]["Row"];
    })[];
    lesson_plans: (Database["public"]["Tables"]["lesson_plans"]["Row"] & {
      subjects: Database["public"]["Tables"]["subjects"]["Row"];
    })[];
  } | null;
  attendance: Database["public"]["Tables"]["attendance"]["Row"][];
  exam_results: (Database["public"]["Tables"]["exam_results"]["Row"] & {
    subjects: Database["public"]["Tables"]["subjects"]["Row"] | null;
  })[];
  fee_payments: (Database["public"]["Tables"]["fee_payments"]["Row"] & {
    fee_structures: Database["public"]["Tables"]["fee_structures"]["Row"];
  })[];
};

export function StudentInfo({ student }: { student: Student }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {student.profiles?.first_name} {student.profiles?.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Admission Number:</strong> {student.admission_number}
            </p>
            <p>
              <strong>Class:</strong> {student.classes?.name}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recent Attendance</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.attendance.slice(0, 5).map((att) => (
                <TableRow key={att.id}>
                  <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                  <TableCell>{att.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Syllabus</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.classes?.syllabus?.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.title}</TableCell>
                  <TableCell>{s.subjects.name}</TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No syllabus available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Lesson Plans</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Planned Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.classes?.lesson_plans?.map((lp) => (
                <TableRow key={lp.id}>
                  <TableCell>{lp.title}</TableCell>
                  <TableCell>{lp.subjects.name}</TableCell>
                  <TableCell>{new Date(lp.planned_date).toLocaleDateString()}</TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No lesson plans available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Fee Payments</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Structure</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.fee_payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.fee_structures.name}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No fee payments recorded
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Exam Results</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.exam_results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.subjects?.name}</TableCell>
                  <TableCell>{result.marks_obtained}</TableCell>
                  <TableCell>{result.max_marks}</TableCell>
                  <TableCell>{result.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
