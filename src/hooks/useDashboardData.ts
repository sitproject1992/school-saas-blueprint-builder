import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

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

export function useAdminDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['admin-dashboard', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get user's school ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.school_id) throw new Error('School not found');

      // Fetch dashboard data in parallel
      const [
        studentsResult,
        teachersResult,
        classesResult,
        revenueResult,
        attendanceResult,
        pendingFeesResult,
        activitiesResult
      ] = await Promise.all([
        // Total students
        supabase
          .from('students')
          .select('id', { count: 'exact' })
          .eq('school_id', profile.school_id),
        
        // Total teachers
        supabase
          .from('teachers')
          .select('id', { count: 'exact' })
          .eq('school_id', profile.school_id),
        
        // Total classes
        supabase
          .from('classes')
          .select('id', { count: 'exact' })
          .eq('school_id', profile.school_id),
        
        // Total revenue (sum of paid fees)
        supabase
          .from('fee_payments')
          .select('amount')
          .eq('status', 'paid')
          .gte('paid_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        // Attendance rate (last 30 days)
        supabase
          .from('attendance')
          .select('status')
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        
        // Pending fees
        supabase
          .from('fee_payments')
          .select('amount')
          .eq('status', 'pending'),
        
        // Recent activities (announcements, recent enrollments, etc.)
        supabase
          .from('announcements')
          .select('*')
          .eq('school_id', profile.school_id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const totalStudents = studentsResult.count || 0;
      const totalTeachers = teachersResult.count || 0;
      const totalClasses = classesResult.count || 0;
      const totalRevenue = revenueResult.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const pendingFees = pendingFeesResult.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
      // Calculate attendance rate
      const attendanceData = attendanceResult.data || [];
      const presentCount = attendanceData.filter(a => a.status === 'present').length;
      const attendanceRate = attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0;

      return {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalRevenue,
        attendanceRate,
        pendingFees,
        recentActivities: activitiesResult.data || []
      };
    },
    enabled: !!user?.id
  });
}

export function useTeacherDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['teacher-dashboard', user?.id],
    queryFn: async (): Promise<TeacherStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get teacher ID from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('user_id', user.id)
        .single();

      const { data: teacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('profile_id', profile?.id)
        .single();

      if (!teacher?.id) throw new Error('Teacher not found');

      // Fetch teacher-specific data
      const [
        classesResult,
        studentsResult,
        attendanceResult,
        lessonPlansResult,
        examsResult
      ] = await Promise.all([
        // Classes taught by this teacher
        supabase
          .from('teacher_subjects')
          .select('class_id', { count: 'exact' })
          .eq('teacher_id', teacher.id),
        
        // Students in teacher's classes
        supabase
          .from('teacher_subjects')
          .select('class_id')
          .eq('teacher_id', teacher.id)
          .then(async (result) => {
            if (result.data && result.data.length > 0) {
              const classIds = result.data.map(ts => ts.class_id);
              return supabase
                .from('students')
                .select('id', { count: 'exact' })
                .in('class_id', classIds);
            }
            return { count: 0 };
          }),
        
        // Attendance for teacher's classes
        supabase
          .from('attendance')
          .select('status')
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        
        // Pending lesson plans
        supabase
          .from('lesson_plans')
          .select('id', { count: 'exact' })
          .eq('teacher_id', teacher.id)
          .eq('is_completed', false),
        
        // Upcoming exams
        supabase
          .from('exams')
          .select('id', { count: 'exact' })
          .gte('start_date', new Date().toISOString().split('T')[0])
      ]);

      const totalClasses = classesResult.count || 0;
      const totalStudents = studentsResult.count || 0;
      const pendingLessonPlans = lessonPlansResult.count || 0;
      const upcomingExams = examsResult.count || 0;
      
      const attendanceData = attendanceResult.data || [];
      const presentCount = attendanceData.filter(a => a.status === 'present').length;
      const attendanceRate = attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0;

      return {
        totalClasses,
        totalStudents,
        attendanceRate,
        pendingLessonPlans,
        upcomingExams,
        recentActivities: []
      };
    },
    enabled: !!user?.id
  });
}

export function useStudentDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-dashboard', user?.id],
    queryFn: async (): Promise<StudentStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get student ID from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('student_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.student_id) throw new Error('Student not found');

      // Fetch student-specific data
      const [
        attendanceResult,
        examsResult,
        gradesResult
      ] = await Promise.all([
        // Student attendance
        supabase
          .from('attendance')
          .select('status')
          .eq('student_id', profile.student_id)
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        
        // Upcoming exams
        supabase
          .from('exams')
          .select('id', { count: 'exact' })
          .gte('start_date', new Date().toISOString().split('T')[0]),
        
        // Recent grades
        supabase
          .from('exam_results')
          .select('grade, marks_obtained, max_marks')
          .eq('student_id', profile.student_id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const attendanceData = attendanceResult.data || [];
      const presentCount = attendanceData.filter(a => a.status === 'present').length;
      const attendanceRate = attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0;

      const upcomingExams = examsResult.count || 0;
      
      // Calculate overall grade
      const grades = gradesResult.data || [];
      const averageScore = grades.length > 0 
        ? grades.reduce((sum, g) => sum + (g.marks_obtained || 0) / (g.max_marks || 1), 0) / grades.length * 100
        : 0;
      
      const overallGrade = averageScore >= 90 ? 'A+' : 
                          averageScore >= 80 ? 'A' :
                          averageScore >= 70 ? 'B' :
                          averageScore >= 60 ? 'C' : 'D';

      return {
        attendanceRate,
        upcomingExams,
        pendingAssignments: 0, // TODO: Implement assignments
        overallGrade,
        recentActivities: []
      };
    },
    enabled: !!user?.id
  });
}

export function useParentDashboardData() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['parent-dashboard', user?.id],
    queryFn: async (): Promise<ParentStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get parent's children
      const { data: parentStudents } = await supabase
        .from('parent_students')
        .select(`
          student_id,
          students (
            id,
            admission_number,
            profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('parent_id', user.id);

      const children = parentStudents?.map(ps => ps.students) || [];
      const studentIds = children.map(c => c.id);

      if (studentIds.length === 0) {
        return {
          children: [],
          totalAttendance: 0,
          pendingFees: 0,
          upcomingEvents: 0,
          recentActivities: []
        };
      }

      // Fetch data for all children
      const [
        attendanceResult,
        feesResult,
        eventsResult
      ] = await Promise.all([
        // Attendance for all children
        supabase
          .from('attendance')
          .select('status')
          .in('student_id', studentIds)
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        
        // Pending fees for all children
        supabase
          .from('fee_payments')
          .select('amount')
          .in('student_id', studentIds)
          .eq('status', 'pending'),
        
        // Upcoming events/exams
        supabase
          .from('exams')
          .select('id', { count: 'exact' })
          .gte('start_date', new Date().toISOString().split('T')[0])
      ]);

      const attendanceData = attendanceResult.data || [];
      const presentCount = attendanceData.filter(a => a.status === 'present').length;
      const totalAttendance = attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0;

      const pendingFees = feesResult.data?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
      const upcomingEvents = eventsResult.count || 0;

      return {
        children,
        totalAttendance,
        pendingFees,
        upcomingEvents,
        recentActivities: []
      };
    },
    enabled: !!user?.id
  });
}