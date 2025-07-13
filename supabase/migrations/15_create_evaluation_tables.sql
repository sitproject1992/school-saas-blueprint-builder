-- Teacher Evaluations Table
CREATE TABLE IF NOT EXISTS teacher_evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    evaluation_date DATE NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for the new table
ALTER TABLE teacher_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School admins can manage teacher evaluations" ON teacher_evaluations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            JOIN teachers t ON t.id = teacher_evaluations.teacher_id
            WHERE sa.school_id = t.school_id
            AND sa.user_id = auth.uid()
        )
    );
