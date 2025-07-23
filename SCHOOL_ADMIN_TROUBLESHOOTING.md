# School Admin Authentication Troubleshooting Guide

## Overview

This guide addresses the specific issue where school admin accounts are created successfully but cannot authenticate/login.

## Root Cause Analysis

### **Primary Issues Identified**

1. **Missing Database Functions**: The required RPC functions for authentication don't exist
2. **Schema Inconsistencies**: Multiple overlapping user management systems
3. **Missing Enum Types**: Several required PostgreSQL enum types are missing
4. **Authentication Flow Mismatch**: App expects certain functions that don't exist in database

### **Database Schema Problems**

1. **Missing Functions**:
   - `authenticate_school_admin()` - For secure authentication
   - `create_school_admin_account()` - For proper account creation
   - `hash_password()` / `verify_password()` - For password security

2. **Missing Tables**:
   - `super_admins` - For super admin management
   - `password_history` - For password change tracking

3. **Missing Enum Types**:
   - `user_role`, `attendance_status`, `subscription_status`, `fee_status`, `exam_type`

## Solution Implementation

### **Step 1: Apply Database Schema Fixes**

Run the complete schema fix script in your Supabase SQL editor:

```sql
-- Copy and paste the entire contents of database-schema-fixes.sql
-- This will create all missing functions, tables, and enum types
```

### **Step 2: Verify Database Functions**

After applying the schema fixes, verify the functions work:

```sql
-- Test school admin creation
SELECT create_school_admin_account(
    (SELECT id FROM schools LIMIT 1),
    'testadmin@school.com',
    'password123',
    'Test',
    'Admin',
    '+1234567890'
);

-- Test authentication
SELECT authenticate_school_admin('testadmin@school.com', 'password123');
```

### **Step 3: Check Application Updates**

The authentication system has been updated to:

1. **Use proper RPC functions** for authentication
2. **Fallback to direct queries** if functions don't exist
3. **Better error handling** with detailed messages
4. **Improved logging** for debugging

### **Step 4: Verify School Admin Creation Process**

1. **Login as Super Admin**: Use `sujan1nepal@gmail.com` / `precioussn`
2. **Navigate to Super Admin Dashboard**: Should be at `/super-admin`
3. **Create School Admin**: Use the school admin form
4. **Check Database**: Verify record exists in `school_admin_accounts` table
5. **Test Login**: Try logging in with the new credentials

## Database Schema Summary

### **Required Tables**

1. **`school_admin_accounts`**: Main table for school admin credentials
   - Stores hashed passwords
   - Links to schools
   - Manages account status and security

2. **`super_admins`**: Platform administrator accounts
   - Manages super admin access
   - Links to super admin email

3. **`password_history`**: Password change tracking
   - Prevents password reuse
   - Security compliance

### **Required Functions**

1. **`create_school_admin_account()`**: Secure account creation
   - Hashes passwords properly
   - Creates audit trail
   - Handles constraints

2. **`authenticate_school_admin()`**: Secure authentication
   - Verifies credentials
   - Handles login attempts
   - Updates login tracking

3. **`hash_password()` / `verify_password()`**: Password security
   - Consistent hashing
   - Secure verification

## Testing Procedures

### **Pre-Deployment Testing**

1. **Schema Verification**:
   ```sql
   -- Check if functions exist
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('create_school_admin_account', 'authenticate_school_admin');
   
   -- Check if tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('school_admin_accounts', 'super_admins', 'password_history');
   ```

2. **Function Testing**:
   ```sql
   -- Test account creation
   SELECT create_school_admin_account(
       (SELECT id FROM schools LIMIT 1),
       'test@example.com',
       'testpass123',
       'John',
       'Doe',
       '+1234567890'
   );
   
   -- Test authentication
   SELECT authenticate_school_admin('test@example.com', 'testpass123');
   ```

### **Post-Deployment Testing**

1. **Super Admin Access**:
   - Login with `sujan1nepal@gmail.com`
   - Verify super admin dashboard loads
   - Check school admin management interface

2. **School Admin Creation**:
   - Create a new school admin account
   - Verify success message appears
   - Check database for new record

3. **School Admin Login**:
   - Logout from super admin
   - Login with new school admin credentials
   - Verify access to school dashboard

## Common Issues and Solutions

### **Issue**: "RPC function not available"

**Cause**: Database functions not created
**Solution**: Run the schema fixes SQL script

### **Issue**: "Authentication failed"

**Cause**: Password hashing mismatch
**Solution**: Use the proper authentication function

### **Issue**: "Account not found"

**Cause**: Record not created in database
**Solution**: Check schema permissions and constraints

### **Issue**: "Database error querying schema"

**Cause**: Missing enum types or table structure issues
**Solution**: Apply complete schema fixes

## Monitoring and Maintenance

### **Database Queries for Monitoring**

```sql
-- Check school admin accounts
SELECT 
    id, email, first_name, last_name, 
    school_id, is_active, last_login,
    login_attempts, locked_until
FROM school_admin_accounts 
ORDER BY created_at DESC;

-- Check authentication attempts
SELECT 
    saa.email, saa.login_attempts, saa.last_login, saa.locked_until,
    s.name as school_name
FROM school_admin_accounts saa
JOIN schools s ON s.id = saa.school_id
WHERE saa.login_attempts > 0 OR saa.locked_until IS NOT NULL;

-- Check password history
SELECT 
    ph.created_at, saa.email, saa.first_name, saa.last_name
FROM password_history ph
JOIN school_admin_accounts saa ON saa.id = ph.school_admin_account_id
ORDER BY ph.created_at DESC;
```

### **Regular Maintenance Tasks**

1. **Weekly**: Check for locked accounts and failed login attempts
2. **Monthly**: Review password change history and security logs
3. **Quarterly**: Verify RLS policies and permissions are working correctly

## Support Procedures

### **For Users Reporting Login Issues**

1. **Verify account exists** in `school_admin_accounts` table
2. **Check account status** (is_active, locked_until)
3. **Review login attempts** and security status
4. **Test authentication function** manually
5. **Reset password** if necessary using super admin interface

### **For Developers**

1. **Check browser console** for detailed error messages
2. **Review Supabase logs** for database errors
3. **Verify schema** is up to date
4. **Test functions** in SQL editor
5. **Check RLS policies** and permissions

---

**Last Updated**: January 2025  
**Version**: 2.0.0

This guide should resolve all school admin authentication issues when properly implemented.
