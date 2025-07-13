# School Registration Flow Documentation

## Overview

This document outlines the complete school registration process implemented in the Skooler school management system. The flow follows a logical sequence: School Registration → Admin Setup → Teacher Registration → Student Registration.

## Registration Flow

### 1. School Registration (`/school-registration`)

**Purpose**: Initial school setup and basic information collection.

**Steps**:

1. **Basic School Information**
   - School name
   - Subdomain (creates unique school URL)
   - School type (Primary, Secondary, K-12, etc.)
   - Established year

2. **Contact Information**
   - School email and phone
   - Website (optional)
   - Complete address (street, city, state, pincode)

3. **Admin Information**
   - Primary administrator details
   - Name, email, phone, position

4. **School Details**
   - Total students and teachers (ranges)
   - Grade range offered
   - Curriculum type (CBSE, ICSE, State Board, etc.)

5. **Subscription Plan**
   - Choose from Starter, Professional, or Enterprise plans
   - 14-day free trial included

**Database Operations**:

- Creates record in `schools` table
- Stores registration data in localStorage for next steps

### 2. Admin Setup (`/setup-admin`)

**Purpose**: Create the primary administrator account.

**Features**:

- Pre-fills information from school registration
- Password creation with validation
- Creates both authentication user and profile record

**Database Operations**:

- Creates user in Supabase Auth
- Creates record in `profiles` table with `school_admin` role
- Links profile to the school via `school_id`

### 3. Teacher Registration (`/teacher-registration`)

**Purpose**: Bulk teacher registration with comprehensive details.

**Features**:

- Multi-step form for teacher information
- Subject assignment from predefined list
- Bulk registration capability
- Password generation
- Can be skipped if needed

**Information Collected**:

- Personal details (name, email, phone, DOB, address)
- Professional details (qualification, experience, salary)
- Subjects taught
- Login credentials

**Database Operations**:

- Creates users in Supabase Auth
- Creates records in `profiles` table with `teacher` role
- Creates records in `teachers` table with additional details

### 4. Student Registration (`/student-registration`)

**Purpose**: Student enrollment with class assignment.

**Features**:

- 3-step registration form
- Automatic class creation (Grades 1-5 with sections A & B)
- Parent/guardian information
- Medical information and emergency contacts
- Admission number generation

**Information Collected**:

- **Step 1**: Basic information (name, email, DOB, gender, address)
- **Step 2**: School details (admission number, class, emergency contacts)
- **Step 3**: Parent information (father/mother details, occupations)

**Database Operations**:

- Creates default classes for the school
- Creates users in Supabase Auth
- Creates records in `profiles` table with `student` role
- Creates records in `students` table with class assignment

### 5. Registration Complete (`/registration-complete`)

**Purpose**: Show completion status and provide access credentials.

**Features**:

- Registration summary
- Downloadable credentials file
- Next steps guidance
- Support contact information

## Database Schema

### Key Tables Used

1. **schools**: Basic school information
2. **profiles**: User profiles with role-based information
3. **teachers**: Teacher-specific details
4. **students**: Student-specific details and class assignment
5. **classes**: Class definitions with capacity
6. **user_roles**: Role assignments (used for authorization)

### User Roles

- `school_admin`: Full administrative access
- `teacher`: Teacher-specific permissions
- `student`: Student-specific permissions
- `parent`: Parent portal access (future implementation)

## Authentication Flow

The system uses Supabase Auth for user management:

1. **Demo Mode**: Uses localStorage-based authentication for demo accounts
2. **Production Mode**: Full Supabase authentication with email/password
3. **Role-Based Access**: Different dashboards based on user roles

## Security Features

- Password validation (minimum 6 characters)
- Secure credential generation
- Role-based access control
- School-specific data isolation via `school_id`

## Navigation Flow

```
Landing Page (/)
    ↓ "Register Your School"
School Registration (/school-registration)
    ↓ Complete registration
Admin Setup (/setup-admin)
    ↓ Create admin account
Teacher Registration (/teacher-registration)
    ↓ Add teachers (optional)
Student Registration (/student-registration)
    ↓ Add students (optional)
Registration Complete (/registration-complete)
    ↓ Go to Dashboard
Main Application (/dashboard)
```

## Error Handling

- Form validation at each step
- Database error handling with user-friendly messages
- Fallback to localStorage if database operations fail
- Progress preservation across steps

## Future Enhancements

1. **Email Verification**: Send verification emails to registered users
2. **Bulk Import**: CSV/Excel import for teachers and students
3. **Custom Fields**: Allow schools to add custom fields
4. **Integration**: Connect with existing school systems
5. **Multi-School**: Support for multiple schools under one account

## Technical Implementation

### Frontend

- React with TypeScript
- React Router for navigation
- Tailwind CSS with shadcn/ui components
- Form validation and state management

### Backend

- Supabase for authentication and database
- PostgreSQL database with RLS (Row Level Security)
- Real-time capabilities for live updates

### Deployment

- Vite build system
- Static site deployment ready
- Environment variable configuration

## Testing

The registration flow has been tested for:

- ✅ Form validation
- ✅ Database operations
- ✅ Navigation between steps
- ✅ Error handling
- �� Build process
- ✅ TypeScript compliance

## Support

For issues or questions about the registration flow:

- Check the application logs for detailed error messages
- Verify Supabase connection and permissions
- Ensure all required environment variables are set
- Contact support team for assistance

---

_This documentation is part of the Skooler school management system._
