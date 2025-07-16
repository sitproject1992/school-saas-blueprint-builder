import { useState } from "react";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { SchoolAdminForm } from "@/components/admin/SchoolAdminForm";
import { useAuth } from "@/hooks/useAuth";
import { useSchoolAdmin } from "@/hooks/useSchoolAdmin";
import { Navigate } from "react-router-dom";

interface SchoolAdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  schoolId: string;
  password: string;
  confirmPassword: string;
  mustChangePassword: boolean;
  sendWelcomeEmail: boolean;
}

export function SuperAdminPage() {
  const { user, loading } = useAuth();
  const {
    schools,
    createSchoolAdmin,
    loading: adminLoading,
  } = useSchoolAdmin();
  const [showAdminForm, setShowAdminForm] = useState(false);

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

  const handleCreateSchoolAdmin = async (data: SchoolAdminFormData) => {
    await createSchoolAdmin({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      schoolId: data.schoolId,
      password: data.password,
      mustChangePassword: data.mustChangePassword,
      sendWelcomeEmail: data.sendWelcomeEmail,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminDashboard />

      <SchoolAdminForm
        open={showAdminForm}
        onOpenChange={setShowAdminForm}
        onSubmit={handleCreateSchoolAdmin}
        schools={schools}
      />
    </div>
  );
}
