-- ====================================
-- COMPLETE DATABASE RESET SCRIPT
-- FOR SCHOOL MANAGEMENT SYSTEM
-- ====================================
-- This script completely resets the database and creates a fresh start
-- Only super admin functionality will work initially

-- Step 1: Drop all existing tables and dependencies
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Step 2: Create essential ENUM types
CREATE TYPE public.user_role AS ENUM (
    'super_admin',
    'school_admin', 
    'teacher',
    'student',
    'parent'
);

CREATE TYPE public.attendance_status AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);

CREATE TYPE public.subscription_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'expired'
);

CREATE TYPE public.fee_status AS ENUM (
    'pending',
    'paid',
    'overdue',
    'cancelled'
);

CREATE TYPE public.exam_type AS ENUM (
    'mid_term',
    'final',
    'quiz',
    'assignment',
    'project'
);

-- Step 3: Create essential tables in correct order

-- Super Admin Table (highest priority)
CREATE TABLE public.super_admins (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    email text NOT NULL UNIQUE,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT super_admins_pkey PRIMARY KEY (id),
    CONSTRAINT super_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Schools Table
CREATE TABLE public.schools (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    subdomain text NOT NULL UNIQUE,
    logo_url text,
    theme_color text DEFAULT '#3B82F6'::text,
    address text,
    phone text,
    email text,
    website text,
    subscription_status subscription_status DEFAULT 'active'::subscription_status,
    subscription_expires_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT schools_pkey PRIMARY KEY (id)
);

-- School Admin Accounts Table
CREATE TABLE public.school_admin_accounts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    email text NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
    password_hash text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text,
    is_active boolean NOT NULL DEFAULT true,
    must_change_password boolean NOT NULL DEFAULT true,
    login_attempts integer NOT NULL DEFAULT 0,
    locked_until timestamp with time zone,
    last_login timestamp with time zone,
    password_changed_at timestamp with time zone NOT NULL DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT school_admin_accounts_pkey PRIMARY KEY (id),
    CONSTRAINT school_admin_accounts_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE
);

-- Profiles Table
CREATE TABLE public.profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE,
    school_id uuid,
    role user_role NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text,
    avatar_url text,
    date_of_birth date,
    address text,
    employee_id text,
    student_id text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    user_role user_role DEFAULT 'student'::user_role,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT profiles_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE
);

-- Classes Table
CREATE TABLE public.classes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    name text NOT NULL,
    section text,
    grade_level integer,
    capacity integer DEFAULT 30,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT classes_pkey PRIMARY KEY (id),
    CONSTRAINT classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE
);

-- Academic Years Table
CREATE TABLE public.academic_years (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    name character varying NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_active boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT academic_years_pkey PRIMARY KEY (id),
    CONSTRAINT academic_years_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE
);

-- Subjects Table
CREATE TABLE public.subjects (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    name text NOT NULL,
    code text,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT subjects_pkey PRIMARY KEY (id),
    CONSTRAINT subjects_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE
);

-- Students Table
CREATE TABLE public.students (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL,
    school_id uuid NOT NULL,
    class_id uuid,
    admission_number text NOT NULL,
    admission_date date,
    blood_group text,
    medical_conditions text,
    emergency_contact_name text,
    emergency_contact_phone text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT students_pkey PRIMARY KEY (id),
    CONSTRAINT students_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT students_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE,
    CONSTRAINT students_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL
);

-- Teachers Table
CREATE TABLE public.teachers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL,
    school_id uuid NOT NULL,
    qualification text,
    experience_years integer DEFAULT 0,
    joining_date date,
    salary numeric,
    is_class_teacher boolean DEFAULT false,
    class_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT teachers_pkey PRIMARY KEY (id),
    CONSTRAINT teachers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT teachers_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE,
    CONSTRAINT teachers_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL
);

-- Step 4: Insert essential data

-- Insert the super admin record
INSERT INTO public.super_admins (email, is_active, created_at, updated_at)
VALUES ('sujan1nepal@gmail.com', true, now(), now())
ON CONFLICT (email) DO UPDATE SET 
    is_active = true,
    updated_at = now();

-- Step 5: Create essential RPC functions

-- School Admin Authentication Function (Corrected)
CREATE OR REPLACE FUNCTION public.authenticate_school_admin(
    p_email text,
    p_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_account_id uuid;
    v_email text;
    v_password_hash text;
    v_first_name text;
    v_last_name text;
    v_phone text;
    v_school_id uuid;
    v_is_active boolean;
    v_login_attempts integer;
    v_locked_until timestamp with time zone;
    v_must_change_password boolean;
    v_school_name text;
BEGIN
    -- Get school admin account details
    SELECT 
        id, email, password_hash, first_name, last_name, phone, 
        school_id, is_active, login_attempts, locked_until, must_change_password
    INTO 
        v_account_id, v_email, v_password_hash, v_first_name, v_last_name, 
        v_phone, v_school_id, v_is_active, v_login_attempts, v_locked_until, v_must_change_password
    FROM public.school_admin_accounts 
    WHERE email = p_email;

    -- Check if account exists
    IF v_account_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Account not found'
        );
    END IF;

    -- Check if account is active
    IF NOT v_is_active THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Account is disabled'
        );
    END IF;

    -- Check if account is locked
    IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Account is temporarily locked'
        );
    END IF;

    -- Verify password (simple comparison for now)
    IF v_password_hash != p_password THEN
        -- Increment login attempts
        UPDATE public.school_admin_accounts 
        SET login_attempts = login_attempts + 1,
            locked_until = CASE 
                WHEN login_attempts >= 4 THEN now() + interval '30 minutes'
                ELSE NULL 
            END
        WHERE id = v_account_id;

        RETURN jsonb_build_object(
            'success', false,
            'message', 'Invalid password'
        );
    END IF;

    -- Get school name
    SELECT name INTO v_school_name 
    FROM public.schools 
    WHERE id = v_school_id;

    -- Reset login attempts and update last login
    UPDATE public.school_admin_accounts 
    SET login_attempts = 0,
        locked_until = NULL,
        last_login = now()
    WHERE id = v_account_id;

    -- Return successful authentication
    RETURN jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'id', v_account_id,
            'email', v_email,
            'first_name', v_first_name,
            'last_name', v_last_name,
            'phone', v_phone,
            'school_id', v_school_id,
            'school_name', v_school_name,
            'must_change_password', v_must_change_password
        )
    );
END;
$$;

-- Create School Admin Account Function
CREATE OR REPLACE FUNCTION public.create_school_admin_account(
    p_school_id uuid,
    p_email text,
    p_password text,
    p_first_name text,
    p_last_name text,
    p_phone text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_admin_id uuid;
BEGIN
    -- Check if school exists
    IF NOT EXISTS (SELECT 1 FROM public.schools WHERE id = p_school_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'School not found'
        );
    END IF;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM public.school_admin_accounts WHERE email = p_email) THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Email already exists'
        );
    END IF;

    -- Insert new school admin account
    INSERT INTO public.school_admin_accounts (
        school_id,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        is_active,
        must_change_password
    ) VALUES (
        p_school_id,
        p_email,
        p_password, -- Simple storage for now
        p_first_name,
        p_last_name,
        p_phone,
        true,
        true
    ) RETURNING id INTO v_admin_id;

    RETURN jsonb_build_object(
        'success', true,
        'admin_id', v_admin_id,
        'message', 'School admin account created successfully'
    );
END;
$$;

-- Step 6: Set up Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Super Admins can access everything
CREATE POLICY "Super admins can access everything" ON public.super_admins
    FOR ALL USING (true);

CREATE POLICY "Super admins can access all schools" ON public.schools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

CREATE POLICY "Super admins can access all school admin accounts" ON public.school_admin_accounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

-- School-specific access for other tables
CREATE POLICY "School-specific access for profiles" ON public.profiles
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.school_admin_accounts 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

CREATE POLICY "School-specific access for classes" ON public.classes
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.school_admin_accounts 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

CREATE POLICY "School-specific access for academic years" ON public.academic_years
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.school_admin_accounts 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

CREATE POLICY "School-specific access for subjects" ON public.subjects
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.school_admin_accounts 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

CREATE POLICY "School-specific access for students" ON public.students
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.school_admin_accounts 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

CREATE POLICY "School-specific access for teachers" ON public.teachers
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.school_admin_accounts 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
        OR
        EXISTS (
            SELECT 1 FROM public.super_admins 
            WHERE email = auth.jwt() ->> 'email' AND is_active = true
        )
    );

-- Step 7: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ====================================
-- SCRIPT COMPLETE
-- ====================================
-- The database has been completely reset and configured.
-- Only super admin (sujan1nepal@gmail.com/precioussn) will work initially.
-- Schools and school admins can be created through the application.
