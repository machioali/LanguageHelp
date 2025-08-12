import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CLIENT', 'INTERPRETER']).optional().default('CLIENT'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
