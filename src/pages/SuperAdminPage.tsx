import { useState } from "react";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { SchoolAdminForm } from "@/components/admin/SchoolAdminForm";
import { useAuth } from "@/hooks/useAuth";
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
  const [showAdminForm, setShowAdminForm] = useState(false);

  // Mock schools data - in real implementation, this would come from API
  const schools = [
    {
      id: "school-1",
      name: "Green Valley High School",
      subdomain: "greenvalley",
    },
    {
      id: "school-2",
      name: "Bright Future Academy",
      subdomain: "brightfuture",
    },
    { id: "school-3", name: "Sunrise Elementary", subdomain: "sunrise" },
    {
      id: "school-4",
      name: "Ocean View Middle School",
      subdomain: "oceanview",
    },
  ];

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
    // In real implementation, this would call the API
    console.log("Creating school admin:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // This would typically make a call to the Supabase function
    // await supabase.rpc('create_school_admin_account', {
    //   p_school_id: data.schoolId,
    //   p_email: data.email,
    //   p_password: data.password,
    //   p_first_name: data.firstName,
    //   p_last_name: data.lastName,
    //   p_phone: data.phone || null
    // });

    // Show success message and refresh data
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
