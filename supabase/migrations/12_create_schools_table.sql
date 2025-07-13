-- Create schools table for multi-tenancy
CREATE TABLE IF NOT EXISTS schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL, -- for subdomain routing
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    principal_name VARCHAR(255),
    principal_email VARCHAR(255),
    principal_phone VARCHAR(20),
    logo_url TEXT,
    brand_color VARCHAR(7) DEFAULT '#3B82F6', -- hex color code
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    academic_year_start_month INTEGER DEFAULT 4, -- April
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- 'basic', 'standard', 'premium'
    subscription_status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
    subscription_expiry DATE,
    max_students INTEGER DEFAULT 100,
    max_teachers INTEGER DEFAULT 10,
    features JSONB DEFAULT '{"attendance": true, "fees": true, "inventory": false}',
    settings JSONB DEFAULT '{"attendance_marking_time": "09:00", "late_arrival_threshold": 15}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create school_admins table to link users to schools
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

-- Update existing tables to link to schools
-- Add school_id to tables that don't have it yet
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE classes ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE students ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schools_subdomain ON schools(subdomain);
CREATE INDEX IF NOT EXISTS idx_schools_subscription_status ON schools(subscription_status);
CREATE INDEX IF NOT EXISTS idx_school_admins_school_id ON school_admins(school_id);
CREATE INDEX IF NOT EXISTS idx_school_admins_user_id ON school_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_school_id ON attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);

-- Enable RLS
-- RLS is not enabled for this table

-- Create updated_at triggers
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert a default school for existing data
INSERT INTO schools (
    name, 
    subdomain, 
    address, 
    city, 
    state, 
    country,
    phone,
    email,
    principal_name
) VALUES (
    'Demo School',
    'demo',
    '123 Education Street',
    'Mumbai',
    'Maharashtra',
    'India',
    '+91-9876543210',
    'admin@demoschool.edu',
    'Dr. Principal Name'
) ON CONFLICT (subdomain) DO NOTHING;

-- Get the demo school ID and update existing data
DO $$
DECLARE
    demo_school_id UUID;
BEGIN
    SELECT id INTO demo_school_id FROM schools WHERE subdomain = 'demo';
    
    -- Update existing records to belong to demo school
    UPDATE teachers SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE classes SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE students SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE attendance SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE subjects SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE lesson_plans SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE fee_structures SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE fee_payments SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE student_fee_structures SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE syllabus SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE inventory_categories SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE inventory SET school_id = demo_school_id WHERE school_id IS NULL;
    UPDATE inventory_movements SET school_id = demo_school_id WHERE school_id IS NULL;
END $$;
