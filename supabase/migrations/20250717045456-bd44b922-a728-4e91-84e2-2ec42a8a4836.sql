-- Create school_admin_accounts table for super admin management
CREATE TABLE IF NOT EXISTS public.school_admin_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    must_change_password BOOLEAN NOT NULL DEFAULT true,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    CONSTRAINT school_admin_accounts_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create super admin audit log table
CREATE TABLE IF NOT EXISTS public.super_admin_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    super_admin_id UUID NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bulk import logs table for tracking student imports
CREATE TABLE IF NOT EXISTS public.bulk_import_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    imported_by UUID NOT NULL,
    file_name TEXT NOT NULL,
    total_records INTEGER NOT NULL DEFAULT 0,
    successful_imports INTEGER NOT NULL DEFAULT 0,
    failed_imports INTEGER NOT NULL DEFAULT 0,
    import_details JSONB,
    error_details JSONB,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.school_admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_import_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for school_admin_accounts
CREATE POLICY "Super admins can manage all school admin accounts"
ON public.school_admin_accounts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    )
);

-- Create RLS policies for super_admin_audit_log
CREATE POLICY "Super admins can view all audit logs"
ON public.super_admin_audit_log
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    )
);

CREATE POLICY "Super admins can insert audit logs"
ON public.super_admin_audit_log
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    )
);

-- Create RLS policies for bulk_import_logs
CREATE POLICY "Super admins can view all import logs"
ON public.bulk_import_logs
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    )
);

CREATE POLICY "School admins can view their school import logs"
ON public.bulk_import_logs
FOR SELECT
TO authenticated
USING (
    school_id IN (
        SELECT school_id FROM school_admins 
        WHERE user_id = auth.uid() AND is_active = true
    )
);

CREATE POLICY "Authenticated users can insert import logs"
ON public.bulk_import_logs
FOR INSERT
TO authenticated
WITH CHECK (
    imported_by = auth.uid()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_school_admin_accounts_school_id ON public.school_admin_accounts(school_id);
CREATE INDEX IF NOT EXISTS idx_school_admin_accounts_email ON public.school_admin_accounts(email);
CREATE INDEX IF NOT EXISTS idx_super_admin_audit_log_super_admin_id ON public.super_admin_audit_log(super_admin_id);
CREATE INDEX IF NOT EXISTS idx_super_admin_audit_log_created_at ON public.super_admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_bulk_import_logs_school_id ON public.bulk_import_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_bulk_import_logs_status ON public.bulk_import_logs(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_school_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_school_admin_accounts_updated_at
    BEFORE UPDATE ON public.school_admin_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_school_admin_updated_at();

-- Create function to create school admin with profile
CREATE OR REPLACE FUNCTION public.create_school_admin_account(
    p_school_id UUID,
    p_email TEXT,
    p_password TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_phone TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_account_id UUID;
    v_user_id UUID;
BEGIN
    -- Check if super admin is calling this
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Super admin privileges required';
    END IF;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM school_admin_accounts WHERE email = p_email) THEN
        RAISE EXCEPTION 'Email already exists';
    END IF;

    -- Check if school exists
    IF NOT EXISTS (SELECT 1 FROM schools WHERE id = p_school_id) THEN
        RAISE EXCEPTION 'School does not exist';
    END IF;

    -- Create school admin account
    INSERT INTO school_admin_accounts (
        school_id, email, password_hash, first_name, last_name, phone
    ) VALUES (
        p_school_id, p_email, crypt(p_password, gen_salt('bf')), 
        p_first_name, p_last_name, p_phone
    ) RETURNING id INTO v_account_id;

    -- Try to create auth user and profile
    BEGIN
        -- Insert into auth.users would be done by Supabase Auth
        -- For now, we'll create a profile record
        INSERT INTO profiles (
            user_id, first_name, last_name, email, phone, 
            role, school_id
        ) VALUES (
            gen_random_uuid(), p_first_name, p_last_name, p_email, p_phone,
            'school_admin', p_school_id
        ) RETURNING user_id INTO v_user_id;

    EXCEPTION WHEN OTHERS THEN
        -- Continue even if profile creation fails
        NULL;
    END;

    RETURN v_account_id;
END;
$$;

-- Create function to update school admin password
CREATE OR REPLACE FUNCTION public.update_school_admin_password(
    p_account_id UUID,
    p_new_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if super admin is calling this
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Super admin privileges required';
    END IF;

    -- Update password
    UPDATE school_admin_accounts 
    SET 
        password_hash = crypt(p_new_password, gen_salt('bf')),
        password_changed_at = now(),
        must_change_password = false,
        login_attempts = 0,
        locked_until = NULL
    WHERE id = p_account_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'School admin account not found';
    END IF;
END;
$$;