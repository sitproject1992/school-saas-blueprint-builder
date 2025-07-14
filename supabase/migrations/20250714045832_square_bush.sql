/*
  # Fix duplicate subjects creation in trigger

  1. Problem
    - The trigger that creates default subjects is causing duplicate key violations
    - This happens when the same subject code is inserted multiple times for the same school

  2. Solution
    - Update the trigger function to use INSERT ... ON CONFLICT DO NOTHING
    - This prevents duplicate key violations while still creating the necessary default data

  3. Security
    - Maintains existing RLS policies
    - No changes to permissions or access control
*/

-- Drop and recreate the trigger function with proper duplicate handling
DROP FUNCTION IF EXISTS trigger_create_default_school_data() CASCADE;

CREATE OR REPLACE FUNCTION trigger_create_default_school_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default subjects with conflict handling
  INSERT INTO subjects (school_id, name, code, description)
  VALUES 
    (NEW.id, 'Mathematics', 'MATH', 'Mathematics and numerical skills'),
    (NEW.id, 'English', 'ENG', 'English language and literature'),
    (NEW.id, 'Science', 'SCI', 'General science and scientific method'),
    (NEW.id, 'Social Studies', 'SS', 'History, geography, and social sciences'),
    (NEW.id, 'Physical Education', 'PE', 'Physical fitness and sports'),
    (NEW.id, 'Art', 'ART', 'Creative arts and expression'),
    (NEW.id, 'Music', 'MUS', 'Music theory and practice'),
    (NEW.id, 'Computer Science', 'CS', 'Computer programming and digital literacy')
  ON CONFLICT (school_id, code) DO NOTHING;

  -- Create default classes with conflict handling
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

  -- Create default fee structures with conflict handling
  INSERT INTO fee_structures (school_id, name, amount, frequency, due_date, academic_year, is_active)
  VALUES 
    (NEW.id, 'Tuition Fee', 5000.00, 'monthly', 5, '2024-25', true),
    (NEW.id, 'Transport Fee', 1500.00, 'monthly', 5, '2024-25', true),
    (NEW.id, 'Library Fee', 500.00, 'yearly', 5, '2024-25', true),
    (NEW.id, 'Sports Fee', 1000.00, 'yearly', 5, '2024-25', true),
    (NEW.id, 'Lab Fee', 2000.00, 'yearly', 5, '2024-25', true),
    (NEW.id, 'Examination Fee', 800.00, 'yearly', 5, '2024-25', true)
  ON CONFLICT DO NOTHING;

  -- Create default inventory categories with conflict handling
  INSERT INTO inventory_categories (school_id, name, description)
  VALUES 
    (NEW.id, 'Stationery', 'Pens, pencils, notebooks, and office supplies'),
    (NEW.id, 'Electronics', 'Computers, projectors, and electronic equipment'),
    (NEW.id, 'Furniture', 'Desks, chairs, and classroom furniture'),
    (NEW.id, 'Sports Equipment', 'Balls, nets, and sports gear'),
    (NEW.id, 'Laboratory', 'Lab equipment and scientific instruments'),
    (NEW.id, 'Library Books', 'Textbooks, reference books, and reading materials')
  ON CONFLICT (school_id, name) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER create_default_school_data_trigger
  AFTER INSERT ON schools
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_school_data();

-- Also recreate the other trigger name for compatibility
CREATE TRIGGER on_school_created
  AFTER INSERT ON schools
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_school_data();