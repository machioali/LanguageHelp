import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    console.log('🧪 Testing subscription API endpoint...');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', { 
      exists: !!session, 
      userId: session?.user?.id,
      userRole: session?.user?.role,
      userEmail: session?.user?.email 
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'No session found',
        debug: 'User not authenticated'
      }, { status: 401 });
    }

    if (session.user.role !== 'CLIENT') {
      return NextResponse.json({
        success: false,
        error: 'Not a client user',
        debug: `User role is: ${session.user.role}`
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication working!',
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        name: session.user.name
      }
    });

  } catch (error) {
    console.error('Test subscription API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      debug: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing POST to subscription API...');
    
    const body = await request.json();
    console.log('Request body:', body);

    const session = await getServerSession(authOptions);
    console.log('Session check:', { exists: !!session, role: session?.user?.role });

    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        debug: `Session: ${!!session}, Role: ${session?.user?.role}`
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'POST test successful!',
      receivedPlanId: body.planId,
      user: session.user.id
    });

  } catch (error) {
    console.error('Test POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      debug: error.message
    }, { status: 500 });
  }
}
