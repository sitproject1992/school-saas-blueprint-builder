-- ====================================
-- FIX RLS POLICIES FOR CUSTOM AUTH
-- ====================================

-- Drop existing policies that depend on auth.jwt()
DROP POLICY IF EXISTS "Super admins can access all schools" ON public.schools;
DROP POLICY IF EXISTS "Super admins can access all school admin accounts" ON public.school_admin_accounts;
DROP POLICY IF EXISTS "School-specific access for profiles" ON public.profiles;
DROP POLICY IF EXISTS "School-specific access for classes" ON public.classes;
DROP POLICY IF EXISTS "School-specific access for academic years" ON public.academic_years;
DROP POLICY IF EXISTS "School-specific access for subjects" ON public.subjects;
DROP POLICY IF EXISTS "School-specific access for students" ON public.students;
DROP POLICY IF EXISTS "School-specific access for teachers" ON public.teachers;

-- Create new policies that allow access when super admin exists
-- These policies are more permissive since we handle authorization in the application layer

-- Allow all operations on schools table (super admin handles authorization in app)
CREATE POLICY "Allow all access to schools" ON public.schools
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow all operations on school admin accounts
CREATE POLICY "Allow all access to school admin accounts" ON public.school_admin_accounts
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow all operations on profiles
CREATE POLICY "Allow all access to profiles" ON public.profiles
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow all operations on classes
CREATE POLICY "Allow all access to classes" ON public.classes
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow all operations on academic years
CREATE POLICY "Allow all access to academic years" ON public.academic_years
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow all operations on subjects
CREATE POLICY "Allow all access to subjects" ON public.subjects
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow all operations on students
CREATE POLICY "Allow all access to students" ON public.students
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Allow all operations on teachers
CREATE POLICY "Allow all access to teachers" ON public.teachers
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Keep super_admins table policy as is
-- (it doesn't interfere with school operations)

-- Note: In a production environment, you might want to implement
-- more sophisticated RLS policies that work with your custom authentication.
-- For now, we rely on application-level authorization checks.
