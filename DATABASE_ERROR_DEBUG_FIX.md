# Database Error Debug Fix

## Problem
User encountered error: "Database error creating school: [object Object]"

This generic error message provided no useful information about the actual database issue.

## Root Cause
The error handling was not properly extracting detailed error information from Supabase error objects, resulting in unhelpful "[object Object]" messages.

## Solutions Implemented

### ✅ 1. Enhanced Error Handling
**File**: `src/hooks/useSchoolManagement.tsx`

**Before**:
```javascript
if (error) {
  throw new Error(`Failed to create school in database: ${error.message}`);
}
```

**After**:
```javascript
if (error) {
  console.error("Database error creating school:", error);
  // Extract detailed error information
  const errorMessage = error.message || error.details || error.hint || JSON.stringify(error);
  const errorCode = error.code || 'Unknown';
  throw new Error(`Failed to create school in database (${errorCode}): ${errorMessage}`);
}
```

### ✅ 2. Improved Catch Block Error Handling
**Before**:
```javascript
} catch (err) {
  const message = err instanceof Error ? err.message : "Failed to create school";
  setError(message);
  throw new Error(message);
}
```

**After**:
```javascript
} catch (err) {
  console.error("School creation error:", err);
  let message;
  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'object' && err !== null) {
    message = JSON.stringify(err);
  } else {
    message = String(err) || "Failed to create school";
  }
  setError(message);
  throw new Error(message);
}
```

### ✅ 3. Added Database Connection Testing
**New Function**:
```javascript
const testDatabaseConnection = async () => {
  try {
    console.log("Testing database connection...");
    const { data, error } = await supabase.from("schools").select("count").limit(1);
    console.log("Database test result:", { data, error });
    if (error) {
      console.error("Database connection test failed:", error);
      return false;
    }
    console.log("Database connection successful");
    return true;
  } catch (err) {
    console.error("Database connection test error:", err);
    return false;
  }
};
```

### ✅ 4. Added Detailed Logging
**Enhanced Insert Operation**:
```javascript
// Prepare insert data
const insertData = {
  name: data.name,
  subdomain: data.subdomain,
  email: data.email || null,
  phone: data.phone || null,
  address: data.address || null,
  website: data.website || null,
  subscription_status: data.subscriptionStatus,
  subscription_expires_at: data.subscriptionExpiresAt || null,
  theme_color: data.themeColor || "#3b82f6",
};

console.log("Creating school with data:", insertData);

const { data: dbSchool, error } = await supabase
  .from("schools")
  .insert(insertData)
  .select()
  .single();
  
console.log("Database response:", { dbSchool, error });
```

### ✅ 5. Added Database Test Button to UI
**Location**: Super Admin Dashboard Header
- **Button**: "Test Database" 
- **Function**: Tests database connectivity and reports success/failure
- **Purpose**: Quick way to verify database connection before attempting operations

## Debugging Steps Now Available

### 1. **Use Test Database Button**
- Login as super admin
- Click "Test Database" button in header
- Check for success/failure message
- Review browser console for detailed logs

### 2. **Enhanced Error Messages**
- Detailed error codes and messages
- Specific database error information
- Helpful hints for troubleshooting

### 3. **Console Logging**
- School creation data is logged before insertion
- Database responses are logged
- Connection test results are logged
- All errors are logged with full details

## Common Database Issues & Solutions

### Issue 1: Table Doesn't Exist
**Error**: `relation "schools" does not exist`
**Solution**: Run the database reset script:
```bash
# Option 1: Supabase Dashboard SQL Editor
# Copy contents of database-complete-reset.sql and run

# Option 2: Command line
export DATABASE_URL="your_supabase_url"
bash reset-database.sh
```

### Issue 2: Permission Denied
**Error**: `permission denied for table schools`
**Solution**: 
- Check RLS policies are set correctly
- Verify using service role key (not anon key)
- Ensure super admin is in super_admins table

### Issue 3: Column Does Not Exist
**Error**: `column "subscription_status" does not exist`
**Solution**: Database schema is outdated, run reset script

### Issue 4: Invalid UUID
**Error**: `invalid input syntax for type uuid`
**Solution**: Already fixed - using crypto.randomUUID()

## Testing the Fix

1. **Login as Super Admin**: `sujan1nepal@gmail.com` / `precioussn`
2. **Click "Test Database"**: Should show success message
3. **Try Creating School**: Should now show detailed error if it fails
4. **Check Browser Console**: Look for detailed logging information
5. **Review Error Messages**: Should be specific and actionable

## Next Steps If Issues Persist

1. **Check Console Logs**: Look for specific error details
2. **Verify Database Schema**: Ensure all tables exist
3. **Check Supabase Settings**: Verify URL and keys are correct
4. **Test with Simple Query**: Use database test button
5. **Review RLS Policies**: Ensure proper access permissions

The enhanced error handling will now provide specific, actionable error messages instead of generic "[object Object]" errors, making debugging much easier.
