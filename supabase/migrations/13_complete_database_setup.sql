-- Complete Database Setup for School Management System
-- This migration ensures all tables are properly configured with RLS, indexes, and constraints

-- 1. Ensure all tables have proper RLS policies
DO $$
DECLARE
    table_name text;
BEGIN
    -- Enable RLS on all tables that don't have it
    FOR table_name IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('schema_migrations', 'supabase_migrations')
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;

-- 2. Create comprehensive RLS policies for all tables

-- Profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "School admins can view profiles in their school" ON profiles;
CREATE POLICY "School admins can view profiles in their school" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = profiles.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Teachers table policies
DROP POLICY IF EXISTS "School scoped access" ON teachers;
CREATE POLICY "School scoped access" ON teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = teachers.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Students table policies
DROP POLICY IF EXISTS "School scoped access" ON students;
CREATE POLICY "School scoped access" ON students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = students.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Classes table policies
DROP POLICY IF EXISTS "School scoped access" ON classes;
CREATE POLICY "School scoped access" ON classes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = classes.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Subjects table policies
DROP POLICY IF EXISTS "School scoped access" ON subjects;
CREATE POLICY "School scoped access" ON subjects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = subjects.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Attendance table policies
DROP POLICY IF EXISTS "School scoped access" ON attendance;
CREATE POLICY "School scoped access" ON attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = attendance.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Fee structures table policies
DROP POLICY IF EXISTS "School scoped access" ON fee_structures;
CREATE POLICY "School scoped access" ON fee_structures
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = fee_structures.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Fee payments table policies
DROP POLICY IF EXISTS "School scoped access" ON fee_payments;
CREATE POLICY "School scoped access" ON fee_payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = fee_payments.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Lesson plans table policies
DROP POLICY IF EXISTS "School scoped access" ON lesson_plans;
CREATE POLICY "School scoped access" ON lesson_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = lesson_plans.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Syllabus table policies
DROP POLICY IF EXISTS "School scoped access" ON syllabus;
CREATE POLICY "School scoped access" ON syllabus
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = syllabus.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Inventory tables policies
DROP POLICY IF EXISTS "School scoped access" ON inventory_categories;
CREATE POLICY "School scoped access" ON inventory_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = inventory_categories.school_id 
            AND sa.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "School scoped access" ON inventory_items;
CREATE POLICY "School scoped access" ON inventory_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = inventory_items.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- 3. Create missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_teachers_profile_id ON teachers(profile_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);

CREATE INDEX IF NOT EXISTS idx_students_profile_id ON students(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON students(admission_number);

CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade_level ON classes(grade_level);

CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);

CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_school_id ON attendance(school_id);

CREATE INDEX IF NOT EXISTS idx_fee_structures_school_id ON fee_structures(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_class_id ON fee_structures(class_id);

CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_fee_structure_id ON fee_payments(fee_structure_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_school_id ON fee_payments(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_status ON fee_payments(status);

CREATE INDEX IF NOT EXISTS idx_lesson_plans_teacher_id ON lesson_plans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_class_id ON lesson_plans(class_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_subject_id ON lesson_plans(subject_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_planned_date ON lesson_plans(planned_date);

CREATE INDEX IF NOT EXISTS idx_syllabus_school_id ON syllabus(school_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_class_id ON syllabus(class_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_subject_id ON syllabus(subject_id);

CREATE INDEX IF NOT EXISTS idx_inventory_categories_school_id ON inventory_categories(school_id);

CREATE INDEX IF NOT EXISTS idx_inventory_items_school_id ON inventory_items(school_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category_id ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);

-- 4. Create helper functions for role and school management
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM profiles
    WHERE user_id = auth.uid();
    
    RETURN COALESCE(user_role_val, 'student'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
DECLARE
    school_id_val UUID;
BEGIN
    SELECT school_id INTO school_id_val
    FROM profiles
    WHERE user_id = auth.uid();
    
    RETURN school_id_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables that don't have them
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('schema_migrations', 'supabase_migrations', 'roles', 'user_roles')
    LOOP
        -- Check if trigger already exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'update_' || table_name || '_updated_at'
        ) THEN
            EXECUTE format('
                CREATE TRIGGER update_%I_updated_at 
                BEFORE UPDATE ON %I 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
            ', table_name, table_name);
        END IF;
    END LOOP;
END $$;

-- 6. Insert default data for new schools
CREATE OR REPLACE FUNCTION create_default_school_data(school_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Create default subjects
    INSERT INTO subjects (name, code, description, school_id) VALUES
    ('Mathematics', 'MATH', 'Core mathematics curriculum', school_id),
    ('English', 'ENG', 'English language and literature', school_id),
    ('Science', 'SCI', 'General science', school_id),
    ('Social Studies', 'SOC', 'History, geography, and civics', school_id),
    ('Hindi', 'HIN', 'Hindi language', school_id),
    ('Computer Science', 'CS', 'Computer and technology', school_id),
    ('Physical Education', 'PE', 'Physical education and sports', school_id),
    ('Art', 'ART', 'Creative arts and crafts', school_id);

    -- Create default classes (Grades 1-12)
    INSERT INTO classes (name, grade_level, section, capacity, school_id) VALUES
    ('Class 1A', 1, 'A', 30, school_id),
    ('Class 1B', 1, 'B', 30, school_id),
    ('Class 2A', 2, 'A', 30, school_id),
    ('Class 2B', 2, 'B', 30, school_id),
    ('Class 3A', 3, 'A', 30, school_id),
    ('Class 3B', 3, 'B', 30, school_id),
    ('Class 4A', 4, 'A', 30, school_id),
    ('Class 4B', 4, 'B', 30, school_id),
    ('Class 5A', 5, 'A', 30, school_id),
    ('Class 5B', 5, 'B', 30, school_id),
    ('Class 6A', 6, 'A', 35, school_id),
    ('Class 6B', 6, 'B', 35, school_id),
    ('Class 7A', 7, 'A', 35, school_id),
    ('Class 7B', 7, 'B', 35, school_id),
    ('Class 8A', 8, 'A', 35, school_id),
    ('Class 8B', 8, 'B', 35, school_id),
    ('Class 9A', 9, 'A', 40, school_id),
    ('Class 9B', 9, 'B', 40, school_id),
    ('Class 10A', 10, 'A', 40, school_id),
    ('Class 10B', 10, 'B', 40, school_id),
    ('Class 11A', 11, 'A', 40, school_id),
    ('Class 11B', 11, 'B', 40, school_id),
    ('Class 12A', 12, 'A', 40, school_id),
    ('Class 12B', 12, 'B', 40, school_id);

    -- Create default fee structures
    INSERT INTO fee_structures (name, amount, frequency, school_id) VALUES
    ('Tuition Fee', 5000, 'monthly', school_id),
    ('Transport Fee', 2000, 'monthly', school_id),
    ('Library Fee', 500, 'yearly', school_id),
    ('Laboratory Fee', 1000, 'yearly', school_id),
    ('Sports Fee', 800, 'yearly', school_id),
    ('Computer Fee', 1200, 'yearly', school_id);

    -- Create default inventory categories
    INSERT INTO inventory_categories (name, description, school_id) VALUES
    ('Stationery', 'Pens, pencils, notebooks, etc.', school_id),
    ('Electronics', 'Computers, projectors, etc.', school_id),
    ('Sports Equipment', 'Balls, nets, etc.', school_id),
    ('Laboratory Equipment', 'Science lab equipment', school_id),
    ('Furniture', 'Desks, chairs, tables', school_id),
    ('Books', 'Textbooks and reference books', school_id);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger to automatically create default data for new schools
CREATE OR REPLACE FUNCTION trigger_create_default_school_data()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_school_data(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_default_school_data_trigger ON schools;
CREATE TRIGGER create_default_school_data_trigger
    AFTER INSERT ON schools
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_default_school_data();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 9. Create view for school dashboard data
CREATE OR REPLACE VIEW school_dashboard_data AS
SELECT 
    s.id as school_id,
    s.name as school_name,
    COUNT(DISTINCT st.id) as total_students,
    COUNT(DISTINCT t.id) as total_teachers,
    COUNT(DISTINCT c.id) as total_classes,
    COUNT(DISTINCT sub.id) as total_subjects,
    COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.id END) as present_today,
    COUNT(DISTINCT CASE WHEN a.status = 'absent' THEN a.id END) as absent_today,
    COUNT(DISTINCT CASE WHEN fs.is_active = true THEN fs.id END) as active_fee_structures,
    COUNT(DISTINCT CASE WHEN fp.status = 'pending' THEN fp.id END) as pending_payments
FROM schools s
LEFT JOIN students st ON st.school_id = s.id
LEFT JOIN teachers t ON t.school_id = s.id
LEFT JOIN classes c ON c.school_id = s.id
LEFT JOIN subjects sub ON sub.school_id = s.id
LEFT JOIN attendance a ON a.school_id = s.id AND a.date = CURRENT_DATE
LEFT JOIN fee_structures fs ON fs.school_id = s.id
LEFT JOIN fee_payments fp ON fp.school_id = s.id
GROUP BY s.id, s.name;

-- Grant access to the view
GRANT SELECT ON school_dashboard_data TO anon, authenticated;