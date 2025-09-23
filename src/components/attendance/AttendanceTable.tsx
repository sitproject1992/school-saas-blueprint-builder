import React, { useState } from 'react';
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

// Mock data since attendance table doesn't exist yet
const mockStudents = [
  { id: '1', profile: { first_name: 'John', last_name: 'Doe' } },
  { id: '2', profile: { first_name: 'Jane', last_name: 'Smith' } },
  { id: '3', profile: { first_name: 'Bob', last_name: 'Johnson' } },
];

interface AttendanceTableProps {
  classId: string;
  date: string;
}

export function AttendanceTable({ classId, date }: AttendanceTableProps) {
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; notes: string }>>({});

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
    // TODO: Implement when attendance table is created
    console.log('Saving attendance:', attendanceData);
  };

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
        <Button onClick={handleSubmit}>Save Attendance</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStudents.map((student) => (
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
    </div>
  );
}