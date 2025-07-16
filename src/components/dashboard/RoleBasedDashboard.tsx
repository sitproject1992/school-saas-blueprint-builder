import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";

export function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user || !user.profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Dashboard...
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we load your personalized dashboard.
          </p>
        </div>
      </div>
    );
  }

  const userRole = user.profile.role;

  switch (userRole) {
    case "school_admin":
    case "admin":
      return <AdminDashboard />;

    case "teacher":
      return <TeacherDashboard />;

    case "student":
      return <StudentDashboard />;

    case "parent":
      return <ParentDashboard />;

    default:
      // Fallback to admin dashboard for unknown roles
      console.warn(
        `Unknown user role: ${userRole}, defaulting to admin dashboard`,
      );
      return <AdminDashboard />;
  }
}
