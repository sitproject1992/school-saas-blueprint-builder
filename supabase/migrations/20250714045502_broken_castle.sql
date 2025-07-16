/*
  # Fix schools table RLS policy for registration

  1. Policy Updates
    - Add policy to allow anonymous users to insert new schools during registration
    - This is needed because school creation happens before user authentication

  2. Security
    - Allow anonymous INSERT operations for school registration
    - Maintain existing policies for other operations
*/

-- Drop existing conflicting policies that might prevent anonymous inserts
DROP POLICY IF EXISTS "Allow authenticated users to create schools" ON schools;
DROP POLICY IF EXISTS "Authenticated users can create schools" ON schools;

-- Create a policy that allows anonymous users to insert schools (needed for registration)
CREATE POLICY "Allow anonymous users to create schools during registration"
  ON schools
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure authenticated users can also create schools
CREATE POLICY "Allow authenticated users to create schools"
  ON schools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);