CREATE POLICY "Users can manage teacher_subjects in their school"
ON public.teacher_subjects
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.subjects s
    WHERE s.id = teacher_subjects.subject_id AND s.school_id = get_my_school_id()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.subjects s
    WHERE s.id = teacher_subjects.subject_id AND s.school_id = get_my_school_id()
  )
);
