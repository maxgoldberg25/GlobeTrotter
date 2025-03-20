import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// This is a one-time setup route for creating the admin user
// In a production environment, you would restrict this endpoint accordingly
export async function GET() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'test@gmail.com' },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      );
    }

    // Hash password - in this case, "Password"
    const hashedPassword = await bcrypt.hash('Password', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'test@gmail.com',
        hashedPassword,
        // You could add additional admin-specific fields here
      },
    });

    // Remove password from response
    const { hashedPassword: _, ...adminWithoutPassword } = admin;

    return NextResponse.json(
      { message: 'Admin user created successfully', user: adminWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { message: 'Error creating admin user' },
      { status: 500 }
    );
  }
} 