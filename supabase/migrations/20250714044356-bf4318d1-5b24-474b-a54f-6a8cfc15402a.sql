-- Create school_admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.school_admins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{"manage_users": true, "view_reports": true, "manage_settings": true}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on school_admins
ALTER TABLE public.school_admins ENABLE ROW LEVEL SECURITY;

-- Create policies for school_admins
CREATE POLICY "School admins can manage their school" ON school_admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            WHERE sa.school_id = school_admins.school_id
            AND sa.user_id = auth.uid()
        )
    );

-- Create trigger to automatically create school_admin record when school admin profile is created
CREATE OR REPLACE FUNCTION public.handle_school_admin_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only create school_admin record if the profile has school_admin role
    IF NEW.role = 'school_admin' AND NEW.school_id IS NOT NULL THEN
        INSERT INTO public.school_admins (user_id, school_id, role, is_active)
        VALUES (NEW.user_id, NEW.school_id, 'admin', true)
        ON CONFLICT (user_id, school_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger for profiles table
DROP TRIGGER IF EXISTS on_profile_created_school_admin ON public.profiles;
CREATE TRIGGER on_profile_created_school_admin
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_school_admin_profile();

-- Add unique constraint to prevent duplicate school admins
CREATE UNIQUE INDEX IF NOT EXISTS idx_school_admins_user_school 
ON public.school_admins(user_id, school_id);

-- Create function to automatically create default school data when school is created
CREATE OR REPLACE FUNCTION public.trigger_create_default_school_data()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM create_default_school_data(NEW.id);
    RETURN NEW;
END;
$$;

-- Create trigger to automatically create default data when school is created
DROP TRIGGER IF EXISTS on_school_created ON public.schools;
CREATE TRIGGER on_school_created
    AFTER INSERT ON public.schools
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_create_default_school_data();