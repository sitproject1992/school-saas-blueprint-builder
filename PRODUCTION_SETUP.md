# Skooler - Production Setup Guide

## Overview

This guide will help you deploy Skooler in a real-world production environment. The system has been configured to work properly with:

- **Super Admin**: `sujan1nepal@gmail.com` (platform administrator)
- **School Registration**: Public school registration flow
- **School Admins**: Created through the registration process
- **School Users**: Teachers, students, parents managed by school admins

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Super Admin   │    │     Schools     │    │  School Users   │
│ sujan1nepal@... │    │   Registration  │    │ (Admin/Teacher/ │
│                 │    │      Flow       │    │ Student/Parent) │
│  - Manages all  │    │                 │    │                 │
│    schools      │    │ - Public form   │    │ - Managed by    │
│  - Creates      │    │ - Creates       │    │   school admin  │
│    school       │    │   school admin  │    │ - Role-based    │
│    admins       │    │ - 14-day trial  │    │   access        │
│  - Platform     │    │                 │    │                 │
│    oversight    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Database Setup

### 1. Apply Database Fixes

Run the database fix script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database-fix.sql
-- This ensures all required functions and tables exist
```

### 2. Verify Required Tables

Ensure these tables exist in your database:
- `schools` - School information
- `school_admin_accounts` - School administrator credentials
- `super_admins` - Platform administrators
- `profiles` - User profiles (legacy support)
- `subjects`, `classes`, etc. - School data

### 3. Create Super Admin Account

```sql
-- Create super admin entry (if not exists)
INSERT INTO super_admins (user_id, email, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'sujan1nepal@gmail.com',
    true
) ON CONFLICT (email) DO NOTHING;
```

## User Flows

### Super Admin Flow (sujan1nepal@gmail.com)

1. **Access**: Direct login with `sujan1nepal@gmail.com` / `precioussn`
2. **Dashboard**: `/super-admin` - Full system oversight
3. **Capabilities**:
   - View all schools
   - Manage school administrators
   - Create/edit/delete school admin accounts
   - Monitor system usage
   - Audit logs

### School Registration Flow (New Schools)

1. **Landing Page**: Clear paths for different user types
2. **Registration**: `/school-registration` - 5-step process
   - Basic school information
   - Contact details  
   - Admin information
   - School details
   - Subscription plan
3. **Admin Setup**: `/admin-setup` - Creates school admin account
4. **Optional Steps**: Teacher and student registration
5. **Result**: Functional school with admin access

### School User Access (Daily Users)

1. **School Admin Login**: Uses credentials from registration
2. **Teacher/Student/Parent**: Managed by school admin
3. **Demo Access**: Available via "Demo Access" tab

## Authentication System

### Priority Order

1. **Super Admin** - `sujan1nepal@gmail.com` with hardcoded credentials
2. **School Admin Accounts** - From `school_admin_accounts` table  
3. **Demo Accounts** - Pre-configured for testing
4. **Regular Supabase Auth** - Fallback for other users

### Error Handling

- Clear error messages guide users to appropriate paths
- Database connection issues fallback to demo access
- Invalid credentials provide helpful guidance

## Environment Configuration

### Required Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Production Settings

1. **Supabase Configuration**:
   - Enable Row Level Security (RLS)
   - Configure proper policies
   - Set up authentication providers

2. **Build Configuration**:
   ```bash
   npm run build
   # Produces optimized production build
   ```

## Security Considerations

### Password Management

- **Super Admin**: Hardcoded (change in production)
- **School Admins**: Stored in `school_admin_accounts` table
- **Production**: Implement proper password hashing

### Access Control

- Role-based permissions enforced
- RLS policies prevent cross-school data access
- Audit logging for super admin actions

### Data Protection

- All school data isolated by `school_id`
- Secure session management
- Input validation and sanitization

## Deployment Checklist

### Pre-Deployment

- [ ] Database migrations applied
- [ ] Super admin account created
- [ ] Environment variables configured
- [ ] Build process tested
- [ ] Authentication flows verified

### Post-Deployment

- [ ] Test school registration flow
- [ ] Verify super admin access
- [ ] Check demo accounts work
- [ ] Monitor error logs
- [ ] Test role-based access

## User Guide

### For Platform Administrator (Super Admin)

1. **Login**: Use `sujan1nepal@gmail.com` / `precioussn`
2. **Access**: `/super-admin` dashboard
3. **Manage Schools**: View all registered schools
4. **Manage Admins**: Create/edit school administrator accounts
5. **Monitor**: System usage and health

### For School Registration

1. **Start**: Visit landing page, click "Register Your School"
2. **Complete**: 5-step registration process
3. **Setup Admin**: Create administrator account
4. **Optional**: Add teachers and students
5. **Access**: Use admin credentials to manage school

### For School Users

1. **Admin**: Login with credentials from registration
2. **Teachers/Students/Parents**: Created by school admin
3. **Demo**: Use "Demo Access" tab for evaluation

## Maintenance

### Regular Tasks

- Monitor school registrations
- Review super admin audit logs
- Check system performance
- Update security settings
- Backup database regularly

### Support Procedures

- School admin password resets via super admin
- Technical issues via platform logs
- User guidance documentation
- Contact support escalation

## Scaling Considerations

### Multi-Tenant Architecture

- Each school isolated by `school_id`
- Horizontal scaling supported
- Database sharding possible

### Performance Optimization

- Implement caching strategies
- Optimize database queries
- Use CDN for static assets
- Monitor response times

## Troubleshooting

### Common Issues

1. **Database Connection**: Check Supabase credentials
2. **Registration Failures**: Verify database schema
3. **Authentication Errors**: Check RLS policies
4. **Permission Issues**: Verify role assignments

### Debug Steps

1. Check browser console for errors
2. Review Supabase logs
3. Verify environment variables
4. Test with demo accounts
5. Check database connectivity

## Next Steps

### Immediate Production Requirements

1. **Change Default Passwords**: Update super admin credentials
2. **Implement Proper Hashing**: Secure password storage
3. **Configure SSL**: HTTPS for all connections
4. **Set Up Monitoring**: Error tracking and alerts
5. **Create Backups**: Regular data backup strategy

### Future Enhancements

1. **Email Integration**: Welcome emails, notifications
2. **Payment Processing**: Subscription billing
3. **Mobile Apps**: Native iOS/Android apps
4. **Advanced Analytics**: Usage reporting
5. **Multi-Language**: Internationalization support

---

## Support

For technical support or questions:
- Check browser console for errors
- Review this documentation
- Contact platform administrator
- Use demo environment for testing

**Version**: 1.0.0  
**Last Updated**: January 2025
