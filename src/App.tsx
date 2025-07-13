import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { AuthPage } from "@/components/auth/AuthPage.tsx";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/Students";
import ClassesPage from "./pages/Classes";
import TeachersPage from "./pages/Teachers";
import AttendancePage from "./pages/Attendance";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ParentPortal from "./pages/ParentPortal";
import FeeStructures from "./pages/FeeStructures";
import Invoices from "./pages/Invoices";
import Syllabus from "./pages/Syllabus";
import LessonPlans from "./pages/LessonPlans";
import SubjectsPage from "./pages/Subjects";
import Inventory from "./pages/Inventory";
import SchoolRegistration from "./pages/SchoolRegistration";
import AdminSetup from "./pages/AdminSetup";
import TeacherRegistration from "./pages/TeacherRegistration";
import StudentRegistration from "./pages/StudentRegistration";
import RegistrationComplete from "./pages/RegistrationComplete";
import SettingsPage from "./pages/Settings";
import SchoolsPage from "./pages/Schools";
import UsersPage from "./pages/Users";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

import { SchoolProvider } from "@/hooks/useSchool";
import { ProtectedRoutes } from "./ProtectedRoutes";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SchoolProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/school-registration" element={<SchoolRegistration />} />
              <Route path="/setup-admin" element={<AdminSetup />} />
              <Route path="/teacher-registration" element={<TeacherRegistration />} />
              <Route path="/student-registration" element={<StudentRegistration />} />
              <Route path="/registration-complete" element={<RegistrationComplete />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <ProtectedRoutes />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SchoolProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
