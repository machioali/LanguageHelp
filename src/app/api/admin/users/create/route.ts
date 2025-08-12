import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/utils/credentials';
import { UserRole } from '@/lib/constants';
import type { UserRoleType } from '@/lib/constants';

// Validation schema for creating admin users
const createAdminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']).default('ADMIN'),
});

// POST /api/admin/users/create - Create new admin user
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if ((token.role as UserRoleType) !== UserRole.ADMIN && (token.role as UserRoleType) !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Additional security: Only allow specific admin email
    const AUTHORIZED_ADMIN_EMAIL = 'machio2024@hotmail.com';
    if (token.email !== AUTHORIZED_ADMIN_EMAIL) {
      console.log(`[SECURITY ALERT] Unauthorized admin user creation attempt: ${token.email}`);
      return NextResponse.json(
        { error: 'Unauthorized admin access' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = createAdminUserSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Create the admin user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        name: validatedData.name,
        password: hashedPassword,
        role: validatedData.role,
        emailVerified: new Date(), // Mark as verified since it's created by admin
      }
    });
    
    // Return success response (don't include password hash)
    const responseData = {
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      },
    };
    
    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error('Create admin user error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// GET /api/admin/users/create - Get current admin info (for validation)
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if ((token.role as UserRoleType) !== UserRole.ADMIN && (token.role as UserRoleType) !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Return current admin info
    return NextResponse.json({
      currentAdmin: {
        email: token.email,
        name: token.name,
        role: token.role,
      },
      permissions: {
        canCreateAdmin: true,
        canCreateSuperAdmin: token.role === 'SUPER_ADMIN',
      }
    });
    
  } catch (error) {
    console.error('Get admin info error:', error);
    return NextResponse.json(
      { error: 'Failed to get admin info' },
      { status: 500 }
    );
  }
}
