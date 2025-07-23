# Skooler Authentication Guide

## Overview

This guide helps you understand the different ways to log into Skooler and troubleshoot common authentication issues.

## Authentication Methods

Skooler supports multiple authentication methods in the following priority order:

### 1. 🔧 Super Admin (Platform Administrator)
- **Email**: `sujan1nepal@gmail.com`
- **Use Case**: Platform management and oversight
- **Access**: Full system control across all schools
- **Dashboard**: `/super-admin`

### 2. 🏫 School Administrators
- **Credentials**: Provided during school registration process
- **Use Case**: Managing individual school operations
- **Access**: School-specific administration
- **Dashboard**: Role-based school dashboard

### 3. 🎭 Demo Accounts
- **Access Method**: Use "Demo Access" tab on login page
- **Use Case**: Evaluating the system features
- **Available Accounts**:
  - `admin@skooler.com` (password: `admin123`) - School Admin
  - `teacher@skooler.com` (password: `teacher123`) - Teacher
  - `student@skooler.com` (password: `student123`) - Student  
  - `parent@skooler.com` (password: `parent123`) - Parent

### 4. 👥 School Users (Teachers, Students, Parents)
- **Credentials**: Created by school administrators
- **Use Case**: Daily school operations
- **Access**: Role-based access within specific school

## Common Login Issues

### "Login failed. Please check your email and password."

This error occurs when your credentials don't match any of the supported authentication methods.

**Solutions:**

1. **Check your user type**:
   - Super Admin? Use `sujan1nepal@gmail.com`
   - School Admin? Use credentials from registration
   - Demo user? Use the "Demo Access" tab
   - School user? Contact your school administrator

2. **Verify email format**:
   - Ensure no extra spaces
   - Check for typos
   - Use lowercase for consistency

3. **Check password**:
   - Verify caps lock is off
   - Ensure no extra spaces
   - Use exact password provided

### "Database error querying schema"

This indicates a database connectivity issue.

**Solutions:**

1. Try again in a few moments
2. Use demo accounts for immediate access
3. Contact support if issue persists

### "Invalid password for demo account"

You're using a demo email with the wrong password.

**Solutions:**

1. Use the "Demo Access" tab for one-click login
2. Use correct demo passwords:
   - admin@skooler.com: `admin123`
   - teacher@skooler.com: `teacher123`
   - student@skooler.com: `student123`
   - parent@skooler.com: `parent123`

## Getting Started

### New Schools
1. Visit the homepage
2. Click "Register Your School"
3. Complete the 5-step registration
4. Set up your admin account
5. Use admin credentials to log in

### School Users
1. Contact your school administrator
2. Get your login credentials
3. Use the main "Sign In" option
4. Access your role-specific dashboard

### Demo/Evaluation
1. Go to the login page
2. Click "Demo Access" tab
3. Choose your role
4. Click "Try as [Role]"

## Troubleshooting Steps

1. **Identify your user type**:
   - Platform admin (sujan1nepal@gmail.com)
   - School admin (from registration)
   - Demo user (evaluation)
   - School user (created by admin)

2. **Use correct login method**:
   - Super admin: Direct login
   - School admin: Main login form
   - Demo: "Demo Access" tab
   - School users: Main login form

3. **Verify credentials**:
   - Check email spelling
   - Verify password accuracy
   - Ensure no extra characters

4. **Check browser console**:
   - Open Developer Tools (F12)
   - Look for error messages
   - Share errors with support

## Error Messages and Solutions

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "No authentication method found" | Credentials don't match any system | Check user type and use correct method |
| "Invalid password for school admin" | Wrong password for school admin email | Use password from registration or reset |
| "Invalid password for demo account" | Wrong demo password | Use Demo Access tab or correct password |
| "Database connection issue" | Server connectivity problem | Wait and retry, or use demo access |

## Contact Support

If you continue experiencing issues:

1. **Check this guide first**
2. **Try demo accounts** to verify system works
3. **Contact your school administrator** for school-specific issues
4. **Reach out to platform support** for technical issues

## Admin Actions

### School Administrators Can:
- Reset passwords for school users
- Create new user accounts
- Manage school-specific settings
- Contact super admin for account issues

### Super Administrator Can:
- Reset school admin passwords
- Create new school admin accounts
- Manage all schools
- Resolve technical issues

---

**Last Updated**: January 2025  
**Version**: 1.0.0
