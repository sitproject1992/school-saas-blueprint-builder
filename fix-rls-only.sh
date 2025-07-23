#!/bin/bash

# Fix RLS Policies Script
# This script fixes the RLS policies without resetting the entire database

echo "🔧 Fixing RLS policies for school management system..."

# Check if .env file exists and load it
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check for required environment variables
if [ -z "$DATABASE_URL" ] && [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ Error: No database URL found!"
    echo "Please set DATABASE_URL or SUPABASE_DB_URL in your environment variables."
    exit 1
fi

# Use DATABASE_URL if available, otherwise use SUPABASE_DB_URL
DB_URL=${DATABASE_URL:-$SUPABASE_DB_URL}

echo "🔗 Using database URL: ${DB_URL%:*}:****@${DB_URL##*@}"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed!"
    echo "Please install PostgreSQL client tools or use Supabase Dashboard SQL Editor"
    echo "Copy the contents of fix-rls-policies.sql and run it in SQL Editor"
    exit 1
fi

# Execute the RLS fix
echo "🔒 Fixing RLS policies..."
echo "This will update the Row Level Security policies to work with custom authentication."

if psql "$DB_URL" -f fix-rls-policies.sql; then
    echo ""
    echo "🎉 RLS policies fixed successfully!"
    echo ""
    echo "✅ You should now be able to create schools without RLS policy errors."
    echo ""
    echo "📝 Next steps:"
    echo "   1. Try creating a school again"
    echo "   2. Check that school creation works"
    echo "   3. Verify school appears in the list"
else
    echo "❌ Failed to fix RLS policies!"
    echo "You can manually run the SQL commands from fix-rls-policies.sql"
    echo "in your Supabase Dashboard SQL Editor"
    exit 1
fi
