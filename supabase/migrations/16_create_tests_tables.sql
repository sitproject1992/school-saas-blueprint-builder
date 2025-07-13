-- Tests Table
CREATE TABLE IF NOT EXISTS tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'pre-test', 'post-test', 'exam'
    test_date DATE NOT NULL,
    max_marks INT NOT NULL,
    duration INT, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Test Questions Table
CREATE TABLE IF NOT EXISTS test_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'multiple-choice', 'true-false', 'short-answer'
    options JSONB, -- for multiple-choice questions
    correct_answer TEXT,
    marks INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Student Test Results Table
CREATE TABLE IF NOT EXISTS student_test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained INT NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(test_id, student_id)
);

-- Add RLS policies for the new tables
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage tests for their classes" ON tests
    FOR ALL USING (teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can manage test questions for their tests" ON test_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tests
            WHERE tests.id = test_questions.test_id
            AND tests.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Teachers can manage student test results for their tests" ON student_test_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tests
            WHERE tests.id = student_test_results.test_id
            AND tests.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Students can view their own test results" ON student_test_results
    FOR SELECT USING (student_id = (SELECT id FROM students WHERE user_id = auth.uid()));
