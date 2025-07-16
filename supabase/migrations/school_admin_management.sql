-- School Admin Management Schema
-- This handles the creation and management of school administrators by super admins

-- Create school_admin_accounts table to manage school admin credentials
CREATE TABLE IF NOT EXISTS school_admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES super_admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    must_change_password BOOLEAN DEFAULT true,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);

-- Create password history to prevent reusing recent passwords
CREATE TABLE IF NOT EXISTS password_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_admin_account_id UUID REFERENCES school_admin_accounts(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create audit log for super admin actions
CREATE TABLE IF NOT EXISTS super_admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    super_admin_id UUID REFERENCES super_admins(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'school_admin', 'school', etc.
    target_id UUID NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE school_admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for school_admin_accounts
-- Super admins can manage all school admin accounts
CREATE POLICY "Super admins can manage all school admin accounts" ON school_admin_accounts
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );

-- School admins can view and update their own account
CREATE POLICY "School admins can view their own account" ON school_admin_accounts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email = school_admin_accounts.email
            AND profiles.role = 'school_admin'
        )
    );

CREATE POLICY "School admins can update their own account" ON school_admin_accounts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.email = school_admin_accounts.email
            AND profiles.role = 'school_admin'
        )
    );

-- RLS Policies for password_history
CREATE POLICY "Super admins can view all password history" ON password_history
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "School admins can view their own password history" ON password_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM school_admin_accounts saa
            JOIN profiles p ON p.email = saa.email
            WHERE password_history.school_admin_account_id = saa.id
            AND p.user_id = auth.uid()
            AND p.role = 'school_admin'
        )
    );

-- RLS Policies for super_admin_audit_log
CREATE POLICY "Super admins can view audit logs" ON super_admin_audit_log
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );

-- Functions for password management
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- In a real implementation, use a proper password hashing library
    -- For now, using a simple hash (not secure for production)
    RETURN encode(digest(password || 'salt', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN hash_password(password) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create school admin account
CREATE OR REPLACE FUNCTION create_school_admin_account(
    p_school_id UUID,
    p_email VARCHAR(255),
    p_password TEXT,
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_phone VARCHAR(20) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_account_id UUID;
    v_super_admin_id UUID;
    v_password_hash TEXT;
BEGIN
    -- Check if user is super admin
    IF NOT is_super_admin() THEN
        RAISE EXCEPTION 'Access denied. Super admin privileges required.';
    END IF;

    -- Get super admin ID
    SELECT sa.id INTO v_super_admin_id
    FROM super_admins sa
    JOIN profiles p ON p.user_id = sa.user_id
    WHERE p.user_id = auth.uid();

    -- Hash the password
    v_password_hash := hash_password(p_password);

    -- Create the account
    INSERT INTO school_admin_accounts (
        school_id, email, password_hash, first_name, last_name, phone, created_by
    ) VALUES (
        p_school_id, p_email, v_password_hash, p_first_name, p_last_name, p_phone, v_super_admin_id
    ) RETURNING id INTO v_account_id;

    -- Log the action
    INSERT INTO super_admin_audit_log (
        super_admin_id, action, target_type, target_id, details
    ) VALUES (
        v_super_admin_id, 'CREATE_SCHOOL_ADMIN', 'school_admin_account', v_account_id,
        jsonb_build_object('email', p_email, 'school_id', p_school_id)
    );

    RETURN v_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update school admin password
CREATE OR REPLACE FUNCTION update_school_admin_password(
    p_account_id UUID,
    p_new_password TEXT,
    p_old_password TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_hash TEXT;
    v_new_hash TEXT;
    v_is_super_admin BOOLEAN;
    v_super_admin_id UUID;
BEGIN
    -- Check if user is super admin or the account owner
    v_is_super_admin := is_super_admin();
    
    IF NOT v_is_super_admin THEN
        -- Check if user owns this account
        SELECT password_hash INTO v_current_hash
        FROM school_admin_accounts saa
        JOIN profiles p ON p.email = saa.email
        WHERE saa.id = p_account_id
        AND p.user_id = auth.uid()
        AND p.role = 'school_admin';

        IF v_current_hash IS NULL THEN
            RAISE EXCEPTION 'Access denied or account not found.';
        END IF;

        -- Verify old password if provided
        IF p_old_password IS NOT NULL AND NOT verify_password(p_old_password, v_current_hash) THEN
            RAISE EXCEPTION 'Current password is incorrect.';
        END IF;
    ELSE
        -- Get super admin ID for logging
        SELECT sa.id INTO v_super_admin_id
        FROM super_admins sa
        JOIN profiles p ON p.user_id = sa.user_id
        WHERE p.user_id = auth.uid();
    END IF;

    -- Hash new password
    v_new_hash := hash_password(p_new_password);

    -- Check password history (prevent reusing last 5 passwords)
    IF EXISTS (
        SELECT 1 FROM password_history 
        WHERE school_admin_account_id = p_account_id 
        AND password_hash = v_new_hash
        ORDER BY created_at DESC 
        LIMIT 5
    ) THEN
        RAISE EXCEPTION 'Cannot reuse recent passwords.';
    END IF;

    -- Add current password to history
    INSERT INTO password_history (school_admin_account_id, password_hash)
    SELECT id, password_hash 
    FROM school_admin_accounts 
    WHERE id = p_account_id;

    -- Update password
    UPDATE school_admin_accounts 
    SET 
        password_hash = v_new_hash,
        password_changed_at = NOW(),
        must_change_password = FALSE,
        login_attempts = 0,
        locked_until = NULL,
        updated_at = NOW()
    WHERE id = p_account_id;

    -- Log the action if super admin
    IF v_is_super_admin THEN
        INSERT INTO super_admin_audit_log (
            super_admin_id, action, target_type, target_id, details
        ) VALUES (
            v_super_admin_id, 'UPDATE_PASSWORD', 'school_admin_account', p_account_id,
            jsonb_build_object('changed_by', 'super_admin')
        );
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate school admin
CREATE OR REPLACE FUNCTION authenticate_school_admin(
    p_email VARCHAR(255),
    p_password TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_account school_admin_accounts%ROWTYPE;
    v_result JSONB;
BEGIN
    -- Get account details
    SELECT * INTO v_account
    FROM school_admin_accounts
    WHERE email = p_email AND is_active = TRUE;

    -- Check if account exists
    IF v_account.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid credentials');
    END IF;

    -- Check if account is locked
    IF v_account.locked_until IS NOT NULL AND v_account.locked_until > NOW() THEN
        RETURN jsonb_build_object('success', false, 'message', 'Account is temporarily locked');
    END IF;

    -- Verify password
    IF NOT verify_password(p_password, v_account.password_hash) THEN
        -- Increment login attempts
        UPDATE school_admin_accounts 
        SET 
            login_attempts = login_attempts + 1,
            locked_until = CASE 
                WHEN login_attempts + 1 >= 5 THEN NOW() + INTERVAL '30 minutes'
                ELSE NULL 
            END
        WHERE id = v_account.id;

        RETURN jsonb_build_object('success', false, 'message', 'Invalid credentials');
    END IF;

    -- Reset login attempts and update last login
    UPDATE school_admin_accounts 
    SET 
        login_attempts = 0,
        locked_until = NULL,
        last_login = NOW()
    WHERE id = v_account.id;

    -- Return success with user details
    v_result := jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'id', v_account.id,
            'email', v_account.email,
            'first_name', v_account.first_name,
            'last_name', v_account.last_name,
            'school_id', v_account.school_id,
            'must_change_password', v_account.must_change_password,
            'role', 'school_admin'
        )
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
CREATE TRIGGER update_school_admin_accounts_updated_at
    BEFORE UPDATE ON school_admin_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON school_admin_accounts TO authenticated;
GRANT ALL ON password_history TO authenticated;
GRANT ALL ON super_admin_audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION create_school_admin_account TO authenticated;
GRANT EXECUTE ON FUNCTION update_school_admin_password TO authenticated;
GRANT EXECUTE ON FUNCTION authenticate_school_admin TO authenticated;
GRANT EXECUTE ON FUNCTION hash_password TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password TO authenticated;
