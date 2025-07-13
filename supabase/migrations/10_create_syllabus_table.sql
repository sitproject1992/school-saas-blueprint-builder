-- Create syllabus table
CREATE TABLE IF NOT EXISTS syllabus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT, -- URL to uploaded syllabus file
    file_name VARCHAR(255),
    file_size INTEGER, -- in bytes
    file_type VARCHAR(50), -- 'pdf', 'doc', 'docx', etc.
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    academic_year VARCHAR(20), -- e.g., '2024-25'
    term VARCHAR(20), -- e.g., 'Term 1', 'Semester 1'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    version INTEGER DEFAULT 1,
    school_id UUID, -- Will be linked to schools table when created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create syllabus_topics table for detailed curriculum breakdown
CREATE TABLE IF NOT EXISTS syllabus_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    syllabus_id UUID NOT NULL REFERENCES syllabus(id) ON DELETE CASCADE,
    topic_name VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives TEXT,
    estimated_hours INTEGER,
    sequence_order INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed'
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_syllabus_class_id ON syllabus(class_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_subject_id ON syllabus(subject_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_teacher_id ON syllabus(teacher_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_school_id ON syllabus(school_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_academic_year ON syllabus(academic_year);
CREATE INDEX IF NOT EXISTS idx_syllabus_topics_syllabus_id ON syllabus_topics(syllabus_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_topics_sequence_order ON syllabus_topics(sequence_order);

-- Enable RLS
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_topics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for syllabus
CREATE POLICY "Users can view syllabus for their school" ON syllabus
    FOR SELECT USING (true); -- Will add proper school filtering later

CREATE POLICY "Teachers can insert their own syllabus" ON syllabus
    FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own syllabus" ON syllabus
    FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own syllabus" ON syllabus
    FOR DELETE USING (auth.uid() = teacher_id);

-- Create RLS policies for syllabus_topics
CREATE POLICY "Users can view syllabus topics for their school" ON syllabus_topics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM syllabus s 
            WHERE s.id = syllabus_topics.syllabus_id
        )
    );

CREATE POLICY "Teachers can manage their syllabus topics" ON syllabus_topics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM syllabus s 
            WHERE s.id = syllabus_topics.syllabus_id 
            AND s.teacher_id = auth.uid()
        )
    );

-- Create updated_at triggers
CREATE TRIGGER update_syllabus_updated_at BEFORE UPDATE ON syllabus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_syllabus_topics_updated_at BEFORE UPDATE ON syllabus_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
