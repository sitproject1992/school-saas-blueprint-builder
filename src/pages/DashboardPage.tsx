import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      return <div>No role assigned. Please contact an administrator.</div>;
    }

    // For simplicity, we'll just use the first role.
    // In a real application, you might want to allow users to switch roles.
    const role = user.roles[0];

    switch (role) {
      case 'super_admin':
        return <AdminDashboard />;
      case 'school_admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <div>Invalid role.</div>;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
}
