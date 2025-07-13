-- Drop all RLS policies on the schools table
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own school" ON schools;
DROP POLICY IF EXISTS "School admins can update their school" ON schools;
DROP POLICY IF EXISTS "Public can view all schools" ON schools;
DROP POLICY IF EXISTS "Authenticated users can create schools" ON schools;
