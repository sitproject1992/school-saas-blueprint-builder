-- Create demo school and test users (fixed version)
DO $$
DECLARE
    demo_school_id UUID;
    admin_profile_id UUID;
    teacher_profile_id UUID;
    student_profile_id UUID;
    parent_profile_id UUID;
    demo_class_id UUID;
BEGIN
    -- Insert demo school if it doesn't exist
    INSERT INTO schools (id, name, subdomain, email, phone, address, subscription_status)
    VALUES (
        gen_random_uuid(),
        'Skooler Demo School',
        'demo',
        'admin@skooler.com',
        '+1-555-0123',
        '123 Education Street, Learning City, LC 12345',
        'active'
    )
    ON CONFLICT (subdomain) DO UPDATE SET
        name = 'Skooler Demo School',
        email = 'admin@skooler.com'
    RETURNING id INTO demo_school_id;
    
    -- Get school ID if it already exists
    IF demo_school_id IS NULL THEN
        SELECT id INTO demo_school_id FROM schools WHERE subdomain = 'demo';
    END IF;

    -- Delete existing profiles to recreate them
    DELETE FROM profiles WHERE email IN ('admin@skooler.com', 'teacher@skooler.com', 'student@skooler.com', 'parent@skooler.com');

    -- School Admin Profile
    INSERT INTO profiles (
        id, user_id, email, first_name, last_name, role, school_id, phone
    ) VALUES (
        gen_random_uuid(),
        '11111111-1111-1111-1111-111111111111',
        'admin@skooler.com',
        'Admin',
        'User',
        'school_admin',
        demo_school_id,
        '+1-555-0101'
    ) RETURNING id INTO admin_profile_id;

    -- Teacher Profile  
    INSERT INTO profiles (
        id, user_id, email, first_name, last_name, role, school_id, phone
    ) VALUES (
        gen_random_uuid(),
        '22222222-2222-2222-2222-222222222222',
        'teacher@skooler.com',
        'Teacher',
        'Smith',
        'teacher',
        demo_school_id,
        '+1-555-0102'
    ) RETURNING id INTO teacher_profile_id;

    -- Student Profile
    INSERT INTO profiles (
        id, user_id, email, first_name, last_name, role, school_id, phone, date_of_birth
    ) VALUES (
        gen_random_uuid(),
        '33333333-3333-3333-3333-333333333333',
        'student@skooler.com',
        'Student',
        'Johnson',
        'student',
        demo_school_id,
        '+1-555-0103',
        '2010-05-15'
    ) RETURNING id INTO student_profile_id;

    -- Parent Profile
    INSERT INTO profiles (
        id, user_id, email, first_name, last_name, role, school_id, phone
    ) VALUES (
        gen_random_uuid(),
        '44444444-4444-4444-4444-444444444444',
        'parent@skooler.com',
        'Parent',
        'Williams',
        'parent',
        demo_school_id,
        '+1-555-0104'
    ) RETURNING id INTO parent_profile_id;

    -- Create school admin record
    INSERT INTO school_admins (user_id, school_id, role, is_active)
    VALUES ('11111111-1111-1111-1111-111111111111', demo_school_id, 'admin', true)
    ON CONFLICT (user_id, school_id) DO UPDATE SET is_active = true;

    -- Get a demo class for assignments
    SELECT id INTO demo_class_id FROM classes WHERE school_id = demo_school_id LIMIT 1;

    -- Create teacher record
    INSERT INTO teachers (
        profile_id, school_id, qualification, experience_years, joining_date, salary, class_id
    ) VALUES (
        teacher_profile_id,
        demo_school_id,
        'Master of Education',
        5,
        '2020-08-15',
        50000,
        demo_class_id
    ) ON CONFLICT (profile_id) DO UPDATE SET
        qualification = 'Master of Education',
        experience_years = 5;

    -- Create student record
    INSERT INTO students (
        profile_id, school_id, admission_number, admission_date, class_id, blood_group
    ) VALUES (
        student_profile_id,
        demo_school_id,
        'STU2024001',
        '2024-01-15',
        demo_class_id,
        'A+'
    ) ON CONFLICT (profile_id) DO UPDATE SET
        admission_number = 'STU2024001',
        blood_group = 'A+';

    -- Create parent-student relationship if both exist
    IF parent_profile_id IS NOT NULL AND student_profile_id IS NOT NULL THEN
        INSERT INTO parent_students (parent_id, student_id, relationship, is_primary)
        VALUES (parent_profile_id, student_profile_id, 'parent', true)
        ON CONFLICT (parent_id, student_id) DO UPDATE SET is_primary = true;
    END IF;

    RAISE NOTICE 'Demo data created successfully for school: %', demo_school_id;
END $$;