import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  // In a real application, you would have a more robust way to determine the user's role.
  // For now, we'll use a simple logic based on the email address.
  const getRole = () => {
    if (user?.email?.includes('admin')) {
      return 'admin';
    } else if (user?.email?.includes('teacher')) {
      return 'teacher';
    } else if (user?.email?.includes('student')) {
      return 'student';
    } else {
      return 'parent';
    }
  };

  const role = getRole();

  return (
    <div>
      {role === 'admin' && <AdminDashboard />}
      {role === 'teacher' && <TeacherDashboard />}
      {role === 'student' && <StudentDashboard />}
      {role === 'parent' && <ParentDashboard />}
    </div>
  );
}
