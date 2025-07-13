import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { mockStudents, mockTeachers, mockClasses } from "@/lib/mockData";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  attendanceRate: number;
  pendingFees: number;
  recentActivities: any[];
}

interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  attendanceRate: number;
  pendingLessonPlans: number;
  upcomingExams: number;
  recentActivities: any[];
}

interface StudentStats {
  attendanceRate: number;
  upcomingExams: number;
  pendingAssignments: number;
  overallGrade: string;
  recentActivities: any[];
}

interface ParentStats {
  children: any[];
  totalAttendance: number;
  pendingFees: number;
  upcomingEvents: number;
  recentActivities: any[];
}

// Mock data generators
const generateMockActivities = (type: string) => [
  { id: 1, action: "New student enrolled", time: "2 hours ago", type: "success" },
  { id: 2, action: "Assignment submitted", time: "4 hours ago", type: "info" },
  { id: 3, action: "Payment received", time: "6 hours ago", type: "success" },
  { id: 4, action: "Class scheduled", time: "8 hours ago", type: "info" },
  { id: 5, action: "Teacher on leave", time: "1 day ago", type: "warning" }
];

export function useAdminDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['admin-dashboard', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        totalStudents: mockStudents.length,
        totalTeachers: mockTeachers.length,
        totalClasses: mockClasses.length,
        totalRevenue: 452310,
        attendanceRate: 92.5,
        pendingFees: 45000,
        recentActivities: generateMockActivities('admin')
      };
    },
    enabled: !!user?.id,
  });
}

export function useTeacherDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['teacher-dashboard', user?.id],
    queryFn: async (): Promise<TeacherStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        totalClasses: mockClasses.length,
        totalStudents: mockStudents.length,
        attendanceRate: 89.2,
        pendingLessonPlans: 3,
        upcomingExams: 2,
        recentActivities: generateMockActivities('teacher')
      };
    },
    enabled: !!user?.id,
  });
}

export function useStudentDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-dashboard', user?.id],
    queryFn: async (): Promise<StudentStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        attendanceRate: 94.5,
        upcomingExams: 3,
        pendingAssignments: 5,
        overallGrade: "A-",
        recentActivities: generateMockActivities('student')
      };
    },
    enabled: !!user?.id,
  });
}

export function useParentDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['parent-dashboard', user?.id],
    queryFn: async (): Promise<ParentStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        children: [
          {
            id: 1,
            name: "John Doe",
            class: "Grade 8A",
            attendance: 95.2,
            grade: "A"
          },
          {
            id: 2,
            name: "Jane Doe",
            class: "Grade 6B",
            attendance: 92.8,
            grade: "B+"
          }
        ],
        totalAttendance: 94.0,
        pendingFees: 12000,
        upcomingEvents: 4,
        recentActivities: generateMockActivities('parent')
      };
    },
    enabled: !!user?.id,
  });
}