-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'inventory_manager');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial', 'past_due');

-- Create schools table
CREATE TABLE schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    logo_url TEXT,
    theme JSONB,
    subscription_status subscription_status DEFAULT 'trial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profiles table to store user-specific data
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create school_admins table
CREATE TABLE school_admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"manage_users": true, "manage_settings": true, "view_reports": true}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(school_id, user_id)
);

-- Create teachers table
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    date_of_birth DATE,
    hire_date DATE,
    contract_details TEXT,
    leave_balance JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create classes table
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    grade_level INTEGER,
    section VARCHAR(50),
    capacity INTEGER,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create students table
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    date_of_birth DATE,
    digital_id_card_url TEXT,
    health_records JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create parent_students table
CREATE TABLE parent_students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) DEFAULT 'parent',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(parent_id, student_id)
);

-- Create attendance table
CREATE TABLE attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status DEFAULT 'present',
    marked_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(student_id, date)
);

-- Create teacher_attendance table
CREATE TABLE teacher_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status DEFAULT 'present',
    check_in_time TIME,
    check_out_time TIME,
    marked_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(teacher_id, date)
);

-- Create subjects table
CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create teacher_subjects table
CREATE TABLE teacher_subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(teacher_id, subject_id, class_id)
);

-- Create syllabus table
CREATE TABLE syllabus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create lesson_plans table
CREATE TABLE lesson_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    topic VARCHAR(255) NOT NULL,
    planned_activities TEXT,
    actual_coverage TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create fee_structures table
CREATE TABLE fee_structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    frequency VARCHAR(50), -- e.g., 'monthly', 'quarterly', 'yearly'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create fee_payments table
CREATE TABLE fee_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'paid', -- 'paid', 'pending', 'overdue'
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create inventory_categories table
CREATE TABLE inventory_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create inventory_items table
CREATE TABLE inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES inventory_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    maintenance_logs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create inventory_movements table
CREATE TABLE inventory_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    reason TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create announcements table
CREATE TABLE announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    target_audience TEXT[] DEFAULT '{}',
    class_ids UUID[] DEFAULT '{}',
    is_urgent BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create payroll table
CREATE TABLE payroll (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    salary_month DATE NOT NULL,
    base_salary NUMERIC(10, 2) NOT NULL,
    deductions NUMERIC(10, 2),
    bonuses NUMERIC(10, 2),
    net_salary NUMERIC(10, 2) NOT NULL,
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tests table
CREATE TABLE tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    max_marks INTEGER,
    test_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create test_results table
CREATE TABLE test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained INTEGER,
    grade VARCHAR(10),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on all tables
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

-- RLS Policies
-- Schools: Publicly visible
CREATE POLICY "Schools are viewable by everyone." ON schools FOR SELECT USING (true);

-- Profiles: Users can only see their own profile, school admins can see profiles in their school
CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "School admins can view profiles in their school." ON profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM school_admins sa
        WHERE sa.school_id = profiles.school_id AND sa.user_id = auth.uid()
    )
);

-- School Admins: Only school admins of the same school can view/manage
CREATE POLICY "School admins can manage their school." ON school_admins FOR ALL USING (
    EXISTS (
        SELECT 1 FROM school_admins sa
        WHERE sa.school_id = school_admins.school_id AND sa.user_id = auth.uid()
    )
);

-- Function to get the user's school ID
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID AS $$
DECLARE
    school_id_val UUID;
BEGIN
    SELECT school_id INTO school_id_val FROM profiles WHERE user_id = auth.uid();
    RETURN school_id_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- General RLS policy for most tables
CREATE OR REPLACE FUNCTION create_school_rls_policy(table_name TEXT)
RETURNS void AS $$
BEGIN
    EXECUTE format('
        CREATE POLICY "Users can only access data from their own school." ON %I
        FOR ALL USING (school_id = get_my_school_id())
        WITH CHECK (school_id = get_my_school_id());
    ', table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply the general RLS policy to all tables with a school_id column
SELECT create_school_rls_policy(table_name::TEXT)
FROM information_schema.columns
WHERE table_schema = 'public'
AND column_name = 'school_id'
AND table_name NOT IN ('schools', 'profiles', 'school_admins');


-- Create indexes for performance
CREATE INDEX ON profiles (user_id);
CREATE INDEX ON profiles (school_id);
CREATE INDEX ON school_admins (school_id);
CREATE INDEX ON school_admins (user_id);
CREATE INDEX ON teachers (school_id);
CREATE INDEX ON classes (school_id);
CREATE INDEX ON students (school_id);
CREATE INDEX ON students (class_id);
CREATE INDEX ON attendance (school_id);
CREATE INDEX ON attendance (student_id);
CREATE INDEX ON teacher_attendance (school_id);
CREATE INDEX ON teacher_attendance (teacher_id);
CREATE INDEX ON subjects (school_id);
CREATE INDEX ON syllabus (school_id);
CREATE INDEX ON syllabus (class_id);
CREATE INDEX ON lesson_plans (school_id);
CREATE INDEX ON fee_structures (school_id);
CREATE INDEX ON fee_payments (school_id);
CREATE INDEX ON inventory_categories (school_id);
CREATE INDEX ON inventory_items (school_id);
CREATE INDEX ON announcements (school_id);
CREATE INDEX ON payroll (school_id);
CREATE INDEX ON tests (school_id);
CREATE INDEX ON test_results (test_id);
CREATE INDEX ON events (school_id);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename NOT IN ('schema_migrations', 'supabase_migrations')
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        ', table_name, table_name);
    END LOOP;
END $$;

-- Function to create default data for a new school
CREATE OR REPLACE FUNCTION create_default_school_data(school_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Create default subjects
    INSERT INTO subjects (name, code, description, school_id) VALUES
    ('Mathematics', 'MATH', 'Core mathematics curriculum', school_id),
    ('English', 'ENG', 'English language and literature', school_id),
    ('Science', 'SCI', 'General science', school_id);

    -- Create default classes
    INSERT INTO classes (name, grade_level, section, capacity, school_id) VALUES
    ('Class 1A', 1, 'A', 30, school_id),
    ('Class 2A', 2, 'A', 30, school_id);

    -- Create default fee structures
    INSERT INTO fee_structures (name, amount, frequency, school_id) VALUES
    ('Tuition Fee', 5000, 'monthly', school_id),
    ('Transport Fee', 2000, 'monthly', school_id);

    -- Create default inventory categories
    INSERT INTO inventory_categories (name, description, school_id) VALUES
    ('Stationery', 'Pens, pencils, notebooks, etc.', school_id),
    ('Electronics', 'Computers, projectors, etc.', school_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create default data for new schools
CREATE OR REPLACE FUNCTION trigger_create_default_school_data()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_school_data(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_default_school_data_trigger
    AFTER INSERT ON schools
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_default_school_data();

-- Seed a demo school for development
INSERT INTO schools (name, subdomain, address, email, phone, subscription_status)
VALUES ('Demo School', 'demo', '123 Education St', 'demo@school.com', '555-1234', 'active')
ON CONFLICT (subdomain) DO NOTHING;
