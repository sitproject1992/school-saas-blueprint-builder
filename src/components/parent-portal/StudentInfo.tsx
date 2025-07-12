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
  classes: Database["public"]["Tables"]["classes"]["Row"] | null;
  attendance: Database["public"]["Tables"]["attendance"]["Row"][];
  exam_results: (Database["public"]["Tables"]["exam_results"]["Row"] & {
    subjects: Database["public"]["Tables"]["subjects"]["Row"] | null;
  })[];
  invoices: (Database["public"]["Tables"]["invoices"]["Row"] & {
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
          <h3 className="text-lg font-semibold">Invoices</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Structure</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.fee_structures.name}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                </TableRow>
              ))}
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
