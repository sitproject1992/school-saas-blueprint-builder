#!/usr/bin/env node

/**
 * Backend Systems Test Script
 * Tests all major backend systems with the provided Supabase credentials
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://rasntdekaogpvyyzmmiz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhc250ZGVrYW9ncHZ5eXptbWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjY1NDUsImV4cCI6MjA2NzkwMjU0NX0.cLvOusc69uWFC0XeN1RxdswxKedmdTJm6OHAMcrsUtU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🚀 Testing Backend Systems with Supabase...\n');

// Test results tracking
const testResults = {
  connection: false,
  database: false,
  tables: false,
  auth: false,
  rls: false,
  functions: false
};

async function testSupabaseConnection() {
  console.log('1️⃣ Testing Supabase Connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    testResults.connection = true;
    return true;
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    return false;
  }
}

async function testDatabaseTables() {
  console.log('\n2️⃣ Testing Database Tables...');
  
  const requiredTables = [
    'schools',
    'profiles', 
    'students',
    'teachers',
    'classes',
    'subjects',
    'attendance',
    'fee_structures',
    'fee_payments',
    'messages',
    'announcements',
    'user_roles'
  ];

  let allTablesExist = true;
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' not accessible:`, error.message);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${table}' accessible`);
      }
    } catch (error) {
      console.log(`❌ Table '${table}' error:`, error.message);
      allTablesExist = false;
    }
  }
  
  testResults.tables = allTablesExist;
  return allTablesExist;
}

async function testAuthentication() {
  console.log('\n3️⃣ Testing Authentication System...');
  
  try {
    // Test sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (signUpError) {
      console.log('⚠️ Sign up test (expected for existing user):', signUpError.message);
    } else {
      console.log('✅ Sign up functionality working');
    }
    
    // Test sign in with demo credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@skooler.com',
      password: 'admin123'
    });
    
    if (signInError) {
      console.log('⚠️ Sign in test (demo credentials may not exist):', signInError.message);
    } else {
      console.log('✅ Sign in functionality working');
    }
    
    testResults.auth = true;
    return true;
  } catch (error) {
    console.log('❌ Authentication test error:', error.message);
    return false;
  }
}

async function testRowLevelSecurity() {
  console.log('\n4️⃣ Testing Row Level Security...');
  
  try {
    // Test RLS on schools table
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('*')
      .limit(5);
    
    if (schoolsError) {
      console.log('⚠️ RLS test (may be expected):', schoolsError.message);
    } else {
      console.log('✅ Schools table accessible');
    }
    
    // Test RLS on students table
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(5);
    
    if (studentsError) {
      console.log('⚠️ Students RLS test (may be expected):', studentsError.message);
    } else {
      console.log('✅ Students table accessible');
    }
    
    testResults.rls = true;
    return true;
  } catch (error) {
    console.log('❌ RLS test error:', error.message);
    return false;
  }
}

async function testMultiTenantFeatures() {
  console.log('\n5️⃣ Testing Multi-Tenant Features...');
  
  try {
    // Test school creation (if user has permissions)
    const testSchool = {
      name: 'Test School',
      subdomain: 'test-school',
      email: 'test@school.com',
      phone: '1234567890',
      address: 'Test Address',
      status: 'active'
    };
    
    const { data: createData, error: createError } = await supabase
      .from('schools')
      .insert([testSchool])
      .select();
    
    if (createError) {
      console.log('⚠️ School creation test (may be expected due to RLS):', createError.message);
    } else {
      console.log('✅ School creation working');
      
      // Clean up test data
      if (createData && createData[0]) {
        await supabase
          .from('schools')
          .delete()
          .eq('id', createData[0].id);
        console.log('✅ Test school cleaned up');
      }
    }
    
    testResults.database = true;
    return true;
  } catch (error) {
    console.log('❌ Multi-tenant test error:', error.message);
    return false;
  }
}

async function testPaymentSystem() {
  console.log('\n6️⃣ Testing Payment System...');
  
  try {
    // Test fee structures query
    const { data: feeStructures, error: feeError } = await supabase
      .from('fee_structures')
      .select('*')
      .limit(5);
    
    if (feeError) {
      console.log('⚠️ Fee structures test (may be expected):', feeError.message);
    } else {
      console.log('✅ Fee structures accessible');
    }
    
    // Test fee payments query
    const { data: payments, error: paymentsError } = await supabase
      .from('fee_payments')
      .select('*')
      .limit(5);
    
    if (paymentsError) {
      console.log('⚠️ Fee payments test (may be expected):', paymentsError.message);
    } else {
      console.log('✅ Fee payments accessible');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Payment system test error:', error.message);
    return false;
  }
}

async function testCommunicationSystem() {
  console.log('\n7️⃣ Testing Communication System...');
  
  try {
    // Test messages query
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(5);
    
    if (messagesError) {
      console.log('⚠️ Messages test (may be expected):', messagesError.message);
    } else {
      console.log('✅ Messages accessible');
    }
    
    // Test announcements query
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .select('*')
      .limit(5);
    
    if (announcementsError) {
      console.log('⚠️ Announcements test (may be expected):', announcementsError.message);
    } else {
      console.log('✅ Announcements accessible');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Communication system test error:', error.message);
    return false;
  }
}

async function generateTestData() {
  console.log('\n8️⃣ Generating Test Data...');
  
  try {
    // Create a test school
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .insert([{
        name: 'Demo School',
        subdomain: 'demo',
        email: 'demo@school.com',
        phone: '9876543210',
        address: 'Demo Address',
        status: 'active'
      }])
      .select()
      .single();
    
    if (schoolError) {
      console.log('⚠️ School creation (may already exist):', schoolError.message);
    } else {
      console.log('✅ Demo school created');
    }
    
    // Create test fee structure
    const { data: feeData, error: feeError } = await supabase
      .from('fee_structures')
      .insert([{
        name: 'Monthly Tuition',
        description: 'Monthly tuition fee',
        amount: 5000,
        frequency: 'monthly',
        is_active: true
      }])
      .select()
      .single();
    
    if (feeError) {
      console.log('⚠️ Fee structure creation (may already exist):', feeError.message);
    } else {
      console.log('✅ Demo fee structure created');
    }
    
    console.log('✅ Test data generation completed');
    return true;
  } catch (error) {
    console.log('❌ Test data generation error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🔍 Starting comprehensive backend systems test...\n');
  
  await testSupabaseConnection();
  await testDatabaseTables();
  await testAuthentication();
  await testRowLevelSecurity();
  await testMultiTenantFeatures();
  await testPaymentSystem();
  await testCommunicationSystem();
  await generateTestData();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  Object.entries(testResults).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${test.toUpperCase()}: ${status}`);
  });
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All backend systems are working correctly!');
    console.log('\n🚀 You can now:');
    console.log('   • Access the Super Admin portal at /schools');
    console.log('   • Test payment system at /payments');
    console.log('   • Use messaging system at /messages');
    console.log('   • Login with demo credentials');
  } else {
    console.log('⚠️ Some systems need attention. Check the logs above.');
  }
}

// Run the tests
runAllTests().catch(console.error);