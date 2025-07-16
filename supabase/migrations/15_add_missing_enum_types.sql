-- Create the user_role enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'school_admin', 
        'teacher',
        'student',
        'parent',
        'accountant',
        'inventory_manager'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Also create other enum types that might be missing
DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM (
        'present',
        'absent', 
        'late',
        'excused'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE exam_type AS ENUM (
        'pre_test',
        'post_test',
        'weekly', 
        'monthly',
        'major',
        'final'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fee_status AS ENUM (
        'pending',
        'paid',
        'overdue', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM (
        'active',
        'inactive',
        'suspended',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table to ensure it has the correct user_role column
DO $$ BEGIN
    -- Add user_role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_role') THEN
        ALTER TABLE profiles ADD COLUMN user_role user_role DEFAULT 'student';
    END IF;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Ensure the handle_new_user function exists and works correctly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email, user_role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'user_role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
