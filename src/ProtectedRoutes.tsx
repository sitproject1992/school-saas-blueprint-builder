import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./App";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/Students";
import ClassesPage from "./pages/Classes";
import TeachersPage from "./pages/Teachers";
import AttendancePage from "./pages/Attendance";
import FeeStructures from "./pages/FeeStructures";
import Invoices from "./pages/Invoices";
import Syllabus from "./pages/Syllabus";
import LessonPlans from "./pages/LessonPlans";
import SubjectsPage from "./pages/Subjects";
import Inventory from "./pages/Inventory";
import SettingsPage from "./pages/Settings";
import SchoolsPage from "./pages/Schools";
import UsersPage from "./pages/Users";
import ParentPortal from "./pages/ParentPortal";
import TestsPage from "./pages/Tests";
import PaymentsPage from "./pages/Payments";
import AnnouncementsPage from "./pages/Announcements";
import ChatPage from "./pages/Chat";
import EventsPage from "./pages/Events";
import ReportsPage from "./pages/Reports";
import StatisticsPage from "./pages/Statistics";
import AdminDashboard from "./pages/AdminDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import MessagesPage from "./pages/Messages";
import PayrollPage from "./pages/Payroll";
import AdminSetupPage from "./pages/AdminSetup";
import ExamsPage from "./pages/Exams";

export function ProtectedRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/lesson-plans" element={<LessonPlans />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/fees" element={<FeeStructures />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/schools" element={<SchoolsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/parent-portal" element={<ParentPortal />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/school-dashboard" element={<SchoolDashboard />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/admin-setup" element={<AdminSetupPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </AppLayout>
  );
}
