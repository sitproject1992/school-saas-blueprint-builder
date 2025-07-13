-- Complete Database Setup for School Management System
-- Run this script in your Supabase SQL Editor to set up the complete database

-- 1. Create missing tables if they don't exist

-- Create school_admins table for better admin management
CREATE TABLE IF NOT EXISTS school_admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator'
    permissions JSONB DEFAULT '{"manage_users": true, "manage_settings": true, "view_reports": true}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(school_id, user_id)
);

-- Create announcements table if it doesn't exist
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id),
    target_audience TEXT[] DEFAULT '{}',
    class_ids UUID[] DEFAULT '{}',
    is_urgent BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create teacher_attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS teacher_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status DEFAULT 'present',
    check_in_time TIME,
    check_out_time TIME,
    marked_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(teacher_id, date)
);

-- Create teacher_subjects table if it doesn't exist
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(teacher_id, subject_id, class_id)
);

-- Create parent_students table if it doesn't exist
CREATE TABLE IF NOT EXISTS parent_students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) DEFAULT 'parent',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(parent_id, student_id)
);

-- Create inventory_movements table if it doesn't exist
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    reason TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Add missing columns to existing tables

-- Add school_id to tables that might not have it
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE lesson_plans ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE syllabus ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE fee_structures ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE inventory_categories ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- 3. Enable RLS on all tables
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('schema_migrations', 'supabase_migrations')
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;

-- 4. Create comprehensive RLS policies

-- School admins table policies
DROP POLICY IF EXISTS "School admins can manage their school" ON school_admins;
CREATE POLICY "School admins can manage their school" ON school_admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = school_admins.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Announcements table policies
DROP POLICY IF EXISTS "School scoped access" ON announcements;
CREATE POLICY "School scoped access" ON announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = announcements.school_id 
            AND sa.user_id = auth.uid()
        )
    );

-- Teacher attendance table policies
DROP POLICY IF EXISTS "School scoped access" ON teacher_attendance;
CREATE POLICY "School scoped access" ON teacher_attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = (
                SELECT t.school_id FROM teachers t WHERE t.id = teacher_attendance.teacher_id
            )
            AND sa.user_id = auth.uid()
        )
    );

-- Teacher subjects table policies
DROP POLICY IF EXISTS "School scoped access" ON teacher_subjects;
CREATE POLICY "School scoped access" ON teacher_subjects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = (
                SELECT t.school_id FROM teachers t WHERE t.id = teacher_subjects.teacher_id
            )
            AND sa.user_id = auth.uid()
        )
    );

-- Parent students table policies
DROP POLICY IF EXISTS "School scoped access" ON parent_students;
CREATE POLICY "School scoped access" ON parent_students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = (
                SELECT st.school_id FROM students st WHERE st.id = parent_students.student_id
            )
            AND sa.user_id = auth.uid()
        )
    );

-- Inventory movements table policies
DROP POLICY IF EXISTS "School scoped access" ON inventory_movements;
CREATE POLICY "School scoped access" ON inventory_movements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa 
            WHERE sa.school_id = (
                SELECT ii.school_id FROM inventory_items ii WHERE ii.id = inventory_movements.item_id
            )
            AND sa.user_id = auth.uid()
        )
    );

-- 5. Create missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_school_admins_school_id ON school_admins(school_id);
CREATE INDEX IF NOT EXISTS idx_school_admins_user_id ON school_admins(user_id);

CREATE INDEX IF NOT EXISTS idx_announcements_school_id ON announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at);

CREATE INDEX IF NOT EXISTS idx_teacher_attendance_teacher_id ON teacher_attendance(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_date ON teacher_attendance(date);

CREATE INDEX IF NOT EXISTS idx_teacher_subjects_teacher_id ON teacher_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_subject_id ON teacher_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_class_id ON teacher_subjects(class_id);

CREATE INDEX IF NOT EXISTS idx_parent_students_parent_id ON parent_students(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_students_student_id ON parent_students(student_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON inventory_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);

-- 6. Create helper functions
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

-- 7. Create triggers for automatic updates
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

-- 8. Insert default data for new schools
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

-- 9. Create trigger to automatically create default data for new schools
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

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 11. Create view for school dashboard data
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

-- 12. Update existing data to have school_id where missing
UPDATE attendance SET school_id = (SELECT school_id FROM students WHERE students.id = attendance.student_id) WHERE school_id IS NULL;
UPDATE lesson_plans SET school_id = (SELECT school_id FROM classes WHERE classes.id = lesson_plans.class_id) WHERE school_id IS NULL;
UPDATE syllabus SET school_id = (SELECT school_id FROM classes WHERE classes.id = syllabus.class_id) WHERE school_id IS NULL;
UPDATE fee_structures SET school_id = (SELECT school_id FROM classes WHERE classes.id = fee_structures.class_id) WHERE school_id IS NULL;
UPDATE fee_payments SET school_id = (SELECT school_id FROM students WHERE students.id = fee_payments.student_id) WHERE school_id IS NULL;
UPDATE inventory_categories SET school_id = (SELECT id FROM schools WHERE subdomain = 'demo') WHERE school_id IS NULL;
UPDATE inventory_items SET school_id = (SELECT id FROM schools WHERE subdomain = 'demo') WHERE school_id IS NULL;

-- 13. Insert default roles if they don't exist
INSERT INTO roles (name, description) VALUES
('super_admin', 'Super Administrator'),
('school_admin', 'School Administrator'),
('teacher', 'Teacher'),
('student', 'Student'),
('parent', 'Parent'),
('accountant', 'Accountant'),
('inventory_manager', 'Inventory Manager')
ON CONFLICT (name) DO NOTHING;

-- 14. Create demo school if it doesn't exist
INSERT INTO schools (
    name, 
    subdomain, 
    address, 
    email,
    phone,
    subscription_status
) VALUES (
    'Demo School',
    'demo',
    '123 Education Street, Mumbai, Maharashtra - 400001',
    'admin@demoschool.edu',
    '+91-9876543210',
    'active'
) ON CONFLICT (subdomain) DO NOTHING;

-- Update existing data to belong to demo school
DO $$
DECLARE
    demo_school_id UUID;
BEGIN
    SELECT id INTO demo_school_id FROM schools WHERE subdomain = 'demo';
    
    IF demo_school_id IS NOT NULL THEN
        UPDATE teachers SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE classes SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE students SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE attendance SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE subjects SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE lesson_plans SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE fee_structures SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE fee_payments SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE syllabus SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE inventory_categories SET school_id = demo_school_id WHERE school_id IS NULL;
        UPDATE inventory_items SET school_id = demo_school_id WHERE school_id IS NULL;
    END IF;
END $$;