-- Create demo school and test users
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
    ON CONFLICT (subdomain) DO NOTHING
    RETURNING id INTO demo_school_id;
    
    -- Get school ID if it already exists
    IF demo_school_id IS NULL THEN
        SELECT id INTO demo_school_id FROM schools WHERE subdomain = 'demo';
    END IF;

    -- Create demo profiles with user_id matching the expected auth users
    -- These should match the demo credentials in AuthPage.tsx
    
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
    ) ON CONFLICT (email) DO UPDATE SET
        school_id = demo_school_id,
        role = 'school_admin'
    RETURNING id INTO admin_profile_id;

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
    ) ON CONFLICT (email) DO UPDATE SET
        school_id = demo_school_id,
        role = 'teacher'
    RETURNING id INTO teacher_profile_id;

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
    ) ON CONFLICT (email) DO UPDATE SET
        school_id = demo_school_id,
        role = 'student'
    RETURNING id INTO student_profile_id;

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
    ) ON CONFLICT (email) DO UPDATE SET
        school_id = demo_school_id,
        role = 'parent'
    RETURNING id INTO parent_profile_id;

    -- Create school admin record
    INSERT INTO school_admins (user_id, school_id, role, is_active)
    VALUES ('11111111-1111-1111-1111-111111111111', demo_school_id, 'admin', true)
    ON CONFLICT (user_id, school_id) DO NOTHING;

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
    ) ON CONFLICT (profile_id) DO NOTHING;

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
    ) ON CONFLICT (profile_id) DO NOTHING;

    -- Create parent-student relationship
    INSERT INTO parent_students (parent_id, student_id, relationship, is_primary)
    SELECT parent_profile_id, student_profile_id, 'parent', true
    WHERE student_profile_id IS NOT NULL AND parent_profile_id IS NOT NULL
    ON CONFLICT (parent_id, student_id) DO NOTHING;

    -- Add some sample attendance data
    INSERT INTO attendance (student_id, class_id, date, status, school_id)
    SELECT 
        s.id,
        s.class_id,
        CURRENT_DATE - (generate_series(1, 5) || ' days')::interval,
        (ARRAY['present', 'present', 'present', 'late', 'present'])[generate_series(1, 5)],
        demo_school_id
    FROM students s 
    WHERE s.school_id = demo_school_id
    ON CONFLICT DO NOTHING;

    -- Add sample fee payments
    INSERT INTO fee_payments (
        student_id, fee_structure_id, amount, due_date, status, school_id
    )
    SELECT 
        s.id,
        fs.id,
        fs.amount,
        CURRENT_DATE + interval '30 days',
        'pending',
        demo_school_id
    FROM students s
    CROSS JOIN fee_structures fs
    WHERE s.school_id = demo_school_id 
    AND fs.school_id = demo_school_id
    LIMIT 5
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Demo data created successfully for school: %', demo_school_id;
END $$;