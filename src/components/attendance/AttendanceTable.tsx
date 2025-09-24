import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';

interface AttendanceTableProps {
  classId: string;
  date: string;
}

export function AttendanceTable({ classId, date }: AttendanceTableProps) {
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; remarks: string }>>({});
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { attendanceRecords, markAttendance, isMarking } = useAttendance(classId, date);

  // Filter students by class
  const classStudents = students.filter(student => student.class_id === classId);

  // Initialize attendance data with existing records
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      const data: Record<string, { status: string; remarks: string }> = {};
      attendanceRecords.forEach(record => {
        data[record.student_id] = {
          status: record.status,
          remarks: record.remarks || ''
        };
      });
      setAttendanceData(data);
    }
  }, [attendanceRecords]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status, remarks: prev[studentId]?.remarks || '' },
    }));
  };

  const handleNotesChange = (studentId: string, remarks: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks, status: prev[studentId]?.status || 'present' },
    }));
  };

  const handleSubmit = () => {
    const attendanceArray = Object.entries(attendanceData).map(([studentId, data]) => ({
      student_id: studentId,
      class_id: classId,
      attendance_date: date,
      status: data.status,
      remarks: data.remarks,
    }));

    markAttendance(attendanceArray);
  };

  if (studentsLoading) {
    return <div>Loading students...</div>;
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'default',
      absent: 'destructive',
      late: 'secondary',
      excused: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attendance for {date}</h3>
        <Button onClick={handleSubmit} disabled={isMarking}>
          {isMarking ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>

      {classStudents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No students found in this class.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  {student.admission_number || 'N/A'}
                </TableCell>
                <TableCell>
                  <RadioGroup
                    value={attendanceData[student.id]?.status || "present"}
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
                    value={attendanceData[student.id]?.remarks || ""}
                    onChange={(e) => handleNotesChange(student.id, e.target.value)}
                    placeholder="Add remarks..."
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}