-- Academic Year Table
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Grading System Table
CREATE TABLE IF NOT EXISTS grading_systems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    scale JSONB NOT NULL, -- e.g., [{"grade": "A", "min_score": 90}, {"grade": "B", "min_score": 80}]
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    email_notifications JSONB DEFAULT '{}', -- e.g., {"new_announcement": true, "fee_reminder": true}
    in_app_notifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, school_id)
);

-- Add RLS policies for the new tables
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School admins can manage academic years" ON academic_years
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            WHERE sa.school_id = academic_years.school_id
            AND sa.user_id = auth.uid()
        )
    );

CREATE POLICY "School admins can manage grading systems" ON grading_systems
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            WHERE sa.school_id = grading_systems.school_id
            AND sa.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own notification settings" ON notification_settings
    FOR ALL USING (user_id = auth.uid());
