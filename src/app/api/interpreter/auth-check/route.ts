import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';

// GET /api/interpreter/auth-check - Simple auth check for debugging
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Auth check API called');
    console.log(
      '📋 All cookies:',
      request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
    );

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    console.log('🍪 Auth token present:', !!token);
    console.log('🍪 Token length:', token?.length);

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No auth token found',
        cookies: request.cookies.getAll().map(c => c.name),
        debug: {
          cookieCount: request.cookies.getAll().length,
          userAgent: request.headers.get('user-agent'),
        }
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyJWTToken(token);
      console.log('✅ Token decoded:', {
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email
      });
    } catch (tokenError) {
      if (tokenError instanceof Error) {
        console.log('❌ Token verification failed:', tokenError.message);
        return NextResponse.json({
          success: false,
          error: `Token verification failed: ${tokenError.message}`,
          tokenPresent: true,
          tokenLength: token.length
        });
      } else {
        console.log('❌ Token verification failed:', tokenError);
        return NextResponse.json({
          success: false,
          error: 'Token verification failed: Unknown error',
          tokenPresent: true,
          tokenLength: token.length
        });
      }
    }

    if (!decoded) {
      return NextResponse.json({
        success: false,
        error: 'Token decoded but no data found'
      });
    }

    // Check if user exists and has interpreter profile
    const interpreter = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { interpreterProfile: true }
    });

    console.log('👤 User lookup result:', {
      userFound: !!interpreter,
      userRole: interpreter?.role,
      hasProfile: !!interpreter?.interpreterProfile,
      profileId: interpreter?.interpreterProfile?.id
    });

    if (!interpreter) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
        decodedUserId: decoded.userId,
        decodedRole: decoded.role
      });
    }

    if (interpreter.role !== 'INTERPRETER') {
      return NextResponse.json({
        success: false,
        error: `User role is ${interpreter.role}, not INTERPRETER`,
        actualRole: interpreter.role,
        expectedRole: 'INTERPRETER'
      });
    }

    if (!interpreter.interpreterProfile) {
      return NextResponse.json({
        success: false,
        error: 'User exists but has no interpreter profile',
        userId: interpreter.id,
        userRole: interpreter.role
      });
    }

    // ✅ Success
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: interpreter.id,
        email: interpreter.email,
        role: interpreter.role,
        name: interpreter.name
      },
      interpreter: {
        id: interpreter.interpreterProfile.id,
        firstName: interpreter.interpreterProfile.firstName,
        lastName: interpreter.interpreterProfile.lastName,
        status: interpreter.interpreterProfile.status
      },
      token: {
        valid: true,
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Auth check error:', error);
      return NextResponse.json({
        success: false,
        error: `Server error: ${error.message}`,
        stack: error.stack?.split('\n').slice(0, 3)
      });
    }
    console.error('Auth check unknown error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error: Unknown error'
    });
  }
}
