import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rasntdekaogpvyyzmmiz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhc250ZGVrYW9ncHZ5eXptbWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjY1NDUsImV4cCI6MjA2NzkwMjU0NX0.cLvOusc69uWFC0XeN1RxdswxKedmdTJm6OHAMcrsUtU'
);

const SUPER_ADMIN_EMAIL = 'superadmin@skooler.com';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin@2025';

async function createSuperAdmin() {
  console.log('Creating Super Admin user...');
  
  try {
    // First check if user already exists by trying to sign in
    const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD
    });

    if (existingUser.user && !signInError) {
      console.log('✅ Super Admin already exists and login works!');
      console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
      console.log(`Password: ${SUPER_ADMIN_PASSWORD}`);
      
      // Sign out after testing
      await supabase.auth.signOut();
      return;
    }

    // Try to create the user with email confirmation disabled
    console.log('Creating new super admin user...');
    const { data, error } = await supabase.auth.signUp({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      options: {
        emailRedirectTo: undefined,
        data: {
          role: 'super_admin'
        }
      }
    });

    if (error) {
      console.error('❌ Error creating super admin:', error.message);
      
      // If it's a duplicate email error, the user might exist but with different password
      if (error.message.includes('already') || error.message.includes('duplicate')) {
        console.log('🔍 User might exist with different password. Trying alternative approach...');
        
        // Let's try to create a profile manually for this user
        console.log('📧 Please check Supabase Auth dashboard to confirm user exists');
        console.log('If user exists, try logging in with these credentials:');
        console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
        console.log(`Password: ${SUPER_ADMIN_PASSWORD}`);
      }
      return;
    }

    if (data.user) {
      console.log('✅ Super Admin user created successfully!');
      console.log(`User ID: ${data.user.id}`);
      console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
      console.log(`Password: ${SUPER_ADMIN_PASSWORD}`);
      
      // Try to create profile (this might fail due to RLS, but that's okay)
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            first_name: 'Super',
            last_name: 'Admin', 
            email: SUPER_ADMIN_EMAIL,
            role: 'super_admin'
          });

        if (profileError) {
          console.log('⚠️  Profile creation failed (this is expected due to RLS):', profileError.message);
        } else {
          console.log('✅ Profile created successfully!');
        }
      } catch (profileErr) {
        console.log('⚠️  Profile creation failed (this is expected)');
      }

      // Try to assign role (this might fail due to RLS, but that's okay)
      try {
        // Get super_admin role ID
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'super_admin')
          .single();

        if (roleData) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: roleData.id
            });

          if (roleError) {
            console.log('⚠️  Role assignment failed (this is expected due to RLS):', roleError.message);
          } else {
            console.log('✅ Role assigned successfully!');
          }
        }
      } catch (roleErr) {
        console.log('⚠️  Role assignment failed (this is expected)');
      }

      console.log('\n🎉 You can now use these credentials to login:');
      console.log(`📧 Email: ${SUPER_ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${SUPER_ADMIN_PASSWORD}`);
      console.log('\n📝 Note: You may need to manually confirm the email in Supabase dashboard if email confirmation is required.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createSuperAdmin();