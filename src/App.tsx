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

function AppLayout({ children }: { children: React.ReactNode }) {
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <StudentsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TeachersPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ClassesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SubjectsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AttendancePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/syllabus"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Syllabus />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lesson-plans"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <LessonPlans />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Exams Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fees"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <FeeStructures />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Invoices />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Payments Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Inventory Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Announcements Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Reports Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schools"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Schools Management Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Users Management Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent-portal"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ParentPortal />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Settings Module - Coming Soon</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
