-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for the new table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view events" ON events
    FOR SELECT USING (school_id = (SELECT school_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "School admins can manage events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            WHERE sa.school_id = events.school_id
            AND sa.user_id = auth.uid()
        )
    );
