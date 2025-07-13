import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const getParentData = async (userId: string) => {
  // First, get the parent's profile
  const { data: parentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!parentProfile) throw new Error("Parent profile not found.");

  // Then, get the students linked to this parent
  const { data: parentStudents, error: parentStudentsError } = await supabase
    .from("parent_students")
    .select("student_id")
    .eq("parent_id", parentProfile.id);

  if (parentStudentsError) throw new Error(parentStudentsError.message);

  const studentIds = parentStudents.map((ps) => ps.student_id);

  // Finally, get the full student data, including their class, profile, attendance, exam results, invoices, syllabus and lesson plans
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select(
      `
      *,
      profiles (*),
      classes (
        name,
        syllabus (
          *,
          subjects (name)
        ),
        lesson_plans (
          *,
          subjects (name)
        )
      ),
      attendance (date, status),
      exam_results (
        grade,
        marks_obtained,
        max_marks,
        subjects (name)
      ),
      invoices (
        *,
        fee_structures (*)
      )
    `
    )
    .in("id", studentIds);

  if (studentsError) throw new Error(studentsError.message);

  return students;
};

export const useParentData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["parentData", user?.id],
    queryFn: () => getParentData(user!.id),
    enabled: !!user,
  });
};
