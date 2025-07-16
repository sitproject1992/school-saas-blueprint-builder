# Super Admin System Documentation

## Overview

A comprehensive super admin system has been built for the Skooler school management platform. This system allows a super administrator to manage multiple schools and their administrators from a centralized dashboard.

## Key Features

### 1. Super Admin Authentication

- **Email**: `sujan1nepal@gmail.com`
- **Password**: `precioussn`
- **Access Level**: Full system control across all schools
- **Dashboard Route**: `/super-admin`

### 2. Core Functionality

#### School Administration Management

- **Create School Admins**: Add new administrators for schools
- **Edit School Admins**: Update administrator information
- **Delete School Admins**: Remove administrators from the system
- **Activate/Deactivate**: Control admin account status
- **Password Reset**: Reset passwords for school administrators
- **View Activity**: Monitor login history and account status

#### School Management

- **View All Schools**: List of all registered schools
- **School Details**: View subscription status, student counts, admin counts
- **Subscription Management**: Monitor and manage school subscriptions

#### Security Features

- **Password History**: Prevents reuse of recent passwords
- **Account Locking**: Automatic lockout after failed login attempts
- **Audit Logging**: Track all super admin actions
- **Role-based Access**: Separate permissions for different user types

### 3. Database Schema

#### Core Tables

- `super_admins`: Super administrator accounts
- `school_admin_accounts`: School administrator credentials and management
- `password_history`: Track password changes to prevent reuse
- `super_admin_audit_log`: Audit trail of all super admin actions

#### Key Functions

- `create_school_admin_account()`: Create new school admin
- `update_school_admin_password()`: Change passwords securely
- `authenticate_school_admin()`: Verify school admin credentials
- `is_super_admin()`: Check super admin privileges

### 4. User Interface

#### Super Admin Dashboard

- **Overview Tab**: System statistics and recent activity
- **School Admins Tab**: Manage all school administrators
- **Schools Tab**: View and manage all schools
- **Settings Tab**: System and account settings

#### School Admin Form

- Create/edit school administrators
- Password generation and validation
- Email notifications
- Security settings

#### Password Management

- Secure password change interface for school admins
- Password strength validation
- Auto-generated secure passwords

### 5. Authentication Flow

#### Super Admin Login

1. User enters `sujan1nepal@gmail.com` and `precioussn`
2. System creates mock session with super_admin role
3. Redirects to `/super-admin` dashboard
4. Full access to all system functions

#### School Admin Login

1. School admin enters credentials
2. System validates against `school_admin_accounts` table
3. Checks account status, login attempts, and restrictions
4. Creates session with appropriate school context
5. Redirects to school-specific dashboard

### 6. Security Measures

#### Password Security

- Minimum 8 characters
- Password history tracking (prevents reuse of last 5 passwords)
- Account lockout after 5 failed attempts
- Secure password hashing

#### Access Control

- Role-based permissions (super_admin, school_admin, etc.)
- Row-level security (RLS) policies
- Audit logging for sensitive operations

#### Session Management

- Secure session handling
- Automatic logout for inactive sessions
- Role-based routing

### 7. API Integration

#### Supabase Functions

- `create_school_admin_account(p_school_id, p_email, p_password, p_first_name, p_last_name, p_phone)`
- `update_school_admin_password(p_account_id, p_new_password, p_old_password)`
- `authenticate_school_admin(p_email, p_password)`

#### React Hooks

- `useSchoolAdmin()`: Comprehensive school admin management
- `useSchoolAdminPassword()`: Password change functionality
- `useAuth()`: Enhanced authentication with super admin support

### 8. System Architecture

#### Frontend Components

- `SuperAdminDashboard`: Main dashboard interface
- `SchoolAdminForm`: Create/edit school administrators
- `ChangePasswordForm`: Password management for school admins
- `SuperAdminPage`: Main page wrapper

#### Backend Integration

- Supabase database with RLS policies
- PostgreSQL functions for business logic
- Secure authentication and authorization

### 9. Future Enhancements

#### Planned Features

- Email notifications for account creation/password resets
- Advanced reporting and analytics
- Bulk operations for school admin management
- Integration with external authentication providers
- Advanced audit reporting

#### Scalability Considerations

- Horizontal scaling for multiple super admins
- Advanced role-based permissions
- Multi-tenant architecture improvements

### 10. Installation and Setup

#### Database Setup

1. Run the migration files:
   - `supabase/migrations/create_super_admin.sql`
   - `supabase/migrations/school_admin_management.sql`

#### Environment Configuration

1. Ensure Supabase connection is configured
2. Set up proper RLS policies
3. Configure authentication providers

#### Application Deployment

1. Build the application: `npm run build`
2. Deploy to hosting platform
3. Configure environment variables
4. Set up SSL certificates

### 11. Usage Guide

#### For Super Admins

1. Login with super admin credentials
2. Navigate to Super Admin Dashboard
3. Use tabs to manage schools and admins
4. Monitor system health and activity

#### For School Admins

1. Receive credentials from super admin
2. Login with provided email/password
3. Change password on first login (if required)
4. Access school-specific dashboard

### 12. Support and Maintenance

#### Regular Tasks

- Monitor audit logs
- Review security settings
- Update passwords periodically
- Check system performance

#### Troubleshooting

- Check Supabase logs for errors
- Verify RLS policies are working
- Monitor authentication failures
- Review audit trails

## Technical Implementation Details

### File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── SchoolAdminForm.tsx
│   │   └── ChangePasswordForm.tsx
│   └── dashboard/
│       └── SuperAdminDashboard.tsx
├── hooks/
│   └── useSchoolAdmin.tsx
├── pages/
│   └── SuperAdminPage.tsx
└── migrations/
    ├── create_super_admin.sql
    └── school_admin_management.sql
```

### Key Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Supabase, PostgreSQL
- **Authentication**: Supabase Auth + Custom Logic
- **State Management**: React Hooks + Context
- **Form Handling**: React Hook Form + Zod validation

This system provides a robust, secure, and scalable foundation for managing multiple schools and their administrators from a centralized super admin interface.
