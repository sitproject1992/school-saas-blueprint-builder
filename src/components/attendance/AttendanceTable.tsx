import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
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
import { useState, useEffect } from "react";

type Student = Tables<'students'> & {
  profile: Tables<'profiles'>;
};

interface AttendanceTableProps {
  classId: string;
  date: string;
}

const fetchStudentsForClass = async (classId: string) => {
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq("class_id", classId);
  if (error) throw new Error(error.message);
  return data as Student[];
};

const fetchAttendance = async (classId: string, date: string) => {
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
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; notes: string }>>({});

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", classId],
    queryFn: () => fetchStudentsForClass(classId),
    enabled: !!classId,
  });

  const { data: initialAttendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["attendance", classId, date],
    queryFn: () => fetchAttendance(classId, date),
    enabled: !!classId && !!date,
  });

  // Update attendance data when initial data loads
  useEffect(() => {
    if (initialAttendance) {
      const initialData = initialAttendance.reduce((acc, record) => {
        acc[record.student_id] = { 
          status: record.status, 
          notes: record.notes || "" 
        };
        return acc;
      }, {} as Record<string, { status: string; notes: string }>);
      setAttendanceData(initialData);
    }
  }, [initialAttendance]);

  const mutation = useMutation({
    mutationFn: async (newData: Record<string, { status: string; notes: string }>) => {
      const recordsToUpsert = Object.keys(newData).map((studentId) => ({
        student_id: studentId,
        class_id: classId,
        date,
        status: newData[studentId].status as "present" | "absent" | "late" | "excused",
        notes: newData[studentId].notes,
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

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes },
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
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                {student.profile.first_name} {student.profile.last_name}
              </TableCell>
              <TableCell>
                <RadioGroup
                  value={attendanceData[student.id]?.status || ""}
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excused" id={`excused-${student.id}`} />
                    <Label htmlFor={`excused-${student.id}`}>Excused</Label>
                  </div>
                </RadioGroup>
              </TableCell>
              <TableCell>
                <Textarea
                  value={attendanceData[student.id]?.notes || ""}
                  onChange={(e) => handleNotesChange(student.id, e.target.value)}
                  placeholder="Add notes..."
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleSubmit} className="mt-4" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save Attendance"}
      </Button>
    </div>
  );
}
