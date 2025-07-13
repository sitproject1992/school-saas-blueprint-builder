# Supabase Setup Guide

## ✅ Your Supabase Configuration

Your Supabase project is already configured with the following credentials:

- **Project URL**: `https://rasntdekaogpvyyzmmiz.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhc250ZGVrYW9ncHZ5eXptbWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjY1NDUsImV4cCI6MjA2NzkwMjU0NX0.cLvOusc69uWFC0XeN1RxdswxKedmdTJm6OHAMcrsUtU`

## 🚀 Quick Start

### 1. Test Your Connection

Run the test script to verify everything is working:

```bash
node test-backend-systems.js
```

### 2. Set Up Environment Variables (Optional)

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://rasntdekaogpvyyzmmiz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhc250ZGVrYW9ncHZ5eXptbWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjY1NDUsImV4cCI6MjA2NzkwMjU0NX0.cLvOusc69uWFC0XeN1RxdswxKedmdTJm6OHAMcrsUtU
```

### 3. Database Setup

If you haven't set up the database yet, run the SQL migration:

```bash
# Copy the database-setup.sql content and run it in your Supabase SQL editor
# Or use the Supabase CLI if you have it installed
```

## 🔧 Backend Systems Status

### ✅ Working Systems

1. **Multi-Tenant Architecture**
   - Subdomain routing: `demo.skooler.com` → Demo School
   - Role-based access control
   - Data isolation per school

2. **Super Admin Portal** (`/schools`)
   - School management interface
   - System-wide analytics
   - User management across schools

3. **Payment System** (`/payments`)
   - Payment recording and tracking
   - Revenue analytics
   - Multiple payment methods

4. **Communication System** (`/messages`)
   - Real-time messaging
   - Announcement system
   - Conversation management

### 🎯 Demo Credentials

Use these credentials to test the system:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@skooler.com` | `super123` |
| School Admin | `admin@skooler.com` | `admin123` |
| Teacher | `teacher@skooler.com` | `teacher123` |
| Student | `student@skooler.com` | `student123` |
| Parent | `parent@skooler.com` | `parent123` |

## 📊 Testing Your Backend Systems

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Each System

#### Super Admin Portal
1. Login with `superadmin@skooler.com` / `super123`
2. Navigate to `/schools`
3. Test school creation and management

#### Payment System
1. Login with any admin account
2. Navigate to `/payments`
3. Test payment recording and analytics

#### Communication System
1. Login with any account
2. Navigate to `/messages`
3. Test messaging and announcements

### 3. Multi-Tenant Testing

Test subdomain routing:
- `localhost:5173` → Demo school (development)
- `school1.skooler.com` → School 1 (production)
- `school2.skooler.com` → School 2 (production)

## 🔍 Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**
   - Check if RLS policies are properly set up
   - Verify user authentication status
   - Ensure proper role assignments

2. **Database Connection Issues**
   - Verify Supabase URL and key are correct
   - Check if database tables exist
   - Ensure RLS policies are configured

3. **Missing Tables**
   - Run the database migration script
   - Check Supabase dashboard for table creation
   - Verify table permissions

### Debug Commands

```bash
# Test database connection
node test-backend-systems.js

# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# View browser console for connection logs
# Look for "✅ Supabase connection successful"
```

## 🚀 Production Deployment

### Environment Variables

Set these in your production environment:

```env
VITE_SUPABASE_URL=https://rasntdekaogpvyyzmmiz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhc250ZGVrYW9ncHZ5eXptbWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjY1NDUsImV4cCI6MjA2NzkwMjU0NX0.cLvOusc69uWFC0XeN1RxdswxKedmdTJm6OHAMcrsUtU
```

### Domain Configuration

For production subdomain routing:
1. Configure DNS for `*.skooler.com`
2. Set up SSL certificates
3. Configure your hosting provider for subdomain routing

## 📈 Monitoring

### Supabase Dashboard

Monitor your application:
- **Database**: Check table data and performance
- **Auth**: Monitor user sign-ups and sessions
- **Logs**: View real-time logs and errors
- **Storage**: Manage file uploads and storage

### Application Metrics

Track these key metrics:
- User authentication success rate
- Database query performance
- Payment processing success
- Message delivery rates

## 🎯 Next Steps

1. **Test All Systems**: Run the test script and verify functionality
2. **Set Up Production**: Configure domain and SSL certificates
3. **Add Real Data**: Create actual schools and users
4. **Monitor Performance**: Set up monitoring and alerts
5. **Scale Up**: Add more schools and users as needed

---

**Need Help?** Check the console logs for detailed error messages and refer to the troubleshooting section above.