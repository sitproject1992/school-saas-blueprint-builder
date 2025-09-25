-- Fix student and parent relationships
-- Create parents table
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL,
    school_id UUID NOT NULL,
    occupation TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on parents table
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- Create policy for parents
CREATE POLICY "Allow all access to parents" 
ON public.parents 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add parent fields to students table for better tracking
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_phone TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_email TEXT;

-- Update the student creation function to not require user_id
CREATE OR REPLACE FUNCTION public.create_student_with_profile(
    p_school_id uuid, 
    p_class_id uuid, 
    p_first_name text, 
    p_last_name text, 
    p_email text, 
    p_date_of_birth text, 
    p_admission_number text,
    p_parent_name text DEFAULT NULL,
    p_parent_phone text DEFAULT NULL,
    p_parent_email text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_profile_id uuid;
    v_student_id uuid;
    v_dob date;
BEGIN
    -- Convert date string to date
    BEGIN
        v_dob := p_date_of_birth::date;
    EXCEPTION WHEN OTHERS THEN
        v_dob := NULL;
    END;

    -- Create a profile for the student (WITHOUT user_id)
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

    -- Create the student record with parent info
    INSERT INTO public.students (
        school_id,
        class_id,
        profile_id,
        admission_number,
        parent_name,
        parent_phone,
        parent_email
    ) VALUES (
        p_school_id,
        p_class_id,
        v_profile_id,
        p_admission_number,
        p_parent_name,
        p_parent_phone,
        p_parent_email
    ) RETURNING id INTO v_student_id;

    RETURN v_student_id;
END;
$$;

-- Create function to create parent and link to student
CREATE OR REPLACE FUNCTION public.create_parent_with_profile(
    p_school_id uuid,
    p_first_name text,
    p_last_name text,
    p_email text,
    p_phone text DEFAULT NULL,
    p_occupation text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql  
SECURITY DEFINER
AS $$
DECLARE
    v_profile_id uuid;
    v_parent_id uuid;
BEGIN
    -- Create profile for parent (WITHOUT user_id)
    INSERT INTO public.profiles (
        school_id,
        first_name,
        last_name,
        email,
        phone,
        role,
        user_role
    ) VALUES (
        p_school_id,
        p_first_name,
        p_last_name,
        p_email,
        p_phone,
        'parent',
        'parent'
    ) RETURNING id INTO v_profile_id;

    -- Create parent record
    INSERT INTO public.parents (
        profile_id,
        school_id,
        occupation
    ) VALUES (
        v_profile_id,
        p_school_id,
        p_occupation
    ) RETURNING id INTO v_parent_id;

    RETURN v_parent_id;
END;
$$;

-- Create function to link parent to student
CREATE OR REPLACE FUNCTION public.link_parent_to_student(
    p_parent_id uuid,
    p_student_id uuid,
    p_relationship text DEFAULT 'parent'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.parent_students (parent_id, student_id, relationship)
    VALUES (p_parent_id, p_student_id, p_relationship)
    ON CONFLICT (parent_id, student_id) DO UPDATE SET
        relationship = p_relationship,
        created_at = now();
END;
$$;