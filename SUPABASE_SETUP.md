# Supabase Setup Guide

## 🚨 **Error: 401 Unauthorized**

If you're seeing this error:
```
Failed to load resource: the server responded with a status of 401 ()
Error: Invalid API key
```

It means your Supabase project isn't set up or the credentials are incorrect.

## 🔧 **Quick Fix Steps**

### **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** to your account
3. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name (e.g., "school-management")
   - Set a database password
   - Choose a region close to you
   - Click "Create new project"

### **Step 2: Get Your Credentials**

1. **Go to Project Settings**:
   - Click on your project
   - Go to Settings → API
2. **Copy the credentials**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (long string)

### **Step 3: Update Environment Variables**

1. **Create `.env` file** in your project root:
```bash
cp .env.example .env
```

2. **Edit `.env` file**:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Replace with your actual credentials** from Step 2

### **Step 4: Set Up Database**

1. **Go to SQL Editor** in your Supabase dashboard
2. **Create a new query**
3. **Copy and paste** the contents of `database-setup.sql`
4. **Click "Run"** to create all tables and policies

### **Step 5: Test Connection**

1. **Restart your development server**:
```bash
npm run dev
```

2. **Check browser console** for connection status
3. **Try registering a school** again

## ✅ **Verification Checklist**

- [ ] Supabase project created
- [ ] Credentials copied correctly
- [ ] `.env` file created with correct values
- [ ] Database setup script run successfully
- [ ] Development server restarted
- [ ] No 401 errors in console
- [ ] School registration works

## 🐛 **Common Issues**

### **Issue: Still getting 401 errors**
**Solution**: 
- Double-check your credentials in `.env`
- Ensure the database setup script was run
- Check that your project is active in Supabase

### **Issue: "Invalid API key" error**
**Solution**:
- Verify you're using the `anon public` key, not the `service_role` key
- Make sure the key starts with `eyJ`

### **Issue: Tables don't exist**
**Solution**:
- Run the `database-setup.sql` script again
- Check the SQL Editor for any error messages

### **Issue: Environment variables not loading**
**Solution**:
- Restart your development server after creating `.env`
- Ensure `.env` is in the project root (same level as `package.json`)

## 📞 **Need Help?**

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Verify your Supabase project** is active and running
3. **Test with demo credentials** first:
   - Email: `admin@skooler.com`
   - Password: `admin123`

## 🎯 **Next Steps**

Once the 401 error is fixed:

1. **Test the registration flow** with a new school
2. **Add teachers and students** through the registration process
3. **Access the dashboard** with the created credentials
4. **Explore all features** of the school management system

---

**Last Updated**: January 2025
**Status**: Ready for production use