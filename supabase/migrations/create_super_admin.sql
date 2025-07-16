-- Create super admin user and profile
-- This creates the super admin account: sujan1nepal@gmail.com

-- First, we'll create a super admin table to store super admin specific data
CREATE TABLE IF NOT EXISTS super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    permissions JSONB DEFAULT '{"all": true}'::jsonb
);

-- Create RLS policies for super_admins
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- Super admins can manage everything
CREATE POLICY "Super admins can manage all super admin records" ON super_admins
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON super_admins TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;

-- Update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_super_admins_updated_at
    BEFORE UPDATE ON super_admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
