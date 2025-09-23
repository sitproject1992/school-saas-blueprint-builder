-- SKOOLER DATABASE SCHEMA FIXES
-- This script fixes the school admin authentication and database schema issues

-- ==========================================
-- 1. MISSING ENUM TYPES
-- ==========================================

-- Create missing enum types
DO $$
BEGIN
    -- Check and create user_role enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'super_admin',
            'school_admin',
            'teacher',
            'student',
            'parent',
            'accountant',
            'inventory_manager'
        );
    END IF;

    -- Check and create attendance_status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
    END IF;

    -- Check and create subscription_status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial', 'past_due');
    END IF;

    -- Check and create fee_status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fee_status') THEN
        CREATE TYPE fee_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
    END IF;

    -- Check and create exam_type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_type') THEN
        CREATE TYPE exam_type AS ENUM ('monthly', 'quarterly', 'half_yearly', 'annual', 'mock');
    END IF;
END $$;

-- ==========================================
-- 2. MISSING TABLES
-- ==========================================

-- Create super_admins table if missing
CREATE TABLE IF NOT EXISTS super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password_history table for school admin password management
CREATE TABLE IF NOT EXISTS password_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_admin_account_id UUID REFERENCES school_admin_accounts(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. MISSING FUNCTIONS
-- ==========================================

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM super_admins sa
        WHERE sa.email = 'sujan1nepal@gmail.com'
        AND sa.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to hash passwords (simple implementation - should use bcrypt in production)
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Simple hash for development - use proper bcrypt in production
    RETURN encode(digest(password || 'skooler_salt_2024', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify passwords
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN hash_password(password) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create school admin account
DROP FUNCTION IF EXISTS create_school_admin_account(uuid, text, text, text, text, text);
CREATE OR REPLACE FUNCTION create_school_admin_account(
    p_school_id UUID,
    p_email TEXT,
    p_password TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_account_id UUID;
    v_password_hash TEXT;
BEGIN
    -- Hash the password
    v_password_hash := hash_password(p_password);

    -- Create the account
    INSERT INTO school_admin_accounts (
        school_id,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        is_active,
        must_change_password,
        created_at,
        updated_at,
        password_changed_at
    ) VALUES (
        p_school_id,
        LOWER(p_email),
        v_password_hash,
        p_first_name,
        p_last_name,
        p_phone,
        true,
        false, -- Set to false for new registrations
        NOW(),
        NOW(),
        NOW()
    ) RETURNING id INTO v_account_id;

    -- Log the password in history
    INSERT INTO password_history (school_admin_account_id, password_hash)
    VALUES (v_account_id, v_password_hash);

    RETURN v_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate school admin
DROP FUNCTION IF EXISTS authenticate_school_admin(text, text);
CREATE OR REPLACE FUNCTION authenticate_school_admin(
    p_email TEXT,
    p_password TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_account school_admin_accounts%ROWTYPE;
    v_school_name TEXT;
    v_password_hash TEXT;
BEGIN
    -- Hash the provided password
    v_password_hash := hash_password(p_password);

    -- Get account details
    SELECT * INTO v_account
    FROM school_admin_accounts
    WHERE email = LOWER(p_email)
    AND is_active = TRUE;

    -- If account found, get school name
    IF v_account.id IS NOT NULL THEN
        SELECT name INTO v_school_name
        FROM schools
        WHERE id = v_account.school_id;
    END IF;

    -- Check if account exists
    IF v_account.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Account not found');
    END IF;

    -- Check if account is locked
    IF v_account.locked_until IS NOT NULL AND v_account.locked_until > NOW() THEN
        RETURN jsonb_build_object('success', false, 'message', 'Account is temporarily locked');
    END IF;

    -- Verify password
    IF v_account.password_hash != v_password_hash THEN
        -- Increment login attempts
        UPDATE school_admin_accounts
        SET
            login_attempts = login_attempts + 1,
            locked_until = CASE
                WHEN login_attempts + 1 >= 5 THEN NOW() + INTERVAL '30 minutes'
                ELSE NULL
            END,
            updated_at = NOW()
        WHERE id = v_account.id;

        RETURN jsonb_build_object('success', false, 'message', 'Invalid password');
    END IF;

    -- Reset login attempts and update last login
    UPDATE school_admin_accounts
    SET
        login_attempts = 0,
        locked_until = NULL,
        last_login = NOW(),
        updated_at = NOW()
    WHERE id = v_account.id;

    -- Return success with user details
    RETURN jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'id', v_account.id,
            'email', v_account.email,
            'first_name', v_account.first_name,
            'last_name', v_account.last_name,
            'school_id', v_account.school_id,
            'school_name', v_school_name,
            'phone', v_account.phone,
            'must_change_password', v_account.must_change_password,
            'role', 'school_admin'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create default school data
CREATE OR REPLACE FUNCTION create_default_school_data(p_school_id UUID)
RETURNS VOID AS $$
DECLARE
    subject_names TEXT[] := ARRAY['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education', 'Art'];
    subject_name TEXT;
    grade INTEGER;
    section TEXT;
BEGIN
    -- Create default subjects
    FOREACH subject_name IN ARRAY subject_names
    LOOP
        INSERT INTO subjects (school_id, name, code, description, created_at, updated_at)
        VALUES (
            p_school_id,
            subject_name,
            UPPER(LEFT(subject_name, 3)),
            'Default ' || subject_name || ' subject',
            NOW(),
            NOW()
        )
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Create default classes (Grade 1-12, sections A & B)
    FOR grade IN 1..12 LOOP
        FOR section IN SELECT unnest(ARRAY['A', 'B']) LOOP
            INSERT INTO classes (school_id, name, section, grade_level, capacity, created_at, updated_at)
            VALUES (
                p_school_id,
                'Grade ' || grade || ' ' || section,
                section,
                grade,
                30,
                NOW(),
                NOW()
            )
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

    -- Create default fee structures
    INSERT INTO fee_structures (school_id, name, amount, frequency, due_date, is_active, created_at, updated_at)
    VALUES
        (p_school_id, 'Tuition Fee', 5000, 'monthly', 5, true, NOW(), NOW()),
        (p_school_id, 'Transport Fee', 1500, 'monthly', 5, true, NOW(), NOW()),
        (p_school_id, 'Library Fee', 500, 'monthly', 5, true, NOW(), NOW()),
        (p_school_id, 'Sports Fee', 800, 'monthly', 5, true, NOW(), NOW()),
        (p_school_id, 'Lab Fee', 1200, 'monthly', 5, true, NOW(), NOW()),
        (p_school_id, 'Development Fee', 2000, 'annual', 15, true, NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- Create default inventory categories
    INSERT INTO inventory_categories (school_id, name, description, created_at)
    VALUES
        (p_school_id, 'Stationery', 'Office and classroom stationery items', NOW()),
        (p_school_id, 'Electronics', 'Electronic equipment and devices', NOW()),
        (p_school_id, 'Furniture', 'School furniture and fixtures', NOW()),
        (p_school_id, 'Sports Equipment', 'Sports and physical education equipment', NOW()),
        (p_school_id, 'Books', 'Textbooks and library books', NOW()),
        (p_school_id, 'Laboratory', 'Science laboratory equipment and supplies', NOW())
    ON CONFLICT DO NOTHING;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. UPDATE EXISTING TABLES
-- ==========================================

-- Fix profiles table structure
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_role') THEN
        ALTER TABLE profiles ADD COLUMN user_role user_role DEFAULT 'student';
    END IF;
END $$;

-- Update school_admin_accounts to use proper constraints
ALTER TABLE school_admin_accounts
    DROP CONSTRAINT IF EXISTS school_admin_accounts_email_check,
    ADD CONSTRAINT school_admin_accounts_email_check
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ==========================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ==========================================

-- Enable RLS on all relevant tables
ALTER TABLE school_admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- Policies for school_admin_accounts
DROP POLICY IF EXISTS "School admins can access their own accounts" ON school_admin_accounts;
CREATE POLICY "School admins can access their own accounts" ON school_admin_accounts
    FOR ALL USING (
        email = current_setting('request.jwt.claims', true)::json->>'email'
        OR EXISTS (
            SELECT 1 FROM super_admins
            WHERE email = 'sujan1nepal@gmail.com' AND is_active = true
        )
    );

-- Allow anonymous access for authentication
DROP POLICY IF EXISTS "Allow anonymous access for authentication" ON school_admin_accounts;
CREATE POLICY "Allow anonymous access for authentication" ON school_admin_accounts
    FOR SELECT TO anon USING (is_active = true);

-- Policies for a password_history
DROP POLICY IF EXISTS "Password history access" ON password_history;
CREATE POLICY "Password history access" ON password_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admin_accounts saa
            WHERE saa.id = password_history.school_admin_account_id
            AND (
                saa.email = current_setting('request.jwt.claims', true)::json->>'email'
                OR EXISTS (
                    SELECT 1 FROM super_admins
                    WHERE email = 'sujan1nepal@gmail.com' AND is_active = true
                )
            )
        )
    );

-- ==========================================
-- 6. GRANT PERMISSIONS
-- ==========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON school_admin_accounts TO authenticated;
GRANT SELECT ON school_admin_accounts TO anon;
GRANT ALL ON password_history TO authenticated;
GRANT ALL ON super_admins TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION is_super_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_school_admin_account(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION authenticate_school_admin(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_default_school_data(UUID) TO authenticated;

-- ==========================================
-- 7. CREATE SUPER ADMIN ENTRY
-- ==========================================

-- Ensure super admin exists
INSERT INTO super_admins (email, is_active, created_at, updated_at)
VALUES ('sujan1nepal@gmail.com', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    is_active = true,
    updated_at = NOW();

-- ==========================================
-- 8. TRIGGER FOR AUTOMATIC SCHOOL DATA CREATION
-- ==========================================

-- Function to trigger default data creation
CREATE OR REPLACE FUNCTION trigger_create_default_school_data()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_school_data(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS create_default_school_data_trigger ON schools;
CREATE TRIGGER create_default_school_data_trigger
    AFTER INSERT ON schools
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_default_school_data();

-- ==========================================
-- 9. UPDATE PROFILES TABLE CONSTRAINTS
-- ==========================================

-- Make user_id nullable in profiles to support school admin accounts that don't use auth.users
ALTER TABLE profiles ALTER COLUMN user_id DROP NOT NULL;

-- ==========================================
-- 10. NEW FUNCTION FOR STUDENT CREATION
-- ==========================================

CREATE OR REPLACE FUNCTION create_student_with_profile(
    p_school_id uuid,
    p_class_id uuid,
    p_first_name text,
    p_last_name text,
    p_email text,
    p_date_of_birth text,
    p_admission_number text
)
RETURNS uuid AS $$
DECLARE
    v_profile_id uuid;
    v_student_id uuid;
    v_dob date;
BEGIN
    -- Ensure date_of_birth is a valid date or NULL
    BEGIN
        v_dob := p_date_of_birth::date;
    EXCEPTION WHEN OTHERS THEN
        v_dob := NULL;
    END;

    -- Create a profile for the student
    INSERT INTO public.profiles (
        school_id,
        first_name,
        last_name,
        email,
        date_of_birth,
        role,
        user_role
    ) VALUES (
        p_school_id,
        p_first_name,
        p_last_name,
        p_email,
        v_dob,
        'student',
        'student'
    ) RETURNING id INTO v_profile_id;

    -- Create the student record
    INSERT INTO public.students (
        school_id,
        class_id,
        profile_id,
        admission_number
    ) VALUES (
        p_school_id,
        p_class_id,
        v_profile_id,
        p_admission_number
    ) RETURNING id INTO v_student_id;

    RETURN v_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the new function
GRANT EXECUTE ON FUNCTION create_student_with_profile(uuid, uuid, text, text, text, text, text) TO authenticated;


-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Test the authentication function
-- SELECT authenticate_school_admin('test@example.com', 'password123');

-- Test school admin creation
-- SELECT create_school_admin_account(
--     (SELECT id FROM schools LIMIT 1),
--     'newadmin@school.com',
--     'securepassword',
--     'John',
--     'Doe',
--     '+1234567890'
-- );

COMMIT;
