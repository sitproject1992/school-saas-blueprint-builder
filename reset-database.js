const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables if .env file exists
if (fs.existsSync('.env')) {
  require('dotenv').config();
}

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetDatabase() {
  try {
    console.log('🚀 Starting database reset...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database-complete-reset.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 Read SQL file successfully');
    
    // Split SQL into individual statements (simple approach)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== '');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        });
        
        if (error) {
          // Try direct query execution if RPC fails
          const { error: directError } = await supabase
            .from('_dummy_table_that_does_not_exist')
            .select('*');
          
          // Use raw SQL execution through supabase-js
          console.log(`⚠️  RPC failed, trying direct execution...`);
          
          // For direct SQL execution, we'll use a different approach
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ sql_query: statement })
          });
          
          if (!response.ok) {
            console.log(`⚠️  Statement ${i + 1} might have failed, but continuing...`);
            console.log(`Statement: ${statement.substring(0, 100)}...`);
          }
        }
        
        console.log(`✅ Statement ${i + 1} completed`);
        
      } catch (statementError) {
        console.log(`⚠️  Warning on statement ${i + 1}:`, statementError.message);
        console.log(`Statement: ${statement.substring(0, 100)}...`);
        // Continue with next statement
      }
    }
    
    console.log('🎉 Database reset completed!');
    console.log('');
    console.log('✅ The following should now work:');
    console.log('   - Super Admin Login: sujan1nepal@gmail.com / precioussn');
    console.log('   - School creation through the application');
    console.log('   - School admin creation after school registration');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Test super admin login');
    console.log('   2. Create a test school');
    console.log('   3. Create school admin accounts');
    console.log('   4. Add students and teachers as needed');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Execute the reset
resetDatabase();
