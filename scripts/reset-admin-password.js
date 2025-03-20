#!/usr/bin/env node

/**
 * This script resets the admin user password to "Password"
 * Run with: node scripts/reset-admin-password.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Resetting admin password...');
    
    // Find admin user
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'test@gmail.com',
      },
    });

    if (!adminUser) {
      console.error('❌ Admin user not found!');
      console.log('Run: node scripts/setup-admin.js first to create the admin user.');
      return;
    }

    // Generate new password hash
    const hashedPassword = await bcrypt.hash('Password', 10);
    
    // Update user with new password
    await prisma.user.update({
      where: {
        id: adminUser.id,
      },
      data: {
        hashedPassword,
      },
    });
    
    console.log('✅ Admin password reset successfully!');
    console.log('\nAdmin user details:');
    console.log('- Email: test@gmail.com');
    console.log('- Password: Password');
    console.log('\nYou can now log in with these credentials.');
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 