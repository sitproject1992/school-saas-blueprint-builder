-- Create a simpler demo data setup that works without auth users
DO $$
DECLARE
    demo_school_id UUID;
    demo_class_id UUID;
BEGIN
    -- Ensure demo school exists
    INSERT INTO schools (name, subdomain, email, phone, address, subscription_status)
    VALUES (
        'Skooler Demo School',
        'demo',
        'admin@skooler.com',
        '+1-555-0123',
        '123 Education Street, Learning City, LC 12345',
        'active'
    )
    ON CONFLICT (subdomain) DO UPDATE SET
        name = 'Skooler Demo School'
    RETURNING id INTO demo_school_id;
    
    -- Get school ID if it already exists
    IF demo_school_id IS NULL THEN
        SELECT id INTO demo_school_id FROM schools WHERE subdomain = 'demo';
    END IF;

    -- Trigger default school data creation if not exists
    IF NOT EXISTS (SELECT 1 FROM classes WHERE school_id = demo_school_id LIMIT 1) THEN
        PERFORM create_default_school_data(demo_school_id);
    END IF;

    -- Get a demo class
    SELECT id INTO demo_class_id FROM classes WHERE school_id = demo_school_id LIMIT 1;

    -- Create demo notification settings for the school
    INSERT INTO notification_settings (
        user_id, school_id, 
        email_notifications, in_app_notifications
    ) VALUES (
        'demo-user-1', demo_school_id,
        '{"announcements": true, "grades": true, "attendance": true}',
        '{"announcements": true, "grades": true, "attendance": true}'
    ) ON CONFLICT (user_id, school_id) DO NOTHING;

    RAISE NOTICE 'Demo school setup completed successfully: %', demo_school_id;
END $$;