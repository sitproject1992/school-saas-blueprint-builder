# Database Setup and School Registration Guide

## Overview

This guide will help you set up the complete database for the School Management System and understand the school registration flow.

## Database Setup

### Step 1: Supabase Project Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials**:
   - Go to Settings → API
   - Copy the `Project URL` and `anon public` key
   - Update these in `src/integrations/supabase/client.ts`

### Step 2: Run Database Migrations

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Run the complete database setup script**:

```sql
-- Copy and paste the contents of database-setup.sql
-- This will create all tables, indexes, RLS policies, and default data
```

### Step 3: Verify Database Setup

After running the setup script, verify that the following tables exist:

- ✅ `schools` - School information
- ✅ `profiles` - User profiles with roles
- ✅ `teachers` - Teacher-specific data
- ✅ `students` - Student-specific data
- ✅ `classes` - Class definitions
- ✅ `subjects` - Subject definitions
- ✅ `attendance` - Student attendance
- ✅ `fee_structures` - Fee definitions
- ✅ `fee_payments` - Payment records
- ✅ `lesson_plans` - Lesson planning
- ✅ `syllabus` - Syllabus management
- ✅ `inventory_categories` - Inventory categories
- ✅ `inventory_items` - Inventory items
- ✅ `announcements` - School announcements
- ✅ `teacher_attendance` - Teacher attendance
- ✅ `teacher_subjects` - Teacher-subject assignments
- ✅ `parent_students` - Parent-student relationships
- ✅ `inventory_movements` - Inventory tracking
- ✅ `roles` - User roles
- ✅ `user_roles` - Role assignments
- ✅ `school_admins` - School admin management

## School Registration Flow

### Complete Registration Process

The school registration system follows a 5-step process:

#### Step 1: School Registration (`/school-registration`)
- **Basic Information**: School name, subdomain, type, established year
- **Contact Information**: Email, phone, website, address
- **Admin Information**: Primary administrator details
- **School Details**: Student/teacher counts, grade range, curriculum
- **Subscription Plan**: Choose from Starter, Professional, or Enterprise

#### Step 2: Admin Setup (`/setup-admin`)
- Create the primary administrator account
- Set up authentication credentials
- Assign school_admin role
- Link admin to the school

#### Step 3: Teacher Registration (`/teacher-registration`)
- Bulk teacher registration (optional)
- Subject assignments
- Professional details
- Login credentials generation

#### Step 4: Student Registration (`/student-registration`)
- Student enrollment (optional)
- Class assignments
- Parent/guardian information
- Medical and emergency contacts

#### Step 5: Registration Complete (`/registration-complete`)
- Summary of registration
- Access credentials
- Next steps guidance

### Database Operations During Registration

#### School Creation
```sql
-- Creates school record with trial subscription
INSERT INTO schools (
    name, subdomain, email, phone, address,
    subscription_status, subscription_expires_at
) VALUES (
    'School Name', 'subdomain', 'email@school.com',
    '+91-1234567890', 'Complete Address',
    'active', '2024-01-27' -- 14 days trial
);
```

#### Admin Account Creation
```sql
-- 1. Create auth user
-- 2. Create profile with school_admin role
INSERT INTO profiles (
    user_id, email, first_name, last_name,
    phone, role, school_id
) VALUES (
    'auth-user-id', 'admin@school.com',
    'Admin', 'Name', '+91-1234567890',
    'school_admin', 'school-id'
);
```

#### Default Data Creation
When a school is created, the system automatically creates:
- **8 Default Subjects**: Mathematics, English, Science, etc.
- **24 Default Classes**: Grades 1-12 with sections A & B
- **6 Default Fee Structures**: Tuition, Transport, Library, etc.
- **6 Default Inventory Categories**: Stationery, Electronics, etc.

## Multi-Tenancy Architecture

### School-Based Data Isolation

All data is isolated by `school_id`:
- Each school has its own data
- Users can only access their school's data
- Row Level Security (RLS) enforces isolation

### User Roles and Permissions

| Role | Permissions | Access Level |
|------|-------------|--------------|
| `super_admin` | Full system access | All schools |
| `school_admin` | School management | Single school |
| `teacher` | Class management | Assigned classes |
| `student` | Personal data | Own records |
| `parent` | Child data | Children's records |
| `accountant` | Financial data | School finances |
| `inventory_manager` | Inventory management | School inventory |

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies ensure data isolation
- Users can only access their school's data

### Authentication
- Supabase Auth integration
- Email/password authentication
- Role-based access control

### Data Validation
- Input validation on all forms
- Database constraints
- Error handling and user feedback

## Testing the Registration System

### Demo Credentials
Use these credentials for testing:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| School Admin | `admin@skooler.com` | `admin123` | Full admin access |
| Teacher | `teacher@skooler.com` | `teacher123` | Teacher dashboard |
| Student | `student@skooler.com` | `student123` | Student portal |
| Parent | `parent@skooler.com` | `parent123` | Parent portal |

### Test Registration Flow

1. **Start Registration**: Visit `/school-registration`
2. **Fill School Details**: Complete all 5 steps
3. **Create Admin Account**: Set up administrator
4. **Add Teachers** (Optional): Register teachers
5. **Add Students** (Optional): Enroll students
6. **Complete Setup**: Access the dashboard

## Troubleshooting

### Common Issues

#### Database Connection Errors
- Verify Supabase credentials in `client.ts`
- Check network connectivity
- Ensure project is active

#### Registration Failures
- Check browser console for errors
- Verify all required fields are filled
- Ensure subdomain is unique

#### Permission Errors
- Verify RLS policies are applied
- Check user role assignments
- Ensure school_id is properly set

### Debug Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify Database**: Run queries in Supabase SQL Editor
3. **Test Authentication**: Try logging in with demo credentials
4. **Check Network**: Ensure API calls are successful

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Database Schema Updates
1. Create new migration files in `supabase/migrations/`
2. Update TypeScript types: `supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts`
3. Test the changes locally
4. Deploy to production

### Environment Variables
Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Production Deployment

### Database Setup
1. Run the complete `database-setup.sql` script
2. Verify all tables and policies are created
3. Test the registration flow

### Application Deployment
1. Build the application: `npm run build`
2. Deploy to your hosting platform
3. Set environment variables
4. Test the live application

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify database setup
3. Test with demo credentials
4. Review the registration flow documentation

---

**Last Updated**: January 2025
**Version**: 1.0.0