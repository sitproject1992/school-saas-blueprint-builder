# Complete Database Reset Guide

## Overview
This guide will help you completely reset your database and create a fresh start with only the super admin functionality working initially.

## What This Reset Does
- ✅ Deletes all existing data and tables
- ✅ Creates fresh database schema with correct structure
- ✅ Sets up proper enum types and constraints
- ✅ Enables super admin login (sujan1nepal@gmail.com/precioussn)
- ✅ Prepares system for school creation and admin management
- ✅ Sets up Row Level Security (RLS) policies

## Methods to Reset Database

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Execute the Reset Script**
   - Copy the entire contents of `database-complete-reset.sql`
   - Paste it into the SQL editor
   - Click "Run" button

4. **Verify Success**
   - Check that no errors occurred
   - Verify tables are created in the "Table Editor"

### Method 2: Using psql Command Line

1. **Install PostgreSQL Client** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql-client
   
   # macOS
   brew install postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/
   ```

2. **Get Database URL**
   - Go to Supabase Dashboard > Settings > Database
   - Copy the "Connection string" (URI format)
   - Format: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

3. **Run the Reset Script**
   ```bash
   # Make script executable (Linux/macOS)
   chmod +x reset-database.sh
   
   # Set your database URL
   export DATABASE_URL="your_database_url_here"
   
   # Run the script
   ./reset-database.sh
   ```

### Method 3: Manual Execution via Node.js

1. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. **Set Environment Variables**
   Create or update your `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run the Reset Script**
   ```bash
   node reset-database.js
   ```

## After Reset - Testing Steps

### 1. Test Super Admin Login
- Go to your application
- Try logging in with:
  - Email: `sujan1nepal@gmail.com`
  - Password: `precioussn`
- You should be able to access the super admin dashboard

### 2. Create a Test School
- From super admin dashboard, create a new school
- Fill in school details (name, subdomain, etc.)
- Verify school is created successfully

### 3. Create School Admin
- After creating school, set up school admin account
- Test logging in with school admin credentials
- Verify school admin can access their dashboard

### 4. Add Additional Data (Optional)
- Create classes, subjects, academic years
- Add teachers and students
- Test various functionalities

## Important Notes

⚠️ **WARNING**: This reset will **DELETE ALL DATA** in your database. Make sure you have backups if needed.

✅ **What Works After Reset**:
- Super admin login and dashboard
- School creation and management
- School admin account creation
- Basic authentication flows

🔧 **What Needs to be Set Up Later**:
- Fee structures and payments
- Attendance systems
- Exam and grading systems
- Communication features
- Inventory management

## Troubleshooting

### If Super Admin Login Doesn't Work
1. Check that the `super_admins` table has the correct email
2. Verify the authentication logic in `src/hooks/useAuth.tsx`
3. Check browser console for errors

### If School Creation Fails
1. Verify RLS policies are set correctly
2. Check Supabase logs for errors
3. Ensure all required tables exist

### If You Get Permission Errors
1. Make sure you're using the service role key (not anon key)
2. Check that RLS policies allow super admin access
3. Verify database URL is correct

## Files Created/Modified

- `database-complete-reset.sql` - Main reset script
- `reset-database.sh` - Bash execution script
- `reset-database.js` - Node.js execution script
- `DATABASE_RESET_GUIDE.md` - This guide

## Support

If you encounter issues:
1. Check the error messages carefully
2. Verify your environment variables
3. Test database connectivity
4. Check Supabase project status
5. Review the authentication flow in the application

The goal is to get a clean, working system where only the super admin functionality works initially, and then gradually add other features as needed.
