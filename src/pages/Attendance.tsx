import { AttendanceTable } from "@/components/attendance/AttendanceTable";

export default function Attendance() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Attendance</h1>
      <AttendanceTable />
    </div>
  );
}
