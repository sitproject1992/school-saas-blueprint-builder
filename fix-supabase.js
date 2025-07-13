#!/usr/bin/env node

/**
 * Supabase 401 Error Fix Script
 * 
 * This script helps you quickly fix the "Invalid API key" error
 * by guiding you through the Supabase setup process.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Supabase 401 Error Fix Guide\n');

console.log('🚨 You\'re getting a 401 error because:');
console.log('   • Supabase project doesn\'t exist, OR');
console.log('   • Database hasn\'t been set up, OR');
console.log('   • Credentials are incorrect\n');

console.log('📋 Quick Fix Steps:\n');

console.log('1. 🌐 Create Supabase Project:');
console.log('   • Go to https://supabase.com');
console.log('   • Sign up/Login to your account');
console.log('   • Click "New Project"');
console.log('   • Enter project name (e.g., "school-management")');
console.log('   • Set database password');
console.log('   • Choose region close to you');
console.log('   • Click "Create new project"\n');

console.log('2. 🔑 Get Your Credentials:');
console.log('   • Go to Project Settings → API');
console.log('   • Copy Project URL (https://your-project-id.supabase.co)');
console.log('   • Copy anon public key (starts with eyJ...)\n');

console.log('3. 📝 Create .env file:');
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('   • Copy .env.example to .env');
  console.log('   • Update with your credentials:');
  console.log('     VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('     VITE_SUPABASE_ANON_KEY=your-anon-key-here\n');
} else {
  console.log('   ✅ .env file exists');
  console.log('   • Update with your new credentials\n');
}

console.log('4. 🗄️ Set Up Database:');
console.log('   • Go to SQL Editor in Supabase dashboard');
console.log('   • Create new query');
console.log('   • Copy contents of database-setup.sql');
console.log('   • Click "Run" to create all tables\n');

console.log('5. 🔄 Restart Development Server:');
console.log('   • Stop current server (Ctrl+C)');
console.log('   • Run: npm run dev');
console.log('   • Check browser console for connection status\n');

console.log('6. ✅ Test Registration:');
console.log('   • Go to /school-registration');
console.log('   • Try registering a new school');
console.log('   • Should work without 401 errors\n');

console.log('📚 Additional Resources:');
console.log('   • Detailed guide: SUPABASE_SETUP.md');
console.log('   • Database setup: database-setup.sql');
console.log('   • Test script: test-registration.js\n');

console.log('🐛 Common Issues:');
console.log('   • Wrong API key: Use "anon public" not "service_role"');
console.log('   • Database not set up: Run database-setup.sql');
console.log('   • Environment not loaded: Restart dev server');
console.log('   • Project inactive: Check Supabase dashboard\n');

console.log('🎯 Ready to fix the 401 error?');
console.log('   Follow the steps above and you\'ll be up and running!');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('\n💡 Tip: Create .env file first:');
  console.log('   cp .env.example .env');
  console.log('   Then update with your Supabase credentials');
}