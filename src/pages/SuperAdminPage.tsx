import { useAuth } from "@/hooks/useAuth";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { Navigate } from "react-router-dom";

export function SuperAdminPage() {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not super admin
  if (!user || user.profile?.role !== "super_admin") {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminDashboard />
    </div>
  );
}
