#!/bin/bash

# Database Reset Script for School Management System
# This script will completely reset the database and set up fresh tables

echo "🚀 Starting complete database reset..."

# Check if .env file exists and load it
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check for required environment variables
if [ -z "$DATABASE_URL" ] && [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ Error: No database URL found!"
    echo "Please set DATABASE_URL or SUPABASE_DB_URL in your environment variables."
    echo ""
    echo "For Supabase, you can find your database URL in:"
    echo "Project Settings > Database > Connection string > URI"
    echo ""
    echo "Example format:"
    echo "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
    exit 1
fi

# Use DATABASE_URL if available, otherwise use SUPABASE_DB_URL
DB_URL=${DATABASE_URL:-$SUPABASE_DB_URL}

echo "🔗 Using database URL: ${DB_URL%:*}:****@${DB_URL##*@}"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed!"
    echo "Please install PostgreSQL client tools:"
    echo "  - Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  - macOS: brew install postgresql"
    echo "  - Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Execute the SQL file
echo "📝 Executing database reset SQL..."
echo "⚠️  WARNING: This will DELETE ALL DATA in the database!"
echo "Are you sure you want to continue? (y/N)"
read -r confirmation

if [[ $confirmation =~ ^[Yy]$ ]]; then
    echo "🗑️  Proceeding with database reset..."
    
    if psql "$DB_URL" -f database-complete-reset.sql; then
        echo ""
        echo "🎉 Database reset completed successfully!"
        echo ""
        echo "✅ The following should now work:"
        echo "   - Super Admin Login: sujan1nepal@gmail.com / precioussn"
        echo "   - School creation through the application"
        echo "   - School admin creation after school registration"
        echo ""
        echo "📝 Next steps:"
        echo "   1. Test super admin login in your application"
        echo "   2. Create a test school through the UI"
        echo "   3. Create school admin accounts"
        echo "   4. Add students and teachers as needed"
        echo ""
        echo "🔧 If you encounter issues:"
        echo "   - Check the application logs"
        echo "   - Verify Supabase connection settings"
        echo "   - Ensure RLS policies are working correctly"
    else
        echo "❌ Database reset failed!"
        echo "Check the error messages above for details."
        exit 1
    fi
else
    echo "❌ Database reset cancelled."
    exit 0
fi
