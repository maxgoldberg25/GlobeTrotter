#!/usr/bin/env node

/**
 * This script checks if the admin user exists in the database and helps diagnose
 * authentication issues with the admin account.
 * 
 * Run with: node scripts/check-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking admin user in database...');
    
    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'test@gmail.com',
      },
    });

    if (!adminUser) {
      console.error('❌ Admin user not found in database!');
      console.log('Run: node scripts/setup-admin.js to create the admin user.');
      return;
    }

    console.log('✅ Admin user found in database:');
    console.log(`- ID: ${adminUser.id}`);
    console.log(`- Name: ${adminUser.name || 'Not set'}`);
    console.log(`- Email: ${adminUser.email}`);
    console.log(`- Has password set: ${adminUser.hashedPassword ? 'Yes' : 'No'}`);
    console.log(`- Created at: ${adminUser.createdAt}`);

    // Verify password
    if (adminUser.hashedPassword) {
      // Test if "Password" works
      const correctPassword = await bcrypt.compare('Password', adminUser.hashedPassword);
      
      if (correctPassword) {
        console.log('✅ Password verification successful! "Password" is the correct password.');
      } else {
        console.error('❌ Password verification failed! "Password" is NOT the correct password.');
        
        // Create a new password hash for comparison
        const newHash = await bcrypt.hash('Password', 10);
        console.log('\nDebug info:');
        console.log(`Stored password hash: ${adminUser.hashedPassword}`);
        console.log(`Generated password hash for "Password": ${newHash}`);
        
        // Option to reset
        console.log('\nTo reset the admin password to "Password", run:');
        console.log('node scripts/reset-admin-password.js');
      }
    } else {
      console.error('❌ Admin user has no password set!');
      console.log('Run: node scripts/reset-admin-password.js to set a password for this user.');
    }
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 