import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from './useSchool';

export interface AttendanceRecord {
  id: string;
  school_id: string;
  student_id: string;
  class_id: string;
  attendance_date: string;
  status: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceInput {
  student_id: string;
  class_id: string;
  attendance_date: string;
  status: string;
  remarks?: string;
}

export const useAttendance = (classId?: string, date?: string) => {
  const { schoolId } = useSchool();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: attendanceRecords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['attendance', schoolId, classId, date],
    queryFn: async () => {
      if (!schoolId) return [];
      
      let query = supabase
        .from('attendance')
        .select('*')
        .eq('school_id', schoolId);

      if (classId) {
        query = query.eq('class_id', classId);
      }

      if (date) {
        query = query.eq('attendance_date', date);
      }

      const { data, error } = await query.order('attendance_date', { ascending: false });

      if (error) throw error;
      return data as AttendanceRecord[];
    },
    enabled: !!schoolId,
  });

  const markAttendance = useMutation({
    mutationFn: async (attendanceData: AttendanceInput[]) => {
      if (!schoolId) throw new Error('No active school selected');

      // Delete existing records for this class and date
      if (attendanceData.length > 0) {
        const { class_id, attendance_date } = attendanceData[0];
        await supabase
          .from('attendance')
          .delete()
          .eq('school_id', schoolId)
          .eq('class_id', class_id)
          .eq('attendance_date', attendance_date);

        // Insert new records
        const records = attendanceData.map(record => ({
          ...record,
          school_id: schoolId,
        }));

        const { data, error } = await supabase
          .from('attendance')
          .insert(records)
          .select();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Success',
        description: 'Attendance marked successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark attendance',
        variant: 'destructive',
      });
    },
  });

  const updateAttendance = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AttendanceInput> }) => {
      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Success',
        description: 'Attendance updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update attendance',
        variant: 'destructive',
      });
    },
  });

  return {
    attendanceRecords,
    isLoading,
    error,
    markAttendance: markAttendance.mutate,
    updateAttendance: updateAttendance.mutate,
    isMarking: markAttendance.isPending,
    isUpdating: updateAttendance.isPending,
  };
};