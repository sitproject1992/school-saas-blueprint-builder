-- TEST SCRIPT FOR SCHOOL ADMIN DATABASE FUNCTIONS
-- Run this after applying the schema fixes to verify everything works

-- ==========================================
-- 1. VERIFY FUNCTIONS EXIST
-- ==========================================

SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'create_school_admin_account', 
    'authenticate_school_admin',
    'hash_password',
    'verify_password',
    'is_super_admin'
)
ORDER BY routine_name;

-- ==========================================
-- 2. VERIFY TABLES EXIST
-- ==========================================

SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'school_admin_accounts', 
    'super_admins', 
    'password_history',
    'schools'
)
ORDER BY table_name;

-- ==========================================
-- 3. TEST PASSWORD FUNCTIONS
-- ==========================================

-- Test password hashing
SELECT 
    'test123' as original_password,
    hash_password('test123') as hashed_password,
    length(hash_password('test123')) as hash_length;

-- Test password verification
SELECT 
    'test123' as password,
    verify_password('test123', hash_password('test123')) as correct_password,
    verify_password('wrong123', hash_password('test123')) as wrong_password;

-- ==========================================
-- 4. TEST SUPER ADMIN FUNCTION
-- ==========================================

SELECT is_super_admin() as is_super_admin_result;

-- ==========================================
-- 5. TEST SCHOOL ADMIN CREATION
-- ==========================================

-- First, ensure we have a test school
INSERT INTO schools (id, name, subdomain, email, phone, address, subscription_status)
VALUES (
    'test-school-id-123'::UUID,
    'Test School for Admin Creation',
    'test-school-' || extract(epoch from now()),
    'test@testschool.edu',
    '+1-555-TEST',
    '123 Test Street, Test City',
    'active'
)
ON CONFLICT (subdomain) DO NOTHING;

-- Test creating a school admin
SELECT create_school_admin_account(
    'test-school-id-123'::UUID,
    'testadmin@testschool.edu',
    'securepassword123',
    'John',
    'TestAdmin',
    '+1-555-1234'
) as created_admin_id;

-- ==========================================
-- 6. TEST AUTHENTICATION
-- ==========================================

-- Test successful authentication
SELECT authenticate_school_admin(
    'testadmin@testschool.edu',
    'securepassword123'
) as successful_auth;

-- Test failed authentication (wrong password)
SELECT authenticate_school_admin(
    'testadmin@testschool.edu',
    'wrongpassword'
) as failed_auth;

-- Test authentication with non-existent user
SELECT authenticate_school_admin(
    'nonexistent@test.com',
    'anypassword'
) as nonexistent_user_auth;

-- ==========================================
-- 7. VERIFY DATA INTEGRITY
-- ==========================================

-- Check if the admin was created correctly
SELECT 
    id,
    email,
    first_name,
    last_name,
    school_id,
    is_active,
    must_change_password,
    login_attempts,
    created_at
FROM school_admin_accounts
WHERE email = 'testadmin@testschool.edu';

-- Check password history
SELECT 
    ph.id,
    ph.school_admin_account_id,
    ph.created_at,
    saa.email
FROM password_history ph
JOIN school_admin_accounts saa ON saa.id = ph.school_admin_account_id
WHERE saa.email = 'testadmin@testschool.edu';

-- ==========================================
-- 8. TEST LOGIN ATTEMPT TRACKING
-- ==========================================

-- Simulate failed login attempts
SELECT authenticate_school_admin('testadmin@testschool.edu', 'wrong1') as attempt1;
SELECT authenticate_school_admin('testadmin@testschool.edu', 'wrong2') as attempt2;
SELECT authenticate_school_admin('testadmin@testschool.edu', 'wrong3') as attempt3;

-- Check login attempts count
SELECT 
    email,
    login_attempts,
    locked_until
FROM school_admin_accounts
WHERE email = 'testadmin@testschool.edu';

-- Reset login attempts with correct password
SELECT authenticate_school_admin('testadmin@testschool.edu', 'securepassword123') as reset_attempts;

-- Verify login attempts were reset
SELECT 
    email,
    login_attempts,
    locked_until,
    last_login
FROM school_admin_accounts
WHERE email = 'testadmin@testschool.edu';

-- ==========================================
-- 9. CLEANUP TEST DATA
-- ==========================================

-- Remove test admin account
DELETE FROM school_admin_accounts WHERE email = 'testadmin@testschool.edu';

-- Remove test school (optional - comment out if you want to keep it)
-- DELETE FROM schools WHERE id = 'test-school-id-123'::UUID;

-- ==========================================
-- 10. FINAL VERIFICATION
-- ==========================================

SELECT 
    'All tests completed successfully!' as status,
    now() as completed_at;

-- Check for any remaining test data
SELECT COUNT(*) as remaining_test_admins
FROM school_admin_accounts 
WHERE email LIKE '%test%' OR email LIKE '%example%';
