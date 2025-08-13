import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWTToken } from '@/lib/utils/credentials';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/interpreter/test-auth - Test interpreter authentication
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing interpreter authentication...');
    
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      console.log('❌ No auth-token cookie found');
      return NextResponse.json({
        error: 'Authentication required',
        debug: {
        cookiesFound: Object.fromEntries(Array.from(request.cookies)),
          headers: Object.fromEntries(request.headers.entries())
        }
      }, { status: 401 });
    }

    console.log(`✅ Found auth-token: ${token.substring(0, 20)}...`);

    // Verify token
    let decoded;
    try {
      decoded = verifyJWTToken(token);
      console.log(`✅ Token verified successfully`);
      console.log(`   User ID: ${decoded.userId}`);
      console.log(`   Email: ${decoded.email}`);
      console.log(`   Role: ${decoded.role}`);
      console.log(`   Profile ID: ${decoded.interpreterProfileId}`);
    } catch (error) {
      console.log(`❌ Token verification failed: ${error instanceof Error ? error.message : String(error)}`);
      return NextResponse.json({
        success: false,
        message: 'Token verification failed',
        error: {
          verificationError: error instanceof Error ? error.message : String(error)
        }
      }, { status: 401 });
    }

    if (decoded.role !== 'INTERPRETER') {
      console.log(`❌ Invalid role: ${decoded.role}`);
      return NextResponse.json({
        error: 'Not an interpreter account',
        debug: {
          actualRole: decoded.role,
          expectedRole: 'INTERPRETER'
        }
      }, { status: 403 });
    }

    // Get interpreter profile
    const interpreter = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        role: 'INTERPRETER'
      },
      include: {
        interpreterProfile: {
          include: {
            languages: true
          }
        }
      }
    });

    if (!interpreter || !interpreter.interpreterProfile) {
      console.log(`❌ Interpreter profile not found for user ID: ${decoded.userId}`);
      return NextResponse.json({
        error: 'Interpreter profile not found',
        debug: {
          userId: decoded.userId,
          interpreterExists: !!interpreter,
          profileExists: !!interpreter?.interpreterProfile
        }
      }, { status: 404 });
    }

    console.log(`✅ Found interpreter: ${interpreter.interpreterProfile.firstName} ${interpreter.interpreterProfile.lastName}`);

    // Get session count
    const sessionCount = await prisma.interpreterSession.count({
      where: { interpreterProfileId: interpreter.interpreterProfile.id }
    });

    // Get recent sessions
    const recentSessions = await prisma.interpreterSession.findMany({
      where: { interpreterProfileId: interpreter.interpreterProfile.id },
      orderBy: { scheduledAt: 'desc' },
      take: 5
    });

    console.log(`✅ Found ${sessionCount} total sessions`);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      interpreter: {
        id: interpreter.id,
        email: interpreter.email,
        profileId: interpreter.interpreterProfile.id,
        firstName: interpreter.interpreterProfile.firstName,
        lastName: interpreter.interpreterProfile.lastName,
        status: interpreter.interpreterProfile.status
      },
      sessionData: {
        totalSessions: sessionCount,
        recentSessions: recentSessions.slice(0, 3).map(s => ({
          id: s.id,
          type: s.sessionType,
          language: `${s.languageFrom} → ${s.languageTo}`,
          client: s.clientName,
          status: s.status,
          date: s.scheduledAt.toISOString().split('T')[0],
          earnings: s.earnings
        }))
      },
      debug: {
        tokenValid: true,
        userFound: true,
        profileFound: true,
        sessionsFound: sessionCount > 0
      }
    });

  } catch (error) {
    console.error('❌ Test auth error:', error);
    
    return NextResponse.json({
      error: 'Authentication test failed',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error
      }
    }, { status: 500 });
  }
}
