import { useParentData } from "@/hooks/useParentData";
import { StudentInfo } from "@/components/parent-portal/StudentInfo";

type Student = any; // Simplified type to match the actual data structure

export default function ParentPortal() {
  const { data: students, isLoading, error } = useParentData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Parent Portal</h1>
      <div className="space-y-4">
        {students?.map((student: Student) => (
          <StudentInfo key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
