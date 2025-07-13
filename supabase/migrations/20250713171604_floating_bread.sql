/*
  # Fix School Registration Policies

  1. Security Updates
    - Add RLS policy to allow anonymous users to create schools during registration
    - This is necessary for the initial school registration process

  2. Changes
    - Allow INSERT operations on schools table for anonymous users
    - Maintain existing security for other operations
*/

-- Add policy to allow anonymous users to create schools during registration
CREATE POLICY "Allow anon to create schools" ON schools
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Also allow authenticated users to create schools (for completeness)
CREATE POLICY "Allow authenticated to create schools" ON schools
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);