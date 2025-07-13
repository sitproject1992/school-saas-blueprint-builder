-- Create fee_structures table
CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'monthly', 'yearly', 'one_time', etc.
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    due_date DATE,
    is_mandatory BOOLEAN DEFAULT true,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    school_id UUID, -- Will be linked to schools table when created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create fee_payments table
CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50), -- 'cash', 'card', 'online', 'bank_transfer'
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    notes TEXT,
    school_id UUID, -- Will be linked to schools table when created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create student_fee_structures junction table (already exists, but ensure it has proper structure)
CREATE TABLE IF NOT EXISTS student_fee_structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    school_id UUID, -- Will be linked to schools table when created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(student_id, fee_structure_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fee_structures_school_id ON fee_structures(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_class_id ON fee_structures(class_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_fee_structure_id ON fee_payments(fee_structure_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_school_id ON fee_payments(school_id);
CREATE INDEX IF NOT EXISTS idx_student_fee_structures_student_id ON student_fee_structures(student_id);
CREATE INDEX IF NOT EXISTS idx_student_fee_structures_fee_structure_id ON student_fee_structures(fee_structure_id);

-- Enable RLS
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_structures ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for fee_structures
CREATE POLICY "Users can view fee structures for their school" ON fee_structures
    FOR SELECT USING (true); -- Will add proper school filtering later

CREATE POLICY "Admins can manage fee structures" ON fee_structures
    FOR ALL USING (true); -- Will add proper role checking later

-- Create RLS policies for fee_payments
CREATE POLICY "Users can view fee payments for their school" ON fee_payments
    FOR SELECT USING (true); -- Will add proper school filtering later

CREATE POLICY "Admins can manage fee payments" ON fee_payments
    FOR ALL USING (true); -- Will add proper role checking later

-- Create RLS policies for student_fee_structures
CREATE POLICY "Users can view student fee structures for their school" ON student_fee_structures
    FOR SELECT USING (true); -- Will add proper school filtering later

CREATE POLICY "Admins can manage student fee structures" ON student_fee_structures
    FOR ALL USING (true); -- Will add proper role checking later

-- Create updated_at triggers
CREATE TRIGGER update_fee_structures_updated_at BEFORE UPDATE ON fee_structures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at BEFORE UPDATE ON fee_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
