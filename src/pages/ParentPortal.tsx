import { useParentData } from "@/hooks/useParentData";
import { StudentInfo } from "@/components/parent-portal/StudentInfo";

export default function ParentPortal() {
  const { data: students, isLoading, error } = useParentData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Parent Portal</h1>
      <div className="space-y-4">
        {students?.map((student) => (
          <StudentInfo key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
