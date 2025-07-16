-- Final demo school setup
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
    name = 'Skooler Demo School';

-- Create default data for the demo school
DO $$
DECLARE
    demo_school_id UUID;
BEGIN
    SELECT id INTO demo_school_id FROM schools WHERE subdomain = 'demo';
    
    IF demo_school_id IS NOT NULL THEN
        -- Only create default data if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM classes WHERE school_id = demo_school_id LIMIT 1) THEN
            PERFORM create_default_school_data(demo_school_id);
        END IF;
    END IF;
END $$;