-- Allow authenticated users to create schools
CREATE POLICY "Allow authenticated users to create schools" ON schools
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow school admins to manage their own school
CREATE POLICY "Allow school admins to manage their own school" ON schools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            WHERE sa.school_id = schools.id
            AND sa.user_id = auth.uid()
        )
    );
