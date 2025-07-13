-- Drop existing RLS policies for schools
DROP POLICY IF EXISTS "Users can view their own school" ON schools;
DROP POLICY IF EXISTS "School admins can update their school" ON schools;

-- Create a new policy that allows public access to the schools table
CREATE POLICY "Public can view all schools" ON schools
    FOR SELECT USING (true);

-- Create a new policy that allows authenticated users to insert new schools
CREATE POLICY "Authenticated users can create schools" ON schools
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Recreate the policy for school admins to update their school
CREATE POLICY "School admins can update their school" ON schools
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            WHERE sa.school_id = schools.id
            AND sa.user_id = auth.uid()
            AND sa.is_active = true
        )
    );
