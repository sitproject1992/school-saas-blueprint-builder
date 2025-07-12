import { useState } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import { useClasses } from "@/hooks/useClasses";
import { useStudents } from "@/hooks/useStudents";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AttendanceTable() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { classes } = useClasses();
  const { students } = useStudents(selectedClass);
  const { attendance, upsertAttendance } = useAttendance(
    selectedClass!,
    selectedDate
  );

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    if (!selectedClass) return;

    const record = {
      student_id: studentId,
      class_id: selectedClass,
      date: selectedDate,
      status: status,
    };

    upsertAttendance([record]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/3">
          <Label>Select Class</Label>
          <Select onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/3">
          <Label>Select Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {selectedClass && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student) => {
              const attendanceRecord = attendance?.find(
                (a) => a.student_id === student.id
              );
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    {student.profiles?.first_name} {student.profiles?.last_name}
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      defaultValue={attendanceRecord?.status || "present"}
                      onValueChange={(value) => handleStatusChange(student.id, value as any)}
                      className="flex gap-4"
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
