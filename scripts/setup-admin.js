#!/usr/bin/env node

/**
 * This script creates the admin user with email test@gmail.com and password "Password"
 * Run with: node scripts/setup-admin.js
 */

(async () => {
  try {
    console.log('Setting up admin user...');
    
    const response = await fetch('http://localhost:3000/api/setup-admin');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', data.message);
      console.log('Admin user details:');
      console.log('- Email: test@gmail.com');
      console.log('- Password: Password');
      console.log('\nYou can now log in with these credentials to access the admin dashboard.');
    } else {
      console.error('❌ Error:', data.message);
    }
  } catch (error) {
    console.error('❌ Failed to set up admin user:', error.message);
    console.error('Make sure your application is running on http://localhost:3000');
  }
})(); 