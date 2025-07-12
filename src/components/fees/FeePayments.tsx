import { useState } from "react";
import { useFeeData } from "@/hooks/useFeeData";
import { useStudents } from "@/hooks/useStudents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function FeePayments() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { students } = useStudents(null); // Fetch all students
  const { getPaymentsQuery } = useFeeData();
  const { data: payments, isLoading, error } = getPaymentsQuery(selectedStudent!);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-1/3 mb-4">
          <Label>Select Student</Label>
          <Select onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students?.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.profiles?.first_name} {s.profiles?.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </_Select>
        </div>

        {isLoading && <div>Loading payments...</div>}
        {error && <div>Error: {error.message}</div>}

        {selectedStudent && payments && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.fee_structures?.name}</TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>{new Date(p.due_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
