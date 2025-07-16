/*
  # Fix subjects table RLS policy for school registration

  1. Security Changes
    - Update the trigger function to run with SECURITY DEFINER
    - This allows the function to bypass RLS when creating default data
    - Ensures automatic subject creation works during school registration

  2. Notes
    - The trigger function now runs with elevated privileges
    - This is safe because it only creates predefined default data
    - RLS policies remain intact for normal operations
*/

-- Update the trigger function to run with SECURITY DEFINER
-- This allows it to bypass RLS when creating default subjects, classes, etc.
CREATE OR REPLACE FUNCTION trigger_create_default_school_data()
RETURNS TRIGGER
SECURITY DEFINER -- This is the key change - function runs with creator's privileges
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Create default subjects
  INSERT INTO subjects (school_id, name, code, description) VALUES
    (NEW.id, 'Mathematics', 'MATH', 'Mathematics and numerical skills'),
    (NEW.id, 'English', 'ENG', 'English language and literature'),
    (NEW.id, 'Science', 'SCI', 'General science and scientific method'),
    (NEW.id, 'Social Studies', 'SS', 'History, geography, and social sciences'),
    (NEW.id, 'Physical Education', 'PE', 'Physical fitness and sports'),
    (NEW.id, 'Art', 'ART', 'Creative arts and expression'),
    (NEW.id, 'Music', 'MUS', 'Music theory and practice'),
    (NEW.id, 'Computer Science', 'CS', 'Computer programming and digital literacy')
  ON CONFLICT (school_id, code) DO NOTHING;

  -- Create default classes (Grades 1-12 with sections A & B)
  INSERT INTO classes (school_id, name, section, grade_level, capacity) 
  SELECT 
    NEW.id,
    'Grade ' || grade_num,
    section_letter,
    grade_num,
    30
  FROM 
    generate_series(1, 12) AS grade_num,
    unnest(ARRAY['A', 'B']) AS section_letter
  ON CONFLICT (school_id, name, section) DO NOTHING;

  -- Create default fee structures
  INSERT INTO fee_structures (school_id, name, amount, frequency, academic_year, is_active) VALUES
    (NEW.id, 'Tuition Fee', 5000.00, 'monthly', '2024-25', true),
    (NEW.id, 'Transport Fee', 1500.00, 'monthly', '2024-25', true),
    (NEW.id, 'Library Fee', 500.00, 'yearly', '2024-25', true),
    (NEW.id, 'Sports Fee', 800.00, 'yearly', '2024-25', true),
    (NEW.id, 'Laboratory Fee', 1200.00, 'yearly', '2024-25', true),
    (NEW.id, 'Examination Fee', 300.00, 'yearly', '2024-25', true)
  ON CONFLICT DO NOTHING;

  -- Create default inventory categories
  INSERT INTO inventory_categories (school_id, name, description) VALUES
    (NEW.id, 'Stationery', 'Pens, pencils, notebooks, and office supplies'),
    (NEW.id, 'Electronics', 'Computers, projectors, and electronic equipment'),
    (NEW.id, 'Furniture', 'Desks, chairs, and classroom furniture'),
    (NEW.id, 'Sports Equipment', 'Balls, nets, and sports gear'),
    (NEW.id, 'Laboratory Equipment', 'Scientific instruments and lab supplies'),
    (NEW.id, 'Books', 'Textbooks, reference books, and library materials')
  ON CONFLICT (school_id, name) DO NOTHING;

  RETURN NEW;
END;
$$;