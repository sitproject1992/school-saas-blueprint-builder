import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface AttendanceTableProps {
  classId: number;
  date: string;
}

const fetchStudentsForClass = async (classId: number) => {
  const { data, error } = await supabase
    .from("students")
    .select("id, first_name, last_name")
    .eq("class_id", classId);
  if (error) throw new Error(error.message);
  return data;
};

const fetchAttendance = async (classId: number, date: string) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("class_id", classId)
    .eq("date", date);
  if (error) throw new Error(error.message);
  return data;
};

export function AttendanceTable({ classId, date }: AttendanceTableProps) {
  const queryClient = useQueryClient();
  const [attendanceData, setAttendanceData] = useState<any>({});

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", classId],
    queryFn: () => fetchStudentsForClass(classId),
    enabled: !!classId,
  });

  const { data: initialAttendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["attendance", classId, date],
    queryFn: () => fetchAttendance(classId, date),
    enabled: !!classId && !!date,
    onSuccess: (data) => {
      const initialData = data.reduce((acc, record) => {
        acc[record.student_id] = { status: record.status, remarks: record.remarks || "" };
        return acc;
      }, {});
      setAttendanceData(initialData);
    },
  });

  const mutation = useMutation({
    mutationFn: async (newData: any) => {
      const recordsToUpsert = Object.keys(newData).map((studentId) => ({
        student_id: parseInt(studentId),
        class_id: classId,
        date,
        status: newData[studentId].status,
        remarks: newData[studentId].remarks,
      }));

      const { error } = await supabase.from("attendance").upsert(recordsToUpsert, {
        onConflict: 'student_id, class_id, date'
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", classId, date] });
    },
  });

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceData((prev: any) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceData((prev: any) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks },
    }));
  };

  const handleSubmit = () => {
    mutation.mutate(attendanceData);
  };

  if (isLoadingStudents || isLoadingAttendance) return <div>Loading...</div>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.first_name} {student.last_name}</TableCell>
              <TableCell>
                <RadioGroup
                  value={attendanceData[student.id]?.status}
                  onValueChange={(value) => handleStatusChange(student.id, value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="present" id={`present-${student.id}`} />
                    <Label htmlFor={`present-${student.id}`}>Present</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                    <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="late" id={`late-${student.id}`} />
                    <Label htmlFor={`late-${student.id}`}>Late</Label>
                  </div>
                </RadioGroup>
              </TableCell>
              <TableCell>
                <Textarea
                  value={attendanceData[student.id]?.remarks || ""}
                  onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                  placeholder="Add remarks..."
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleSubmit} className="mt-4">
        {mutation.isPending ? "Saving..." : "Save Attendance"}
      </Button>
    </div>
  );
}
