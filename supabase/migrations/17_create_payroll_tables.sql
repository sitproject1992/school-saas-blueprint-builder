-- Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    month INT NOT NULL,
    year INT NOT NULL,
    salary INT NOT NULL,
    deductions INT,
    net_salary INT NOT NULL,
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(teacher_id, month, year)
);

-- Add RLS policies for the new table
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School admins can manage payroll" ON payroll
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM school_admins sa
            WHERE sa.school_id = payroll.school_id
            AND sa.user_id = auth.uid()
        )
    );
