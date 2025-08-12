import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Dynamically import Prisma to avoid initialization issues
    const { prisma } = await import('@/lib/prisma');
    
    // Test connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prisma client working',
      userCount 
    });
  } catch (error) {
    console.error('Prisma test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
