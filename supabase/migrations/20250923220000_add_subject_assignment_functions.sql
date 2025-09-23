-- Function to create a new subject and assign it to a teacher and class
CREATE OR REPLACE FUNCTION create_subject_and_assign_teacher(
    p_name TEXT,
    p_code TEXT,
    p_description TEXT,
    p_school_id UUID,
    p_class_id UUID,
    p_teacher_id UUID
)
RETURNS subjects AS $$
DECLARE
    v_subject subjects;
BEGIN
    -- Create the new subject
    INSERT INTO subjects (name, code, description, school_id)
    VALUES (p_name, p_code, p_description, p_school_id)
    RETURNING * INTO v_subject;

    -- Assign the subject to the teacher and class, if provided
    IF p_teacher_id IS NOT NULL AND p_class_id IS NOT NULL THEN
        INSERT INTO teacher_subjects (teacher_id, subject_id, class_id)
        VALUES (p_teacher_id, v_subject.id, p_class_id);
    END IF;

    RETURN v_subject;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update the assignment of a subject to a teacher and class
CREATE OR REPLACE FUNCTION update_subject_assignment(
    p_subject_id UUID,
    p_class_id UUID,
    p_teacher_id UUID
)
RETURNS VOID AS $$
DECLARE
    v_current_class_id UUID;
    v_current_teacher_id UUID;
    v_final_class_id UUID;
    v_final_teacher_id UUID;
BEGIN
    -- Get the current assignment
    SELECT class_id, teacher_id
    INTO v_current_class_id, v_current_teacher_id
    FROM teacher_subjects
    WHERE subject_id = p_subject_id
    LIMIT 1;

    -- Determine the final values, using new values if provided, otherwise keeping the old ones
    v_final_class_id := COALESCE(p_class_id, v_current_class_id);
    v_final_teacher_id := COALESCE(p_teacher_id, v_current_teacher_id);

    -- Remove any existing assignments for this subject to enforce a single assignment
    DELETE FROM teacher_subjects WHERE subject_id = p_subject_id;

    -- Add the new/updated assignment if both class and teacher are set
    IF v_final_teacher_id IS NOT NULL AND v_final_class_id IS NOT NULL THEN
        INSERT INTO teacher_subjects (teacher_id, subject_id, class_id)
        VALUES (v_final_teacher_id, p_subject_id, v_final_class_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION create_subject_and_assign_teacher(TEXT, TEXT, TEXT, UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_subject_assignment(UUID, UUID, UUID) TO authenticated;
