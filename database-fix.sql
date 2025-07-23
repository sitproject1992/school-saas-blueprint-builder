-- Database Fix Script for Authentication Issues
-- This script fixes the "Database error querying schema" authentication error

-- 1. Fix profiles table structure and constraints
DO $$
BEGIN
    -- Ensure the profiles table has the correct structure
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE profiles ADD COLUMN email VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'date_of_birth') THEN
        ALTER TABLE profiles ADD COLUMN date_of_birth DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address') THEN
        ALTER TABLE profiles ADD COLUMN address TEXT;
    END IF;
    
    -- Check if user_role enum type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'inventory_manager');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_role') THEN
        ALTER TABLE profiles ADD COLUMN user_role user_role DEFAULT 'student';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error modifying profiles table structure: %', SQLERRM;
END $$;

-- 2. Ensure super_admins table exists
CREATE TABLE IF NOT EXISTS super_admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create missing functions
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM super_admins sa
        JOIN profiles p ON p.user_id = sa.user_id
        WHERE p.user_id = auth.uid()
        AND sa.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create default school data function
CREATE OR REPLACE FUNCTION create_default_school_data(school_id UUID)
RETURNS VOID AS $$
DECLARE
    subject_names TEXT[] := ARRAY['Mathematics', 'English', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'Physical Education', 'Art'];
    subject_name TEXT;
    class_name TEXT;
    grade INTEGER;
    section TEXT;
BEGIN
    -- Create default subjects if they don't exist
    FOREACH subject_name IN ARRAY subject_names
    LOOP
        INSERT INTO subjects (school_id, name, description)
        VALUES (school_id, subject_name, 'Default ' || subject_name || ' subject')
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- Create default classes if they don't exist
    FOR grade IN 1..12
    LOOP
        FOR section IN SELECT unnest(ARRAY['A', 'B'])
        LOOP
            class_name := 'Grade ' || grade || ' ' || section;
            INSERT INTO classes (school_id, name, grade_level, section, capacity)
            VALUES (school_id, class_name, grade, section, 30)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Default school data created for school: %', school_id;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error creating default school data: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Fix RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create more permissive policies to allow authentication
CREATE POLICY "Allow authenticated users to view profiles" ON profiles
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            auth.uid() = id OR
            EXISTS (
                SELECT 1 FROM profiles p 
                WHERE p.user_id = auth.uid() 
                AND p.user_role IN ('super_admin', 'school_admin')
            )
        )
    );

CREATE POLICY "Allow authenticated users to insert their own profile" ON profiles
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            auth.uid() = id
        )
    );

CREATE POLICY "Allow authenticated users to update profiles" ON profiles
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            auth.uid() = id OR
            EXISTS (
                SELECT 1 FROM profiles p 
                WHERE p.user_id = auth.uid() 
                AND p.user_role IN ('super_admin', 'school_admin')
            )
        )
    );

-- 6. Create or update the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, user_id, first_name, last_name, email, user_role)
    VALUES (
        NEW.id,
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'user_role')::user_role, 'student')
    )
    ON CONFLICT (id) DO UPDATE SET
        user_id = NEW.id,
        email = NEW.email,
        updated_at = NOW()
    ON CONFLICT (user_id) DO UPDATE SET
        email = NEW.email,
        updated_at = NOW();
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Create subjects table if it doesn't exist
CREATE TABLE IF NOT EXISTS subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(school_id, name)
);

-- Enable RLS on subjects
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for subjects
CREATE POLICY "School members can view subjects" ON subjects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.school_id = subjects.school_id
        )
    );

-- 8. Update updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT SELECT ON TABLE profiles TO anon;
GRANT ALL ON TABLE subjects TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION create_default_school_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;

-- 10. Ensure school_admin_accounts table can be queried
ALTER TABLE school_admin_accounts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access to school_admin_accounts for authentication
CREATE POLICY "Allow anonymous access for authentication" ON school_admin_accounts
    FOR SELECT TO anon USING (is_active = true);

-- Allow authenticated users to see school admin accounts
CREATE POLICY "Allow authenticated access to school_admin_accounts" ON school_admin_accounts
    FOR SELECT TO authenticated USING (true);

COMMIT;
